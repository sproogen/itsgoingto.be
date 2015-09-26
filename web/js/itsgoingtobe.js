$(function() // execute once the DOM has loaded
{
	//Prevent the form from being submitted
	$( 'form[name="answers"]' ).submit(function( event ) {
	  //event.preventDefault();
	});

	$('input:radio[name="answer"]').change(
	    function(){
	        $.ajax({
			    type: "POST",
			    url: $( 'form[name="answers"]' ).attr( 'action' ),
			    data: $('form[name="answers"]').serialize(),
			    success: function(response) {
			    	console.log(response);
			    }
			});
	    }
	);

});
$(function() // execute once the DOM has loaded
{
	var answers = 0;

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
	});

	$('input.input-field-answer').bind('input', answerUpdated);
	$('input.input-field-answer').bind('keydown', keyPressed);

	function answerUpdated(){
		var inputID = this.id;
		var arr = inputID.split('-');
		var answerNum = parseInt(arr[1]);

		if(this.value.length){
			if(answerNum > answers){
				answers = answerNum;
				addAnswer(answerNum);
			}
			if(getAnswerCount() >= 2){
				$('button.btn-question').removeClass('disabled');
			}
		}else{
			if(answerNum == answers){
				answers = getMaxAnswer();
				removeAnswer(answers+1);
				focusOnAnswer(answers+1);
			}
			if(getAnswerCount() < 2){
				$('button.btn-question').addClass('disabled');
			}
		}
	}

	function keyPressed(){
		var inputID = this.id;
		var arr = 0;
		var answerNum = 0;

		var key = event.keyCode || event.charCode;

		//Stop enter key submitting form
		if ( key == 13) event.preventDefault();

		if(!this.value.length){
			//Back and delete key go back to previous question only when answer is empty
		    if( key == 8 || key == 46 ){
				arr = inputID.split('-');
				answerNum = parseInt(arr[1]);

				if(answerNum != 1){
					if(answerNum > answers){
						event.preventDefault();
						focusOnAnswer(answerNum-1);
					}
				}
		    }
		}else{
			// Enter key to go down only when some characters have been entered.
			if ( key == 13) {
				arr = inputID.split('-');
				answerNum = parseInt(arr[1]);
				focusOnAnswer(answerNum+1);
		    }
		}
		// Up and down arrow keys to move up and down answers
		if ( key == 38) {
	    	arr = inputID.split('-');
			answerNum = parseInt(arr[1]);
			focusOnAnswer(answerNum-1);
	    } else if ( key == 40) {
	    	arr = inputID.split('-');
			answerNum = parseInt(arr[1]);
			focusOnAnswer(answerNum+1);
	    }
	}

	function focusOnAnswer(answer){
		$('input[name="answer-'+answer+'"]').focus();
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
		 	if(this.value.length){
		 		count += 1;
		 	}
		});
		return count;
	}

	function addAnswer(num){
		$('.answers .input-answer:eq('+num+')').removeClass('input-disabled');
		$('.answers .input-answer:eq('+num+') input').removeAttr("disabled");

		var newNum = num + 2;
		$('.answers').append('<span class="input input-answer input-disabled"><label class="input-label input-label-answer" for="answer-'+newNum+'">'+newNum+'</label><input class="input-field input-field-answer" disabled type="text" id="answer-'+newNum+'" name="answer-'+newNum+'"></textarea></span>');
		$('input.input-field-answer').bind('input', answerUpdated);
		$('input.input-field-answer').bind('keydown', keyPressed);
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

	function clearAnswers(){
		// @TODO - Clear out all answers and disable submit button
	}

	$("button.btn-question").click(function(event) {
		if(getAnswerCount() < 2){
			event.preventDefault();
			// @TODO - PLEASE ENTER AT LEAST 2 ANSWERS ERROR
		}
	});
});