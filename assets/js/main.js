$(function () {
    'use strict';

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
        }
        if (blocksFilled[1] && blocksFilled[3]) {
            setBlocksAvailable('step_4');
            setBlocksAvailable('step_5');
            $('#save').removeClass('disabled');
        } else {
            setBlocksUnavailable('step_4');
            setBlocksUnavailable('step_5');
            $('#save').addClass('disabled');
        }
    }

    function setBlocksAvailable(formId) {
        $('#' + formId).parent().find('div.overlay').hide();
    }

    function setBlocksUnavailable(formId) {
        $('#' + formId).parent().find('div.overlay').show();
    }


    $.validator.addMethod("need-validate", function (value, element) {
        return !this.optional(element);
    }, "");

    var today = new Date();
    var offsetHours = -today.getTimezoneOffset() / 60;
    offsetHours = (offsetHours >= 0 ? '+' + offsetHours : offsetHours);

    var mintNewItem = 0;
    $('#mint_new').on('click', function (e) {
        mintNewItem++;
        let block = $('#mint_new_tpl').html();
        let formId = "mint_new_" + mintNewItem;
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

        /*
        TODO
        удалить форму из хранилища состояний
         */

        let wrapper = $(this).data('wrapper');
        $('[data-id=' + wrapper + ']', $('#mint_new_wrapper')).remove();
    });

    let mintForms = {};
    let updateFormStateStorage = function(formId, el){
        let fieldId = el.attr('id') || false;
        if (!mintForms[formId]) {
            mintForms[formId] = {};
        }
        if(fieldId){
            mintForms[formId][fieldId] = el.valid() ? 1 : 0;
        }
    };

    let checkForm = function (formId) {
        let result = false;
        $(".need-validate", "#" + formId).each(function (key, el) {
            let form = mintForms[formId] || false;
            if(form){
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
        $("#chart-wrapper").show();
        configChart.data.datasets.forEach(function(dataset) {
            dataset.data = dataset.data.map(function() {
                return randomScalingFactor();
            });
        });
        window.mintChart.update();
    };

    /*Customs for add persent on chart*/

    Chart.defaults.doughnutLabels = Chart.helpers.clone(Chart.defaults.doughnut);

    var helpers = Chart.helpers;
    var defaults = Chart.defaults;

    Chart.controllers.doughnutLabels = Chart.controllers.doughnut.extend({
        updateElement: function(arc, index, reset) {
            var _this = this;
            var chart = _this.chart,
                chartArea = chart.chartArea,
                opts = chart.options,
                animationOpts = opts.animation,
                arcOpts = opts.elements.arc,
                centerX = (chartArea.left + chartArea.right) / 2,
                centerY = (chartArea.top + chartArea.bottom) / 2,
                startAngle = opts.rotation, // non reset case handled later
                endAngle = opts.rotation, // non reset case handled later
                dataset = _this.getDataset(),
                circumference = reset && animationOpts.animateRotate ? 0 : arc.hidden ? 0 : _this.calculateCircumference(dataset.data[index]) * (opts.circumference / (2.0 * Math.PI)),
                innerRadius = reset && animationOpts.animateScale ? 0 : _this.innerRadius,
                outerRadius = reset && animationOpts.animateScale ? 0 : _this.outerRadius,
                custom = arc.custom || {},
                valueAtIndexOrDefault = helpers.getValueAtIndexOrDefault;

            helpers.extend(arc, {
                // Utility
                _datasetIndex: _this.index,
                _index: index,

                // Desired view properties
                _model: {
                    x: centerX + chart.offsetX,
                    y: centerY + chart.offsetY,
                    startAngle: startAngle,
                    endAngle: endAngle,
                    circumference: circumference,
                    outerRadius: outerRadius,
                    innerRadius: innerRadius,
                    label: valueAtIndexOrDefault(dataset.label, index, chart.data.labels[index])
                },

                draw: function () {
                    var ctx = this._chart.ctx,
                        vm = this._view,
                        sA = vm.startAngle,
                        eA = vm.endAngle,
                        opts = this._chart.config.options;

                    var labelPos = this.tooltipPosition();
                    var segmentLabel = vm.circumference / opts.circumference * 100;

                    ctx.beginPath();

                    ctx.arc(vm.x, vm.y, vm.outerRadius, sA, eA);
                    ctx.arc(vm.x, vm.y, vm.innerRadius, eA, sA, true);

                    ctx.closePath();
                    ctx.strokeStyle = vm.borderColor;
                    ctx.lineWidth = vm.borderWidth;

                    ctx.fillStyle = vm.backgroundColor;

                    ctx.fill();
                    ctx.lineJoin = 'bevel';

                    if (vm.borderWidth) {
                        ctx.stroke();
                    }

                    if (vm.circumference > 0.15) { // Trying to hide label when it doesn't fit in segment
                        ctx.beginPath();
                        ctx.font = helpers.fontString(opts.defaultFontSize, opts.defaultFontStyle, opts.defaultFontFamily);
                        ctx.fillStyle = "#fff";
                        ctx.textBaseline = "top";
                        ctx.textAlign = "center";

                        // Round percentage in a way that it always adds up to 100%
                        ctx.fillText(segmentLabel.toFixed(2) + "%", labelPos.x, labelPos.y);
                    }
                }
            });

            var model = arc._model;
            model.backgroundColor = custom.backgroundColor ? custom.backgroundColor : valueAtIndexOrDefault(dataset.backgroundColor, index, arcOpts.backgroundColor);
            model.hoverBackgroundColor = custom.hoverBackgroundColor ? custom.hoverBackgroundColor : valueAtIndexOrDefault(dataset.hoverBackgroundColor, index, arcOpts.hoverBackgroundColor);
            model.borderWidth = custom.borderWidth ? custom.borderWidth : valueAtIndexOrDefault(dataset.borderWidth, index, arcOpts.borderWidth);
            model.borderColor = custom.borderColor ? custom.borderColor : valueAtIndexOrDefault(dataset.borderColor, index, arcOpts.borderColor);

            // Set correct angles if not resetting
            if (!reset || !animationOpts.animateRotate) {
                if (index === 0) {
                    model.startAngle = opts.rotation;
                } else {
                    model.startAngle = _this.getMeta().data[index - 1]._model.endAngle;
                }

                model.endAngle = model.startAngle + model.circumference;
            }

            arc.pivot();
        }
    });

    /*Customs for add persent on chart. End.*/

    let configChart = {
        type: 'doughnutLabels',
        data: {
            datasets: [{
                data: [
                    120.12,
                    112.45,
                    33.33,
                    22.87,
                    10.09,
                ],
                backgroundColor: [
                    "#F7464A",
                    "#46BFBD",
                    "#FDB45C",
                    "#949FB1",
                    "#4D5360",
                ],
                label: 'Dataset 1'
            }],
            labels: [
                "Red",
                "Green",
                "Yellow",
                "Grey",
                "Dark Grey"
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Chart.js Doughnut Chart'
            },
            animation: {
                animateScale: true,
                animateRotate: true
            }
        }
    };

    var ctx = document.getElementById("chart-area").getContext("2d");
    window.mintChart = new Chart(ctx, configChart);
});