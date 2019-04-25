'use strict';

class generatorContract extends generatorMain {
    constructor() {
        super();
        this.mintingFeature = true;
        this.contract = "";
    }

    newContract(params) {
        if (params.name) {
            this.addName(params.name);
        }
        if (params.symbol) {
            this.addSymbol(params.symbol);
        }
        if (params.decimals) {
            this.addDecimals(params.decimals);
        }
        if (params.mintingFeature) {
            this.mintingFeature = mintingFeature;
        }

        this.buildContract();
        this.addMethodInit();
        this.addMethodContractInfo();
    }

    getPreview() {
        return this.contract;
    }

    addIndents(count) {
        let res = '';
        count = Number(count) || 0;
        for (let i = 0; i < count; i++) {
            res += this.indent;
        }
        return res;
    }

    addComments(comments, indentsCount) {
        indentsCount = (Number(indentsCount) + 1) || 1;
        let block = '';
        let blockCommentStartLine = this.addIndents(indentsCount) + this.blockCommentStartLine + this.indent;
        let newLine = this.newLine;
        block += this.blockCommentBegin + this.newLine;
        comments.forEach(function (comment) {
            block += blockCommentStartLine + comment + newLine;
        });
        block += this.addIndents(indentsCount) + this.blockCommentEnd + this.newLine;

        return block;
    }

    addName(name) {
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

    addSymbol(symbol) {
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

    addDecimals(numberDigits) {
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

    buildContract() {
        let block = this.newLine + this.newLine;
        let comments = [
            'Main token contract'
        ];
        block += this.addComments(comments);
        block += "class MyToken extends TokenContract {";
        block += this.newLine + this.newLine;
        this.contract += block;
    }

    addMethodInit() {
        let block = this.addIndents(4);
        let comments = [
            'Initialization method',
            '@param {Boolean} mintable  Can mintable by owner in feature?'
        ];
        block += this.addComments(comments, 4);
        block += this.addIndents(4);
        block += "init(mintable = "+this.mintingFeature+") {" + this.newLine;
        block += this.addIndents(8);
        block += "super.init();" + this.newLine;
        block += this.addIndents(4);
        block += "}" + this.newLine;
        this.contract += block;
    }

    addMethodContractInfo() {
        let block = this.newLine;
        block += this.addIndents(4);
        let comments = [
            'Basic contract info',
            '@return {{owner: string, ticker: string, name: string}}'
        ];
        block += this.addComments(comments, 4);
        block += this.addIndents(4);
        block += "get contract() {" + this.newLine;
        block += this.addIndents(8);
        block += "return {" + this.newLine;
        block += this.addIndents(12);
        block += "name: NAME," + this.newLine;
        block += this.addIndents(12);
        block += "ticker: TICKER," + this.newLine;
        block += this.addIndents(12);
        block += "owner: OWNER," + this.newLine;
        block += this.addIndents(12);
        block += "type: 'token'" + this.newLine;
        block += this.addIndents(8);
        block += "};" + this.newLine;
        block += this.addIndents(4);
        block += "}" + this.newLine;
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