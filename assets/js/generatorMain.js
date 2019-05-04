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
}