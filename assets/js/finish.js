$(function () {
    'use strict';

    /*
    function download(filename, text) {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:application/javascript;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }

    var filename = "contract.js";
    var text = 'text';
    download(filename, text);
    */

    var content = "What's up , hello world";
    var filename = "contract.js";

    var blob = new Blob([content], {
        type: "application/javascript;charset=utf-8"
    });

    saveAs(blob, filename);
});