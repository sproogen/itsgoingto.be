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
			    data: dataString,
			    success: function() {
			      
			    }
			  });
	    }
	);   

});