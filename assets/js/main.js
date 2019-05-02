$(function () {
    'use strict';

    var mintNewNameTPL = 'mint_new_';
    var mintNewItem = 0;
    let mintForms = {};
    let chartWrapperName = 'chart-wrapper';

    $('input[type="checkbox"].flat-blue, input[type="radio"].flat-blue').iCheck({
        checkboxClass: 'icheckbox_flat-blue',
        radioClass: 'iradio_flat-blue',
        increaseArea: '20%'
    });

    $('.chkx-toogle-main').bootstrapToggle({
        on: 'YES',
        off: 'NO'
    });

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
        errorPlacement: function () {
            return false;
        },
        highlight: function (element) {
            $(element).addClass('error');
        }
    });
    $("#step_3").validate({
        rules: {
            tkn_owner: {
                required: true
            }
        },
        errorPlacement: function () {
            return false;
        },
        highlight: function (element) {
            $(element).addClass('error');
        }
    });

    let blocksFilled = [];
    blocksFilled[1] = false;
    blocksFilled[3] = false;

    var block_1_fields = {};
    $('#step_1').on('change click keyup', 'input', function () {
        blocksFilled[1] = false;
        let element = $(this).attr('name');
        if (!block_1_fields[element]) {
            block_1_fields[element] = 0;
        }
        block_1_fields[element] = $(this).valid() ? 1 : 0;

        const propOwn = Object.getOwnPropertyNames(block_1_fields);
        if (3 === propOwn.length) {
            try {
                for (var prop in block_1_fields) {
                    if (0 === block_1_fields[prop]) {
                        throw new Error();
                    }
                }
                blocksFilled[1] = true;
            } catch (e) {
            }
        }
        updateBlocksAvailability();
    });

    var block_3_fields = {};
    $('#step_3').on('change click keyup', 'input', function () {
        let element = $(this).attr('name');
        if (!block_3_fields[element]) {
            block_3_fields[element] = 0;
        }
        block_3_fields[element] = $(this).valid() ? 1 : 0;
        blocksFilled[3] = !!block_3_fields[element];
        updateBlocksAvailability();
    });

    function updateBlocksAvailability() {
        if (blocksFilled[1]) {
            setBlocksAvailable('step_3')
        } else {
            setBlocksUnavailable('step_3');
            setBlocksUnavailable('step_4');
            setBlocksUnavailable('step_5');
            setNewMintsStatus(0);
            setBlocksUnavailable(chartWrapperName);
        }
        if (blocksFilled[1] && blocksFilled[3]) {
            setBlocksAvailable('step_4');
            setBlocksAvailable('step_5');
            $("#create").removeClass('disabled');
            setNewMintsStatus(1);
            setBlocksAvailable(chartWrapperName);
        } else {
            setBlocksUnavailable('step_4');
            setBlocksUnavailable('step_5');
            $("#create").addClass('disabled');
            setNewMintsStatus(0);
            setBlocksUnavailable(chartWrapperName);
        }
    }

    function setBlocksAvailable(formId) {
        $('#' + formId).parent().find('div.overlay').hide();
    }

    function setBlocksUnavailable(formId) {
        $('#' + formId).parent().find('div.overlay').show();
    }


    $.validator.addMethod("need-validate", function (value, element) {
        updateChart();
        return !this.optional(element);
    }, "");

    var today = new Date();
    var offsetHours = -today.getTimezoneOffset() / 60;
    offsetHours = (offsetHours >= 0 ? '+' + offsetHours : offsetHours);

    $('#mint_new').on('click', function (e) {
        mintNewItem++;
        let block = $('#mint_new_tpl').html();
        let formId = mintNewNameTPL + mintNewItem;
        block = block.replace(/%%MINT_NEW_FORM_ID%%/g, formId);
        block = block.replace(/%%FRM-NUM%%/g, mintNewItem);
        block = block.replace(/UTC/g, "UTC" + offsetHours);

        block = $(block);
        block.find('.frozen_use')
            .bootstrapToggle({
                on: 'YES',
                off: 'NO'
            })
            .change(function () {
                let $this = $(this);
                let formId = $this.data('form') || 0;
                if ($this.prop('checked')) {
                    $('[name="mint_new[' + formId + '][frozen]"]', block).removeAttr('disabled');
                } else {
                    $('[name="mint_new[' + formId + '][frozen]"]', block).prop('disabled', true);
                }
            });

        let dd = String(today.getDate()).padStart(2, '0');
        let mm = String(today.getMonth() + 1).padStart(2, '0');
        let yyyy = today.getFullYear();
        let todayFormatted = dd + '.' + mm + '.' + yyyy;

        block.find('.datepicker')
            .val(todayFormatted)
            .datepicker({
                format: "dd.mm.yyyy",
                startDate: todayFormatted,
                language: "ru",
                autoclose: true,
                todayHighlight: true,
                orientation: "top auto"
            });

        block.find("#" + formId)
            .on('change click keyup', '.need-validate', function () {
                updateFormStateStorage(formId, $(this));
                let isNeedUpdateChart = checkForm(formId);
                if (isNeedUpdateChart) {
                    updateChart();
                }
            })
            .on('keyup', '.watch-changes', function () {
                let isNeedUpdateChart = checkForm(formId);
                if (isNeedUpdateChart) {
                    updateChart();
                }
            })
            .validate({
                errorPlacement: function () {
                    return false;
                },
                highlight: function (element) {
                    $(element).addClass('error');
                }
            });

        block.insertBefore("#mint_new_main");
    });

    $('#mint_new_wrapper').on('click', '.mint-new-cancel', function () {
        let wrapper = $(this).data('wrapper') || false;
        if (wrapper) {
            delete mintForms[wrapper];
            $('[data-id=' + wrapper + ']', $('#mint_new_wrapper')).remove();
            updateChart();
        }
    });

    $('#tkn_symbol').on('keyup', function () {
        updateChart();
    });

    $('#clear').on('click', function () {
        $("input[type=text], input[type=number]").val('');
        $("#tkn_type_1").iCheck('check');
        $("#create").addClass('disabled');
        setBlocksUnavailable('step_3');
        setBlocksUnavailable('step_4');
        setBlocksUnavailable('step_5');
        $("form[id^='" + mintNewNameTPL + "']").each(function () {
            $(this).remove();
        });
        mintForms = {};
        updateChart();
    });

    $("#create").on('click', function () {
        let params = {
            'name': $('#tkn_name').val() || null,
            'symbol': $('#tkn_symbol').val() || null,
            'decimals': $('#tkn_decimals').val() || null,
            'owner': $('#tkn_owner').val() || null,
            'minting': [],
            'mintingFeature': String($("input[name='future_minting_use']").prop('checked')),
        };

        let collectedData = collectMintNewData();
        collectedData.forEach(function (element) {
            params.minting.push({
                'address': element.addr,
                'addressName': element.name.length ? element.name : '',
                'tokens': element.tkns,
                'frozen': element.frozen
            });
        });

        let contractHandler = new generatorContract();
        contractHandler.newContract(params);
        let contract = contractHandler.getPreview();
        if(contract.length){
            $("#preview").html('<pre><code>' + contract + '</code></pre>');
        } else {
            console.log('Code contract empty.');
        }
    });

    let setNewMintsStatus = function (statusNew) {
        statusNew = statusNew || 0;
        for (let i = 1; i <= mintNewItem; ++i) {
            let formId = mintNewNameTPL + i;
            statusNew ? setBlocksAvailable(formId) : setBlocksUnavailable(formId);
        }
    };

    let updateFormStateStorage = function (formId, el) {
        let fieldId = el.attr('id') || false;
        if (!mintForms[formId]) {
            mintForms[formId] = {};
        }
        if (fieldId) {
            mintForms[formId][fieldId] = el.valid() ? 1 : 0;
        }
    };

    let checkForm = function (formId) {
        let result = false;
        $(".need-validate", "#" + formId).each(function (key, el) {
            let form = mintForms[formId] || false;
            if (form) {
                let fieldId = $(this).attr('id') || false;
                let fieldValid = mintForms[formId][fieldId] || false;
                if (!fieldId || !fieldValid) {
                    result = false;
                    return false;
                }
                result = true;
            }
        });

        if (result) {
            const propOwn = Object.getOwnPropertyNames(mintForms[formId]);
            if (2 !== propOwn.length) {
                result = false;
            }
        }

        return result;
    };

    let updateChart = function () {
        let data = collectMintNewDataForChart();

        $("#" + chartWrapperName).hide();

        if (data.amount > 0) {

            $("input[name='future_minting_use']")
                .prop('disabled', false)
                .change()
                .prop('checked', true)
                .change();

            $("#" + chartWrapperName).show();
            configChart.data.datasets.forEach(function (dataset) {
                dataset.data = data.tokens;
            });
            configChart.data.labels = data.address;
            configChart.options.title.text = i18next.t('eth_tkn_contract:chart.title') + data.amount + ' ' + $('#tkn_symbol').val();
            window.mintChart.update();
        } else {
            $("input[name='future_minting_use']")
                .prop('checked', true)
                .change()
                .prop('disabled', true)
                .change();
        }
    };

    let collectMintNewData = function () {
        let collectedData = [];
        $("form[id^='" + mintNewNameTPL + "']").each(function (formNum) {
            if (!collectedData[formNum]) {
                collectedData[formNum] = {'addr': '', 'name': '', 'tkns': '', 'frozen': false};
            }
            let fields = $(this).find(":input");
            fields.each(function (key, field) {
                field = $(field);
                let fieldName = field.data('name') || '';
                if ('address' === fieldName) {
                    collectedData[formNum].addr = field.val();
                } else if ('name' === fieldName) {
                    collectedData[formNum].name = field.val();
                } else if ('amount' === fieldName) {
                    collectedData[formNum].tkns = Number(field.val());
                } else if ('frozen_use' === fieldName && field.prop('checked')) {
                    field = $(fields[key+1]);
                    collectedData[formNum].frozen = field.val();
                }
            })
        });
        return collectedData;
    };

    let collectMintNewDataForChart = function () {
        let res = {'address': [], 'tokens': [], 'amount': 0};
        let collectedData = collectMintNewData();
        collectedData.forEach(function (element) {
            res.address.push(element.name.length ? element.name : element.addr);
            res.tokens.push(element.tkns);
            res.amount = Number(res.amount) + Number(element.tkns);
        });
        return res;
    };
});