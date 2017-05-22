function SelectText(element) {
    var doc = document,
    	text = doc.getElementById(element),
    	range,
    	selection;
    if (doc.body.createTextRange) {
        range = document.body.createTextRange();
        range.moveToElementText(text);
        range.select();
    } else if (window.getSelection) {
        selection = window.getSelection();
        range = document.createRange();
        range.selectNodeContents(text);
        selection.removeAllRanges();
        selection.addRange(range);
    }
}

$(function() // execute once the DOM has loaded
{
	$( "#shareLink" ).click(function() {
	 	SelectText('shareLink');
	});

	var ajaxRefresh;
	var ajaxRefreshStatus = 0;

	//Prevent the form from being submitted
	$( 'form[name="answers"]' ).submit(function( event ) {
	  //event.preventDefault();
	});

	$('input:radio[name="answer"]').change(function() {
		if(ajaxRefreshStatus === 1){
			ajaxRefresh.abort();
		}
        $.ajax({
		    type: "POST",
		    url: $( 'form[name="answers"]' ).attr( 'action' ),
		    data: $('form[name="answers"]').serialize(),
		    success: function(response) {
		    	//console.log(response);
		    }
		});

        var answerID = $(this).val();

		var totalResponses = parseInt($('.options').attr('responses'));

		if(!$('.options').hasClass('show-results')){
			totalResponses += 1;
			$('.options').attr('responses', totalResponses);
		}else{
			var previousResponseID = $('.options').attr('currentResponse');
			var previousResponse = parseInt($('.result[name=answer-'+previousResponseID+']').attr('responses')) - 1;
			$('.result[name=answer-'+previousResponseID+']').attr('responses',previousResponse);
		}

		var currentResponses = parseInt($('.result[name=answer-'+answerID+']').attr('responses')) + 1;
		$('.result[name=answer-'+answerID+']').attr('responses', currentResponses);
		$('.options').attr('currentResponse', answerID);

		$('.result').each(function( index ) {
		 	var responses = parseInt($(this).attr('responses'));

		 	var percentage = (responses / totalResponses)*100;

		 	$(this).css("width",percentage+'%');

		 	$('.input-label-votes[for='+$(this).attr('name')+']').text(responses + " votes");
		});

		$('.options').addClass('show-results');
    });

    $('input:checkbox[name="answer[]"]').change(function() {
        if(ajaxRefreshStatus === 1){
            ajaxRefresh.abort();
        }
        $.ajax({
            type: "POST",
            url: $( 'form[name="answers"]' ).attr( 'action' ),
            data: $('form[name="answers"]').serialize(),
            success: function(response) {
                //console.log(response);
            }
        });

        var answerID = $(this).val();
        var checked = $(this).is(':checked');

        var totalResponses = parseInt($('.options').attr('responses'));

        var responses = parseInt($('.result[name=answer-'+answerID+']').attr('responses'));

        if(checked){
            totalResponses += 1;
            responses += 1;
        }else{
            totalResponses -= 1;
            responses -= 1;
        }
        $('.options').attr('responses', totalResponses);
        $('.result[name=answer-'+answerID+']').attr('responses',responses);

        $('.result').each(function( index ) {
            var responses = parseInt($(this).attr('responses'));

            var percentage = (responses / totalResponses)*100;

            $(this).css("width",percentage+'%');

            $('.input-label-votes[for='+$(this).attr('name')+']').text(responses + " votes");
        });

        $('.options').addClass('show-results');
    });

	if($( 'form[name="answers"]' ).length){
		var pathname = window.location.pathname;
        var apiRoute = pathname.split('/');
        if (apiRoute.length === 2) {
            apiRoute = '/api/'+apiRoute[1]+'/responses';
        } else {
            apiRoute = '/'+apiRoute[1]+'/api/'+apiRoute[2]+'/responses';
        }
		(function answerRefresh() {
		    answerRefreshTimeout = setTimeout(function () {
		    	ajaxRefresh = $.ajax({
                                    type: "GET",
                                    url: apiRoute,
                                    beforeSend: function(){
				    	ajaxRefreshStatus = 1;
				   	},
				    success: function(response) {
				    	var totalResponses = response.totalResponses;
				    	$('.options').attr('responses', totalResponses);

				    	$.each( response.results, function( index, value ){
						    $('.result[name=answer-'+value.id+']').attr('responses', value.count);
						});

						$('.result').each(function( index ) {
						 	var responses = parseInt($(this).attr('responses'));

						 	var percentage = (responses / totalResponses)*100;

						 	$(this).css("width",percentage+'%');

						 	$('.input-label-votes[for='+$(this).attr('name')+']').text(responses + " votes");
						});
				    },
				    complete: function() {
				    	ajaxRefreshStatus = 0;
				    	answerRefresh();
				    }
				});
		    }, 5000);
		}());
	}

});
