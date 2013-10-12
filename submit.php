<?php

/**********
 * Be sure to set the $api_secret variable immediately below.
 */

// Set my API key and secret token.
  $api_key = htmlspecialchars($_POST['api_key'], ENT_QUOTES, 'UTF-8');;
  $secret = 'API SECRET GOES HERE';

  // Set my authorization key for petition with Change.org ID 12345.
  $petition_auth_key = htmlspecialchars($_POST['petition_authorization_key'], ENT_QUOTES, 'UTF-8');
  $petition_id = htmlspecialchars($_POST['petition_id'], ENT_QUOTES, 'UTF-8');

  // Set up the endpoint and URL.
  $base_url = "https://api.change.org";
  $endpoint = "/v1/petitions/$petition_id/signatures";
  $url = $base_url . $endpoint;

  // Set up the signature parameters.
  $parameters = array();
  $parameters['api_key'] 			= 		$api_key;
  $parameters['timestamp'] 			= 		gmdate("Y-m-d\TH:i:s\Z"); // ISO-8601-formtted timestamp at UTC
  $parameters['endpoint'] 			= 		$endpoint;
  $parameters['source'] 			= 		htmlspecialchars($_POST['source'], ENT_QUOTES, 'UTF-8');
  $parameters['email'] 				= 		htmlspecialchars($_POST['email'], ENT_QUOTES, 'UTF-8');
  $parameters['first_name'] 		= 		htmlspecialchars($_POST['first_name'], ENT_QUOTES, 'UTF-8');
  $parameters['last_name'] 			= 		htmlspecialchars($_POST['last_name'], ENT_QUOTES, 'UTF-8');
  $parameters['address'] 			= 		htmlspecialchars($_POST['address'], ENT_QUOTES, 'UTF-8');
  $parameters['city'] 				= 		htmlspecialchars($_POST['city'], ENT_QUOTES, 'UTF-8');
  $parameters['state_province'] 	= 		htmlspecialchars($_POST['state_province'], ENT_QUOTES, 'UTF-8');
  $parameters['postal_code'] 		= 		htmlspecialchars($_POST['postal_code'], ENT_QUOTES, 'UTF-8');
  $parameters['country_code'] 		= 		'US';

  // Build request signature.
  $query_string_with_secret_and_auth_key = http_build_query($parameters) . $secret . $petition_auth_key;
  
  // Add the request signature to the parameters array.
  $parameters['rsig'] = hash('sha256', $query_string_with_secret_and_auth_key);

  // Create the request body.
  $data = http_build_query($parameters);

  // POST the parameters to the petition's signatures endpoint.
  $curl_session = curl_init();
  curl_setopt_array($curl_session, array(
    CURLOPT_POST => 1,
    CURLOPT_URL => $url,
    CURLOPT_POSTFIELDS => $data
  ));
  $result = curl_exec($curl_session);

  // Output  the returned JSON result.
  echo chop($result, "0123456789");	// Otherwise, we get a random character at the end (i.e., 1).
?>