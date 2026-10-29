<?php
define('SECURE_ACCESS', true);
$getEndpoint = include('endpoint.php');
$endpoint = $getApiKey['endpoint'];
$jsonPayload = json_encode($data);
$ch = curl_init($endpoint);
curl_setopt_array($ch, [
    CURLOPT_HTTPHEADER     => ['Content-Type: application/json'],
    CURLOPT_POST           => true,
    CURLOPT_POSTFIELDS     => $jsonPayload,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_SSL_VERIFYPEER => true
]);
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
if (curl_errno($ch)) {
    echo 'cURL Error: ' . curl_error($ch);
} else {
    if ($httpCode === 204) {
        echo "Message successfully sent to Discord!";
    } else {
        echo "Failed to send message. HTTP Status Code: " . $httpCode;
        echo "\nResponse: " . $response;
    }
}






?>

<center><h1>Your response has been recorded.</h1><br />
<a onclick="window.history.back();">&lt; Back</a>
</center>
