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

	        var category = $(this).filter(':checked').val();

			var totalResponses = parseInt($('.options').attr('responses'));
			// @TODO - Think about making this stronger, not just using show-results as users could spoof this, not that is really matters, it would only affect the UI.
			if(!$('.options').hasClass('show-results')){
				totalResponses += 1;
				$('.options').attr('responses', totalResponses);
			}else{
				var previousResponseID = $('.options').attr('currentResponse');
				var previousResponse = parseInt($('.result[name=answer-'+previousResponseID+']').attr('responses')) - 1;
				$('.result[name=answer-'+previousResponseID+']').attr('responses',previousResponse);
			}

			var currentResponses = parseInt($('.result[name=answer-'+category+']').attr('responses')) + 1;
			$('.result[name=answer-'+category+']').attr('responses', currentResponses);
			$('.options').attr('currentResponse', category);

			$('.result').each(function( index ) {
			 	var responses = parseInt($(this).attr('responses'));

			 	var percentage = (responses / totalResponses)*100;
			 	
			 	$(this).css("width",percentage+'%');
			});

			$('.options').addClass('show-results');
	    }
	);

});