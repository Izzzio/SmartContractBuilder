'use strict';

class generatorContract extends generatorMain {
    constructor() {
        super();

        /*
        Minting tokens on addresses right now, without frozen
         */
        this.minting = [];

        /*
        Tokens must be frozen for addresses.
         */
        this.frozen = {};

        /*
        Need add method for get tokens that have freeze is over
         */
        this.needUnfreeze = false;

        this.mintingFeature = true;
        this.contract = "";
    }

    newContract(params) {
        if(params.name) {
            this.addName(params.name.trim());
        }
        if(params.symbol) {
            this.addSymbol(params.symbol.trim());
        }
        if(params.decimals) {
            this.addDecimals(params.decimals);
        }
        if(params.owner) {
            this.addOwner(params.owner.trim());
        }
        if(params.minting) {
            let tokenAddress = false;
            for (let i = 0; i < params.minting.length; i++) {
                if(Number(params.minting[i].tokens) > 0) {
                    tokenAddress = params.minting[i].address.trim();
                    if(params.minting[i].frozen) {
                        if(!this.frozen.hasOwnProperty(tokenAddress)) {
                            this.frozen[tokenAddress] = [];
                        }
                        this.frozen[tokenAddress].push({
                            'addressName': params.minting[i].addressName.trim(),
                            'tokens': params.minting[i].tokens,
                            'frozen': moment(moment(params.minting[i].frozen, "DD.MM.YYYY")).valueOf()
                        });
                    } else {
                        this.minting.push({
                            'address': tokenAddress,
                            'addressName': params.minting[i].addressName.trim(),
                            'tokens': params.minting[i].tokens
                        });
                    }
                }
            }
        }

        if(params.mintingFeature) {
            this.mintingFeature = params.mintingFeature;
        }

        this.buildContract();
        this.addMethodInit();
        this.addMethodContractInfo();

        if(this.needUnfreeze) {
            this.addMethodUnfreeze();
        }

        this.finishContract();
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

    addCommentsBlock(comments, indentsCount) {
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

    addCommentsLine(comment, indentsCount) {
        indentsCount = (Number(indentsCount)) || 0;
        let block = '';
        block += this.addIndents(indentsCount) + this.lineCommentBegin + this.indent + comment + this.newLine;

        return block;
    }

    addName(name) {
        let block = '';
        let comments = [
            'Token full name',
            '@type {string}'
        ];
        block += this.addCommentsBlock(comments);
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
        block += this.addCommentsBlock(comments);
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
        block += this.addCommentsBlock(comments);
        block += "const DECIMALS = '" + numberDigits + "';";
        block += this.newLine + this.newLine;
        this.contract += block;
    }

    addOwner(address) {
        let block = '';
        let comments = [
            'Address of main contract owner',
            '@type {string}'
        ];
        block += this.addCommentsBlock(comments);
        block += "const OWNER = '" + address + "';";
        block += this.newLine + this.newLine;
        this.contract += block;
    }

    buildContract() {
        let block = '';
        let comments = [
            'Main token contract'
        ];
        block += this.addCommentsBlock(comments);
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
        block += this.addCommentsBlock(comments, 4);
        block += this.addIndents(4);
        block += "init(mintable = " + this.mintingFeature + ") {" + this.newLine;
        block += this.addIndents(8);
        block += "super.init(0, mintable);" + this.newLine;

        if(Object.keys(this.frozen).length) {
            this.needUnfreeze = true;
            block += this.newLine;
            block += this.addCommentsLine('Storage of frozen tokens', 8);
            block += this.addIndents(8);
            block += "this._dbFrozen = new BlockchainMap('frozen_tokens');" + this.newLine;
            block += this.addIndents(8);
            block += "if (contracts.isDeploy()) {" + this.newLine;
            for (let address in this.frozen) {
                if(!this.frozen.hasOwnProperty(address)) {
                    continue;
                }
                block += this.addIndents(12);
                block += "this._dbFrozen['" + address + "'] = [" + this.newLine;
                for (let j = 0; j < this.frozen[address].length; j++) {
                    block += this.addIndents(16) + "{" + this.newLine;
                    if(this.frozen[address][j].addressName) {
                        block += this.addIndents(20);
                        block += "'addressName': '" + this.frozen[address][j].addressName + "'," + this.newLine;
                    }
                    block += this.addIndents(20);
                    block += "'frozen': " + this.frozen[address][j].frozen + "," + this.newLine;
                    block += this.addIndents(20);
                    block += "'tokens': " + this.frozen[address][j].tokens + this.newLine;
                    block += this.addIndents(16) + "}" + ((j === this.frozen[address].length - 1) ? "" : ",") + this.newLine;
                }
                block += this.addIndents(12);
                block += "];" + this.newLine;
            }
            block += this.addIndents(8);
            block += "}" + this.newLine;
        }

        if(this.minting.length) {
            block += this.addIndents(8);
            block += "if (contracts.isDeploy()) {" + this.newLine;
            for (let i = 0; i < this.minting.length; i++) {
                block += this.addIndents(12);
                block += "this._wallets.mint('" + this.minting[i].address + "', " + this.minting[i].tokens + ");" + this.newLine;
                block += this.addIndents(12);
                block += "this._MintEvent.emit('" + this.minting[i].address + "', new BigNumber(" + this.minting[i].tokens + "));" + this.newLine;
            }
            block += this.addIndents(8);
            block += "}" + this.newLine;
        }

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
        block += this.addCommentsBlock(comments, 4);
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

    addMethodUnfreeze() {
        let block = this.newLine;
        block += this.addIndents(4);
        let comments = [
            'Get tokens that have freeze is ended',
        ];
        block += this.addCommentsBlock(comments, 4);
        block += this.addIndents(4);
        block += "getTokensWithFreezeIsOver() {" + this.newLine;
        block += this.addIndents(8);
        block += "const addressForTokens = this._getSender();" + this.newLine;
        block += this.addIndents(8);
        block += "const currTimestamp = (new Date()).valueOf();" + this.newLine;
        block += this.addIndents(8);
        block += "let itemsFrozenForAddress = this._dbFrozen[addressForTokens] || null;" + this.newLine;
        block += this.addIndents(8);
        block += "assert.assert(itemsFrozenForAddress !== null, 'No frozen tokens');" + this.newLine;
        block += this.addIndents(8);
        block += "let cntTokensSent = 0;" + this.newLine;
        block += this.addIndents(8);
        block += "let cntItemsFrozenForAddress = itemsFrozenForAddress.length - 1;" + this.newLine;
        block += this.addIndents(8);
        block += "for (let i = cntItemsFrozenForAddress; i >= 0; i--) {" + this.newLine;
        block += this.addIndents(12);
        block += "if (itemsFrozenForAddress[i].tokens > 0 && currTimestamp > itemsFrozenForAddress[i].frozen) {" + this.newLine;
        block += this.addIndents(16);
        block += "cntTokensSent += itemsFrozenForAddress[i].tokens;" + this.newLine;
        block += this.addIndents(16);
        block += "this._wallets.mint(addressForTokens, itemsFrozenForAddress[i].tokens);" + this.newLine;
        block += this.addIndents(16);
        block += "this._MintEvent.emit(addressForTokens, new BigNumber(itemsFrozenForAddress[i].tokens));" + this.newLine;
        block += this.addIndents(16);
        block += "itemsFrozenForAddress.splice(i, 1);" + this.newLine;
        block += this.addIndents(12);
        block += "}" + this.newLine;
        block += this.addIndents(8);
        block += "}" + this.newLine;
        block += this.addIndents(8);
        block += "this._dbFrozen[addressForTokens] = itemsFrozenForAddress;" + this.newLine;
        block += this.addIndents(8);
        block += "if (cntTokensSent > 0) {" + this.newLine;
        block += this.addIndents(12);
        block += "console.log('Successfully sent: ' + cntTokensSent);" + this.newLine;
        block += this.addIndents(8);
        block += "} else if (itemsFrozenForAddress.length) {" + this.newLine;
        block += this.addIndents(12);
        block += "console.log('Tokens exist, but frozen.');" + this.newLine;
        block += this.addIndents(8);
        block += "} else {" + this.newLine;
        block += this.addIndents(12);
        block += "console.log('All tokens are already unfrozen and sent to you');" + this.newLine;
        block += this.addIndents(8);
        block += "}" + this.newLine;
        block += this.addIndents(4);
        block += "}" + this.newLine;
        this.contract += block;
    }

    finishContract() {
        let block = "}" + this.newLine + this.newLine;
        block += "global.registerContract(MyToken);";
        this.contract += block;
    }
}