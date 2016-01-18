/**
 * Created by Andy on 09.01.2016.
 */
document.addEventListener("DOMContentLoaded", runCalculator);

function runCalculator() {
    var Calculator = Backbone.View.extend({
        el: $(this),
        initialize: function() {
            this.operand1 = 0;
            this.operation = '';
            this.startOperandMode = true;
            this.memory = 0;
            this.valueToOperationMap = {
                'divide' : '/',
                'multiply' : '*',
                'subtract' : '-',
                'sum' : '+'
            };
            this.keyClassMap = {
                '61': '.bcalc',
                '45': '.bminus',
                '43': '.bsum',
                '47': '.bdiv',
                '42': '.bmul',
                '48': '.b0',
                '49': '.b1',
                '50': '.b2',
                '51': '.b3',
                '52': '.b4',
                '53': '.b5',
                '54': '.b6',
                '55': '.b7',
                '56': '.b8',
                '57': '.b9',
                '46': '.bdot',
                '44': '.bdot',
                '37': '.bperc',
                '99': '.bc'
            };
        },
        events: {
            'click .membutton': "memoryButtonClick",
            'click .numbutton': "numberButtonClick",
            'click .mathbutton': "mathButtonClick",
            'click .singlemathbutton': "singleMathButtonClick",
            'click .opbutton': "clearButtonClick",
            'keypress': 'pressKeyboardKey'
        },
        pressKeyboardKey: function(event){
            if (this.keyClassMap[event.which]) {
                $(this.keyClassMap[event.which]).click();
            }

        },
        memoryButtonClick: function(event) {
            switch ($(event.target).attr('value')) {
                case 'memoryClear': {
                    // MC
                    this.memory = 0;
                    $('.bmr').removeClass('membuttonfull');
                    break;
                }
                case 'memoryRetrieve': {
                    //MR
                    if (this.memory !== 0) {
                        $('.output').text(this.memory);
                    }
                    break;
                }
                case 'memorySet': {
                    //MS
                    if ($('.output').text() !== '0') {
                        this.memory = +$('.output').text();
                        $('.bmr').addClass('membuttonfull');
                    }
                    break;
                }
                case 'memoryPlus': {
                    //M+
                    if ($('.output').text() !== '0') {
                        this.memory += +$('.output').text();
                        $('.bmr').addClass('membuttonfull');
                    }
                    break;
                }
                case 'memoryMinus': {
                    //M-
                    if ($('.output').text() !== '0') {
                        this.memory -= +$('.output').text();
                        $('.bmr').addClass('membuttonfull');
                    }
                    break;
                }
            }
        },
        numberButtonClick: function(event) {
            // Check if clean-up needed to get new value
            if (this.startOperandMode) {
                $('.output').text('');
                this.startOperandMode = false;
            }

            if ($('.output').text().length < 16) {
                switch ($(event.target).text()) {
                    case '0': {
                        if ($('.output').text() != '0') {
                            $('.output').text($('.output').text() + $(event.target).text());
                        }
                        break;
                    }
                    case '.': {
                        if ($('.output').text().indexOf('.') == -1) {
                            if ($('.output').text() === '') {
                                $('.output').text('0' + $(event.target).text());
                            } else {
                                $('.output').text($('.output').text() + $(event.target).text());
                            }

                        }
                        break;
                    }
                    default: {
                        if($('.output').text() != '0') {
                            $('.output').text($('.output').text() + $(event.target).text());
                        } else {
                            $('.output').text($(event.target).text());
                        }
                    }

                }
            }

        },
        mathButtonClick: function(event) {

            this.startOperandMode = true;

            switch ($(event.target).attr('value')) {
                case 'divide':
                case 'multiply':
                case 'subtract':
                case 'sum': {
                    this.operand1 = +$('.output').text();
                    this.operation = this.valueToOperationMap[$(event.target).attr('value')];
                    $('.log').text(this.operand1 + ' ' + this.operation);
                    break;
                }

                case 'calculate':{
                    if (this.operation !== '') {
                        $('.log').text('');
                        $('.output').text(calculate(this.operand1, $('.output').text(), this.operation));
                        this.operation = '';
                    }
                    break;
                }
            }

            function calculate (opOne, opTwo, action) {
                switch (action) {
                    case '/': {
                        if (opTwo == '0') {
                            return "Infinity";
                        }
                        return +opOne/+opTwo;
                    }
                    case '*': {
                        return +opOne * +opTwo;
                    }
                    case '+': {
                        return (+opOne) + (+opTwo);
                    }
                    case '-': {
                        return (+opOne) - (+opTwo);
                    }
                }
            }
        },
        singleMathButtonClick: function(event) {
            switch ($(event.target).attr('value')) {
                case 'plusMinus': {
                    $('.output').text(-1* +$('.output').text());
                    break;
                }
                case 'sqrt': {
                    $('.output').text(Math.sqrt(+$('.output').text()));
                    break;
                }
                case 'percentage': {
                    if (this.operand1 !== 0) {
                        $('.output').text(+$('.output').text() * this.operand1/ 100);
                    } else $('.output').text(0);
                    break;
                }
                case 'oneDivideX': {
                    $('.output').text(1/ +$('.output').text());
                    break;
                }
            }
        },
        clearButtonClick: function(event) {
            switch ($(event.target).attr('value')) {
                case 'backspace': {
                    var text = $('.output').text();
                    if (text === 'Infinity' || text.length === 1) {
                        $('.output').text('0');
                    } else {
                        $('.output').text(text.slice(0, -1));
                    }
                    break;
                }
                case 'clear': {
                    cleanOut('c');
                    break;
                }
                case 'cancelEntry': {
                    cleanOut('ce');
                    break;
                }
            }

            function cleanOut(cleanMode) {
                $('.output').text('0');
                this.startOperandMode = true;

                if (cleanMode == 'c') {
                    $('.log').text('');
                    this.operand1 = 0;
                    this.operation = '';
                }
            }
        }

    });

    var calculator = new Calculator();
}

