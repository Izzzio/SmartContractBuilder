'use strict';

class generatorContract extends generatorMain{
    constructor() {
        super();
        this.contract = "";
    }

    newContract(params){
        if(params.name){
            this.addName(params.name);
        }
        if(params.symbol){
            this.addSymbol(params.symbol);
        }
        if(params.decimals){
            this.addDecimals(params.decimals);
        }
    }

    getPreview(){
        return this.contract;
    }

    addComments(comments){
        let block = '';
        let blockCommentStartLine = this.blockCommentStartLine;
        let newLine = this.newLine;
        block += this.blockCommentBegin + this.newLine;
        comments.forEach(function(comment) {
            block += blockCommentStartLine + comment + newLine;
        });
        block += this.blockCommentEnd + this.newLine;

        return block;
    }

    addName(name){
        let block = '';
        let comments = [
            'Token full name',
            '@type {string}'
        ];
        block += this.addComments(comments);
        block += "const NAME = '" + name + "';";
        block += this.newLine + this.newLine;
        this.contract += block;
    }

    addSymbol(symbol){
        let block = '';
        let comments = [
            'Token ticker',
            '@type {string}'
        ];
        block += this.addComments(comments);
        block += "const TICKER = '" + symbol + "';";
        block += this.newLine + this.newLine;
        this.contract += block;
    }

    addDecimals(numberDigits){
        let block = '';
        let comments = [
            'Number of decimals for token',
            '@type {string}'
        ];
        block += this.addComments(comments);
        block += "const DECIMALS = '" + numberDigits + "';";
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