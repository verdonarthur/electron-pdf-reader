/**
 * @author Verdon Arthur
 * @date   05.09.2016
 * This file contain the function who manage the pdf 
 * */
 
const ipc = require('electron').ipcRenderer
const pdf = require('pdfjs-dist')
const fs = require('fs');

const selectDirBtn = document.getElementById('select-pdf')
const upBtn = document.getElementById('page-up-pdf')
const downBtn = document.getElementById('page-down-pdf')
const zoomInBtn = document.getElementById('zoom-in-pdf')
const zoomOutBtn = document.getElementById('zoom-out-pdf')

var currPage = 1;
var currZoom = 1;
var numPages;
var currentPDF;


pdf.PDFJS.workerSrc = './node_modules/pdfjs-dist/build/pdf.worker.js';

/**
 * 
 * */
selectDirBtn.addEventListener('click', function(event) {
    ipc.send('open-file-dialog')
})

/**
 * 
 * */
upBtn.addEventListener('click', function(event) {
    currPage--;
    if (pdf !== null && currPage <= numPages && currPage >= 1) {
        currentPDF.getPage(currPage).then(handlePages);
    } else {
        currPage++;
    }
})

/**
 * 
 * */
downBtn.addEventListener('click', function(event) {
    currPage++;
    if (pdf !== null && currPage <= numPages && currPage >= 1) {
        currentPDF.getPage(currPage).then(handlePages);
    } else {
        currPage--;
    }
})


/**
 * 
 * */
zoomInBtn.addEventListener('click', function(event){
    currZoom += 0.25;
    currentPDF.getPage(currPage).then(handlePages);
})

/**
 * 
 * */
zoomOutBtn.addEventListener('click', function(event){
    currZoom -= 0.25;
    currentPDF.getPage(currPage).then(handlePages);
})


/**
 * 
 * */
function handlePages(page) {
    //This gives us the page's dimensions at full scale
    var viewport = page.getViewport(currZoom);

    //We'll create a canvas for each page to draw it on
    var canvas = document.getElementById('pdf');
    canvas.style.display = "block";
    var context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    //Draw it on the canvas
    page.render({
        canvasContext: context,
        viewport: viewport
    });

    //Add it to the web page
    //document.body.appendChild( canvas );

    //Move to next page

}

/**
 * 
 * */
ipc.on('selected-directory', function(event, path) {
    var url = path[0];

    var data = new Uint8Array(fs.readFileSync(url));

    PDFJS.getDocument(data).then(function setCurrentPdf(pdf) {
        currentPDF = pdf;
        numPages = currentPDF.numPages;
        currentPDF.getPage(1).then(handlePages);
    });

})
