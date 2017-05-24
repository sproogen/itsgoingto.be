var answers = 0;
var answer = '';

$('textarea.input-field-question').bind('input', function() {
    if(this.value.length){
        $('.header-container').addClass('gone');
        $('.question-container').addClass('move-up');
        $('.answers').removeClass('gone');
        $('.options').removeClass('gone');
    }else{
        $('.header-container').removeClass('gone');
        $('.question-container').removeClass('move-up');
        $('.answers').addClass('gone');
        $('.options').addClass('gone');
    }
    updateSubmitButton();
});

function questionKeyPressed(){

    var key = event.keyCode || event.charCode;

    //Stop enter key submitting form
    if ( key === 13) {
        event.preventDefault();
    }

    if(this.value.length){
        if ( key === 13 || key === 40 ) {
            focusOnAnswer('1');
        }
    }
}

function canSubmitQuestion(){
    var input = $('textarea.input-field-question');
    if($.trim(input[0].value).length){
        if(getAnswerCount() >= 2){
            return true;
        }else{
            return false;
        }
    }else{
        return false;
    }
}

function updateSubmitButton(){
    if(canSubmitQuestion()){
        $('button.btn-question').removeClass('disabled');
    }else{
        $('button.btn-question').addClass('disabled');
    }
}

function answerUpdated(){
    var inputID = this.id;
    var arr = inputID.split('-');
    var answerNum = parseInt(arr[1]);

    if(this.value.length){
        if(answerNum > answers){
            answers = answerNum;
            addAnswer(answerNum);
        }
    }else{
        if(answerNum == answers){
            answers = getMaxAnswer();
            removeAnswer(answers+1);
            focusOnAnswer(answers+1);
        }
    }
    updateSubmitButton();
}

function keyPressed(){
    var inputID = this.id;
    var arr = 0;
    var answerNum = 0;

    var key = event.keyCode || event.charCode;

    //Stop enter key submitting form
    if ( key === 13) event.preventDefault();

    if(!this.value.length){
        //Back and delete key go back to previous question only when answer is empty
        if( key === 8 || key === 46 ){
            arr = inputID.split('-');
            answerNum = parseInt(arr[1]);

            if(answerNum > 1){
                if(answerNum > answers){
                    event.preventDefault();
                    focusOnAnswer(answerNum-1);
                }
            }else{
                event.preventDefault();
                focusOnQuestion();
            }
        }
    }else{
        // Enter key to go down only when some characters have been entered.
        if ( key === 13) {
            arr = inputID.split('-');
            answerNum = parseInt(arr[1]);
            focusOnAnswer(answerNum+1);
        }
    }
    // Up and down arrow keys to move up and down answers
    if ( key === 38 ) {
        arr = inputID.split('-');
        answerNum = parseInt(arr[1]);
        if(answerNum > 1){
            focusOnAnswer(answerNum-1);
        }else{
            focusOnQuestion();
        }
    } else if ( key === 40 ) {
        arr = inputID.split('-');
        answerNum = parseInt(arr[1]);
        focusOnAnswer(answerNum+1);
    }
}

function focusOnQuestion(){
    var input = $('textarea.input-field-question');
    if(!input.attr( "disabled" )){
        input.focus();
        setTimeout((function() {
            if(input[0]){
                var strLength = input[0].value.length;
                return function() {
                    if(input[0].setSelectionRange !== undefined) {
                        input[0].setSelectionRange(strLength, strLength);
                    } else {
                        $(input[0]).val(input[0].value);
                    }
            };
        }}(this)), 0);
    }
}

function focusOnAnswer(answer){
    var input = $('input[name="answer-'+answer+'"]');
    if(!input.attr( "disabled" )){
        input.focus();
        setTimeout((function() {
            if(input[0]){
                var strLength = input[0].value.length;
                return function() {
                    if(input[0].setSelectionRange !== undefined) {
                        input[0].setSelectionRange(strLength, strLength);
                    } else {
                        $(input[0]).val(input[0].value);
                    }
            };
        }}(this)), 0);
    }
}

function getMaxAnswer(){
    var maxID = 0;
    $('input.input-field-answer').each(function( index ) {
        if(this.value.length){
            maxID = index+1;
        }
    });
    return maxID;
}

