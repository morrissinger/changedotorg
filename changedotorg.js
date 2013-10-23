(function ( $ ) {
	var useProxy = true;

	// Extract values from form
	function processForm(form) {
		var values = {
			email: 			$(form).find(	'input[name=email]'			).val(),
			first_name: 	$(form).find(	'input[name=firstName]'		).val(),
			last_name: 		$(form).find(	'input[name=lastName]'		).val(),
			address: 		$(form).find(	'input[name=streetAddress]'	).val(),
			city: 			$(form).find(	'input[name=city]'			).val(),
			state_province: $(form).find(	'input[name=state]'			).val(),
			postal_code: 	$(form).find(	'input[name=zip]'			).val(),
			country_code: 	$(form).find(	'input[name=countryCode]'	).val()
		}
		return values;
	}

	// Construct a request for a petition ID
	function getPetitionId(oAuth, callback) {
		var parameters = {
			api_key: oAuth.apiKey,
			petition_url: oAuth.petitionUrl
		};

		if (useProxy) {
			console.log('using proxy');
			var requestUrl = 'proxy/get_id.php';
			var dataType = 'json'
			var target = requestUrl
			var data = parameters;
			$.ajax({
				type: "POST",
				url: target,
				data: data,
				success: function( data ) {
					data = JSON.parse(data);
					callback(data.petition_id);
				},
//				dataType: dataType
			});	
		} else {
			var requestUrl = 'https://api.change.org/v1/petitions/get_id';
			var dataType = 'jsonp'
			var target = requestUrl + '?' + $.param(parameters);
			$.ajax({
				type: "POST",
				url: target,
				success: function( data ) {
					callback(data.petition_id);
				},
				dataType: dataType
			});				

		}
	}

	function signPetition(target, petitionId, values, oAuth, callback) {
		console.log('signing');
		values.api_key = oAuth.apiKey;
		values.petition_authorization_key = oAuth.petitionAuthorizationKey;
		values.petition_id = petitionId;

		$.ajax({
			type: "POST",
			url:  target,
			data: values,
			success: function( returnData ) {
				callback(returnData);
			}
		});
	}

	$.fn.changedotorg = function(cb) {
		var form = this;
		//$(this).on('submit.changedotorg', changedotorgSubmit);
		$(this).submit(changedotorgSubmit);

		function changedotorgSubmit(e) {
			e.preventDefault();

			//var originalSubmitVal = $(form).find('input[type=submit]').first().val();
			$(form).find('input[type=submit]').val('Signing...')
			//$(form).off('submit.changedotorg').on('submit.changedotorgSubmitted', function(e) { e.preventDefault(); });

			var formValues = processForm(form);
			formValues.source = $(form).attr('data-changedotorg-source');

			var oAuth = {
				apiKey: $(this).attr('data-changedotorg-apikey'),
				petitionAuthorizationKey: $(this).attr('data-changedotorg-petitionkey'),
				petitionUrl: $(this).attr('data-changedotorg-petitionurl')
			}

			// Get the petition ID
			getPetitionId(oAuth, function(petitionId) {
				signPetition($(form).attr('action'), petitionId, formValues, oAuth, function(res) {
					jsonResponse = JSON.parse(res)
					//$(form).find('input[type=submit]').val(originalSubmitVal);
					//$(form).off('submit.changedotorgSubmitted').on('submit.changedotorg', changedotorgSubmit);

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