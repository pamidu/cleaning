<?php
require($_SERVER["DOCUMENT_ROOT"] . "/include/config.php");
function detectRequestBody() {
    $rawInput = fopen('php://input', 'r');
    $tempStream = fopen('php://temp', 'r+');
    stream_copy_to_stream($rawInput, $tempStream);
    rewind($tempStream);

    return stream_get_contents($tempStream);
}
$authrequest = str_replace('/auth/','',$_SERVER["REQUEST_URI"]);
$SecurityToken="";
$headers=array();// = apache_request_headers();
$requestheaders=getallheaders();
if(isset($_COOKIE["authData"])){
	$authData = json_decode($_COOKIE["authData"]);
	$SecurityToken=$authData->SecurityToken;
	array_push($headers,'securityToken:'.$SecurityToken);
}else{
	array_push($headers,'securityToken:'.$requestheaders["securityToken"]);
}
array_push($headers,'User-Agent:'.$requestheaders["User-Agent"]);
array_push($headers,'PHP:101');
array_push($headers,'IP:'.$_SERVER['REMOTE_ADDR']); 
if (isset($requestheaders["scope"]))
	array_push($headers,'scope:'.$requestheaders["scope"]); 
	//echo $SecurityToken;
	//$authURI="http://auth.duoworld.com:3048/";
	//echo $authURI.$authrequest;
	$ch=curl_init();
	curl_setopt($ch, CURLOPT_HTTPHEADER,$headers);
	
	
	curl_setopt($ch, CURLOPT_URL, $authURI.$authrequest);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
	if($_SERVER["REQUEST_METHOD"]!="GET"){
		$postData = detectRequestBody();
		curl_setopt($ch, CURLOPT_POST, count($postData));
        curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);
		//var_dump($postData);
	}
	$data = curl_exec($ch);
	echo $data;
	//return $obj;

?>