function getAnswerCount(){
    var count = 0;
    $('input.input-field-answer').each(function( index ) {
        if($.trim(this.value).length){
            count += 1;
        }
    });
    return count;
}

function addAnswer(num){
    $('.answers .input-answer:eq('+num+')').removeClass('input-disabled');
    $('.answers .input-answer:eq('+num+') input').removeAttr("disabled");

    var newNum = num + 2;
    $('.answers').append('<span class="input input-answer input-disabled"><label class="input-label input-label-answer" for="answer-'+newNum+'">'+newNum+'</label><input class="input-field input-field-answer" disabled type="text" id="answer-'+newNum+'" name="answer-'+newNum+'"><span class="input-field-datepicker-trigger" for="answer-'+newNum+'"><i class="fa fa-calendar"></i></span></span>');
    $('#answer-'+newNum).bind('input', answerUpdated);
    $('#answer-'+newNum).bind('keydown', keyPressed);
    $('.input-field-datepicker-trigger').click(showDatePopup);
}

function removeAnswer(num){
    $('.answers .input-answer:eq('+num+')').addClass('input-disabled');
    $('.answers .input-answer:eq('+num+') input').attr("disabled",true);

    //var removeNum = num + 1;
    $('.answers .input-answer').each(function( index ) {
        if(index > num){
            $(this).remove();
        }
    });
    //$('.answers .input-answer:eq('+removeNum+')').remove();
}

function hideDatePopup(){
    $('#datepicker').removeClass('show');
    $('#datepicker-overlay').removeClass('show');
}

function showDatePopup(){
    if(!$(this).parent().hasClass('input-disabled')){
        answer = $(this).attr('for');
        $('#datepicker').addClass('show');
        $('#datepicker-overlay').addClass('show');

        $('#datepicker-overlay').click(function(event) {
            hideDatePopup();
        });
    }
}

function hideAdvancedOptions(){
    $('#advanced-settings').removeClass('show');
    $('#datepicker-overlay').removeClass('show');
}

function showAdvancedOptions(){
    $('#advanced-settings').addClass('show');
    $('#datepicker-overlay').addClass('show');

    $("#datepicker-overlay").click(function(event) {
        hideAdvancedOptions();
    });

    $(".md-close").click(function(event) {
        event.preventDefault();
        hideAdvancedOptions();
    });
}

$(document).ready(function() // execute once the DOM has loaded
{

    $( window ).resize(function() {
        $('textarea.input-field-question').trigger('input');
    });

    if($('textarea.input-field-question').length){

        var placeholder = ['What film should we watch?',
                           'What should we do this weekend?',
                           'Who is going to win the league?',
                           'Where should we go for drinks?'];
        var timeOut;
        var char = 0;
        var placeholderNum = Math.round(Math.random() * (placeholder.length-1));
        $('textarea.input-field-question').attr('placeholder', '|');
        (function typeIt(wait) {
            timeOut = setTimeout(function () {
                char++;
                var type = placeholder[placeholderNum].substring(0, char);
                $('textarea.input-field-question').attr('placeholder', type + '|');

                if (char === placeholder[placeholderNum].length) {
                    $('textarea.input-field-question').attr('placeholder', $('textarea.input-field-question').attr('placeholder').slice(0, -1));
                    char = 0;
                    placeholderNum++;
                    if (placeholderNum >= placeholder.length) {
                        placeholderNum = 0;
                    }
                    typeIt(1000);
                } else {
                    var humanize = Math.round(Math.random() * (150 - 30)) + 30;
                    typeIt(humanize);
                }

            }, wait);
        }());
    }

    $('textarea.input-field-question').bind('keydown', questionKeyPressed);

    $('input.input-field-answer').bind('input', answerUpdated);
    $('input.input-field-answer').bind('keydown', keyPressed);
    $('.input-field-datepicker-trigger').click(showDatePopup);


    $('button.btn-question').click(function(event) {
        if(!canSubmitQuestion()){
            event.preventDefault();
        }
    });

    if($('#datepicker').length) {
        $('#datepicker').datepicker({
            inline: true,
            dateFormat: 'DD, d MM, yy',
            onSelect(date) {
                $('#'+answer).val(date);
                $('#'+answer).trigger('input');
                hideDatePopup();
            }
        });
    }

    $('.btn.btn-options').click(function(event) {
        event.preventDefault();
        showAdvancedOptions();
    });

});