<?php
	$request_url = 'https://api.change.org/v1/petitions/get_id';
	$target = $request_url . '?' . http_build_query($_POST);
	$response = file_get_contents($target);
	echo $response;
?>