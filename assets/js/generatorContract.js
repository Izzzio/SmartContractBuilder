'use strict';

class generatorContract extends generatorMain{
    constructor() {
        super();
        this.contract = "";
    }

    create(params){
        if(params.name){
            this.addName(params.name);
        }
    }

    getPreview(){
        return this.contract;
    }

    addName(name){
        let block = "";
        block += this.blockCommentBegin + this.newLine;
        block += this.blockCommentStartLine + "Token full name" + this.newLine;
        block += this.blockCommentStartLine + "@type {string}" + this.newLine;
        block += this.blockCommentEnd + this.newLine;
        block += "const TOKEN_NAME = '" + name + "';";
        block += this.newLine + this.newLine;
        this.contract += block;
    }
}



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

/*
var content = "What's up , hello world";
var filename = "contract.js";

var blob = new Blob([content], {
    type: "application/javascript;charset=utf-8"
});

saveAs(blob, filename);
*/