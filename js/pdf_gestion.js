const ipc = require('electron').ipcRenderer
const pdf = require('pdfjs-dist')
const fs = require('fs');
pdf.PDFJS.workerSrc = './node_modules/pdfjs-dist/build/pdf.worker.js';

const selectDirBtn = document.getElementById('select-pdf')

selectDirBtn.addEventListener('click', function(event) {
    ipc.send('open-file-dialog')
})

ipc.on('selected-directory', function(event, path) {
    //PDFJS.disableWorker = true;
    //document.getElementById('pdf').innerHTML = `You selected: ${path}`
    var url = path[0];
    console.log(url);

    var data = new Uint8Array(fs.readFileSync(url));

    PDFJS.getDocument(data).then(function getPdfHelloWorld(pdf) {
      //
      // Fetch the first page
      //
      pdf.getPage(1).then(function getPageHelloWorld(page) {
        var scale = 1.5;
        var viewport = page.getViewport(scale);

        //
        // Prepare canvas using PDF page dimensions
        //
        var canvas = document.getElementById('pdf');
        var context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        //
        // Render PDF page into canvas context
        //
        var renderContext = {
          canvasContext: context,
          viewport: viewport
        };
        page.render(renderContext);
      });
    });
})
