$(function () {
    'use strict';

    i18next.init({
        tName: 't', // --> appends $.t = i18next.t
        i18nName: 'i18n', // --> appends $.i18n = i18next
        handleName: 'localize', // --> appends $(selector).localize(opts);
        selectorAttr: 'data-i18n', // selector for translating elements
        targetAttr: 'i18n-target', // data-() attribute to grab target element to translate (if different than itself)
        optionsAttr: 'i18n-options', // data-() attribute that contains options, will load/set if useOptionsAttr = true
        useOptionsAttr: false, // see optionsAttr
        parseDefaultValueFromContent: true, // parses default values from content ele.val or ele.text

        debug: false,
        lng: 'en',
        ns: {
            namespaces: ['eth_tkn_contract', 'page'],
            defaultNS: 'eth_tkn_contract'
        },
        resources: {
            en: {
                page: {
                    logo: {
                        big: "<b>iZ³</b> Tokensale platform"
                    },
                    copyrights: "All rights reserved."
                },
                eth_tkn_contract: {
                    menu: {
                        create: "Create contract"
                    },
                    header: {
                        main: "Token contract",
                        description: "(Main Ethereum Network)"
                    },
                    fields: {
                        name: {
                            label: "Token name:",
                            placeholder: "MyNewProjectToken",
                            help: "Enter name of the project without spaces, usually 5-25 symbols. Lower and uppercase can be used"
                        },
                        symbol: {
                            label: "Token symbol:",
                            placeholder: "NEW",
                            help: "Usually 3-4 Letters like ETH, BTC, NEO, WISH etc.. Please check that it’s unique before submission <a href='https://etherscan.com/tokens'>(https://etherscan.com/tokens)</a>"
                        },
                        decimals: {
                            label: "Decimals:",
                            help: "Defines the number of decimals for the token. 0-50 numerals are accepted. 18 as common practice"
                        },
                        type_1: {
                            label: "ERC-20",
                            help: "ERC-20 is recommended option. Accepted by the most exchanges."
                        },
                        type_2: {
                            label: "ERC-223",
                            help: "ERC-223 is almost the same as ERC-20. Provides extra safety during token transfers."
                        },
                        owner: {
                            label: "Token Owner:",
                            placeholder: "0xD0593B233Be4411A236F22b42087345E1137170b",
                            help: "ETH address (not exchange address). This address will be owner of the token (after sale end date). Double check the address (and access to it) before submission"
                        },
                        mint: {
                            label: "<i class='fas fa-plus-circle'></i>&nbsp;&nbsp;Mint tokens",
                            help: "You can reserve the tokens for Team, Bonuses, Bounties - these tokens will be created, but can’t be sold until token sale completion."
                        },
                        mint_new: {
                            label: "<i class='fas fa-plus-circle'></i>&nbsp;&nbsp;Mint tokens",
                            help: "You can reserve the tokens for Team, Bonuses, Bounties - these tokens will be created, but can’t be sold until token sale completion."
                        },
                        future_minting: {
                            label: "<i class='far fa-stop-circle text-primary'></i>&nbsp;&nbsp;Future Minting",
                            help: "Yes - you can create more tokens in the future & use token for Crowdsale.<br />No - no more tokens will be created in the future. Crowdsale is impossible."
                        }
                    },
                    blocks: {
                        mint_new: {
                            address: {
                                label: "Address",
                                placeholder: "Enter address of the recipient's wallet"
                            },
                            name: {
                                label: "Name"
                            },
                            amount: {
                                label: "Token amount"
                            },
                            frozen: {
                                label: "<i class='far fa-snowflake text-primary'></i>&nbsp;&nbsp;Frozen until date (UTC)"
                            }
                        },
                    },
                    tkn_type: {
                        label: "Choose Type of Token",
                    },
                    mint_new: {
                        label: "Define address for tokens (after minting it will be sent to this address)"
                    },
                    button: {
                        create: "Create",
                        clean: "<i class='far fa-times-circle'></i>&nbsp;&nbsp;Clean"
                    }
                }
            },
            ru: {
                eth_tkn_contract: {
                    menu: {
                        create: "Создать контракт"
                    },
                }
            }
        }
    }, (err, t) => {
        jqueryI18next.init(i18next, $);
        updateContent();

        $('.lang-select').click(function () {
            i18next.changeLanguage(this.innerHTML);
        });

        i18next.on('languageChanged', () => {
            updateContent();
        });
    });

    function updateContent() {
        $('.main-header').localize();
        $('.sidebar').localize();
        $('.content-wrapper').localize();
        $('.main-footer').localize();
        $('#mint_new_tpl').localize();
    }
});