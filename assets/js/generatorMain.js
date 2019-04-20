'use strict';

class generatorMain {

    constructor(settings) {
        this.settings = settings;

        this.blockCommentBegin = '/**';
        this.blockCommentEnd = ' */';
        this.blockCommentStartLine = ' * ';

        this.newLine = '\n';
    }
}