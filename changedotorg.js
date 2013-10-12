(function ( $ ) {
	// Extract values from form
	function processForm(form) {
		var values = {
			email: 			$(form).find(	'input[name=email]'			).first().val(),
			first_name: 	$(form).find(	'input[name=firstName]'		).first().val(),
			last_name: 		$(form).find(	'input[name=lastName]'		).first().val(),
			address: 		$(form).find(	'input[name=streetAddress]'	).first().val(),
			city: 			$(form).find(	'input[name=city]'			).first().val(),
			state_province: $(form).find(	'input[name=state]'			).first().val(),
			postal_code: 	$(form).find(	'input[name=zip]'			).first().val(),
			country_code: 	$(form).find(	'input[name=countryCode]'	).first().val()
		}
		return values;
	}

	// Construct a request for a petition ID
	function getPetitionId(oAuth, callback) {
			var requestUrl = 'https://api.change.org/v1/petitions/get_id'
				parameters = {
					api_key: oAuth.apiKey,
					petition_url: oAuth.petitionUrl
				};

			var target = requestUrl + '?' + $.param(parameters);
			
			$.ajax({
				type: "POST",
				url: target,
				success: function( data ) {
					callback(data.petition_id);
				},
				dataType: 'jsonp'
			});				
	}

	function signPetition(petitionId, values, oAuth, callback) {

		values.api_key = oAuth.apiKey;
		values.petition_authorization_key = oAuth.petitionAuthorizationKey;
		values.petition_id = petitionId;

		$.ajax({
			type: "POST",
			url: 'submit.php',
			data: values,
			success: function( returnData ) {
				callback(returnData);
			}
		});
	}

	$.fn.changedotorg = function(cb) {
		var form = this;
		$(this).on('submit.changedotorg', changedotorgSubmit);

		function changedotorgSubmit(e) {
			e.preventDefault();

			var originalSubmitVal = $(form).find('input[type=submit]').first().val();
			$(form).find('input[type=submit]').first().val('Signing...')
			$(form).off('submit.changedotorg').on('submit.changedotorgSubmitted', function(e) { e.preventDefault(); });

			var formValues = processForm(form);
			formValues.source = $(form).data('changedotorg-source');

			var oAuth = {
				apiKey: $(this).data('changedotorg-apikey'),
				petitionAuthorizationKey: $(this).data('changedotorg-petitionkey'),
				petitionUrl: $(this).data('changedotorg-petitionurl')
			}

			// Get the petition ID
			getPetitionId(oAuth, function(petitionId) {
				signPetition(petitionId, formValues, oAuth, function(res) {
					jsonResponse = JSON.parse(res)
					$(form).find('input[type=submit]').val(originalSubmitVal);
					$(form).off('submit.changedotorgSubmitted').on('submit.changedotorg', changedotorgSubmit);

					// Allow execution of custom callback
					if (jQuery.isFunction(cb)) {
						cb(jsonResponse);
					} else {
					if (jsonResponse.result == 'failure') {
						alert('Unable to sign petition. Please try again.');
					} else {
						alert('You have successfully signed this petition.');
					}
					}

				});
			});
		}
	}
}( jQuery ));

$(document).ready(function() {
	$("form[data-toggle=changedotorg]").changedotorg();
});