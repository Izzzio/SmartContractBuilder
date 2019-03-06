$(function () {
    'use strict'

    /**
     * Get access to plugins
     */

    $('[data-toggle="control-sidebar"]').controlSidebar()
    $('[data-toggle="push-menu"]').pushMenu()
    var $pushMenu = $('[data-toggle="push-menu"]').data('lte.pushmenu')
    var $controlSidebar = $('[data-toggle="control-sidebar"]').data('lte.controlsidebar')
    var $layout = $('body').data('lte.layout')
    $(window).on('load', function() {
        // Reinitialize variables on load
        $pushMenu = $('[data-toggle="push-menu"]').data('lte.pushmenu')
        $controlSidebar = $('[data-toggle="control-sidebar"]').data('lte.controlsidebar')
        $layout = $('body').data('lte.layout')
    })

    $('[data-toggle="tooltip"]').tooltip()


    //Flat red color scheme for iCheck
    $('input[type="checkbox"].flat-blue, input[type="radio"].flat-blue').iCheck({
        checkboxClass: 'icheckbox_flat-blue',
        radioClass   : 'iradio_flat-blue'
    });





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
                        tkn_type: {
                            label: "Choose Type of Token",
                        },
                        type_1: {
                            label: "ERC-20",
                            help: "ERC-20 is recommended option. Accepted by the most exchanges."
                        },
                        type_2: {
                            label: "ERC-223",
                            help: "ERC-223 is almost the same as ERC-20. Provides extra safety during token transfers."
                        }
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

        $('.lang-select').click(function() {
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
    }


    $("#step_1").validate({
        rules: {
            tkn_name: {
                required: true
            },
            tkn_symbol: {
                required: true
            },
            tkn_decimals: {
                required: true
            }
        },
        errorPlacement: function(){
            return false;
        },
        highlight: function(element) {
            $(element).addClass('error');
        }
    //}).form(); //rules auto enable
    });
    $('input').on('click', function () {
        $('input[name="'+$(this).attr('name')+'"]').valid();
    });
});