'use strict';

class generatorMain {

    constructor(settings) {
        this.settings = settings;

        this.blockCommentBegin = '/**';
        this.blockCommentEnd = '*/';
        this.blockCommentStartLine = '*';

        this.lineCommentBegin = '//';

        this.newLine = '\n';
        this.indent = ' ';
    }

    downloadContract(filename, text) {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:application/javascript;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }
}