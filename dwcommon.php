<?php
if(!isset($_SESSION))
     session_start();
 
require_once($_SERVER["DOCUMENT_ROOT"] . "/include/config.php");

if (!function_exists('apache_request_headers')) {
    function apache_request_headers() {
        foreach($_SERVER as $key=>$value) {
            if (substr($key,0,5)=="HTTP_") {
                $key=str_replace(" ","-",ucwords(strtolower(str_replace("_"," ",substr($key,5)))));
                $out[$key]=$value;
            }else{
                $out[$key]=$value;
            }
        }
        return $out;
    }
} 

class DuoWorldCommon {

	public static function GetHost(){
		return strcmp($_SERVER['HTTP_HOST'], "localhost") ==0 ?  "localhost.mambati.com" : $_SERVER['HTTP_HOST'];
	}

	public function CheckAuth($isJsonResponse = false){
		if (defined("SKIP_AUTH")) return;
		
		$currentHost = DuoWorldCommon::GetHost();
		$isLocalHost = $this->startsWith($currentHost, "localhost") || $this->startsWith($currentHost, "127.0.0.1");

		$isValid = true;

		if (!$isLocalHost){
			if(!isset($_COOKIE['securityToken']))
				$isValid = false;
			else {
				if (!isset($_SESSION["IsValidated"])){
					$authStr = $this->ValidateToken($_COOKIE['securityToken']);
					$authObj = json_decode($authStr);
					if (!isset($authObj->Error)) $_SESSION["IsValidated"] = true;
					else $isValid = false;
				}
			}
		}

		if (!$isValid){
			$headers = apache_request_headers();

			if (isset($headers)){
			
				$headerKeys = array ("securityToken", "securitytoken", "Securitytoken");
				$headerKey;
				foreach ($headerKeys as $hk){
				if (isset($headers[$hk])){
						$headerKey = $hk;
						break;
				}}

				if (isset($headers[$hk])){
					$authStr = $this->ValidateToken($headers[$hk]);
					$authObj = json_decode($authStr);
					if (!isset($authObj->Error)) {
						$_COOKIE["securityToken"] = $headers[$hk];
						$_COOKIE["authData"] = $authStr;
						$_SESSION["IsValidated"] = true;
						$isValid = true;
					}
					else $isValid = false;
				}
			}
		}

		if ($isValid !== true){
			if ($isJsonResponse){				
				http_response_code(403);
				header ("Content-Type: application/json");
				echo '{"success":false, "message":"Forbidden (403)"}';
			}
			else
				header("Location: http://" . $currentHost . "/s.php?r=". $_SERVER['REQUEST_URI']);
			
			exit();
		}
	}

	public function ValidateToken($token){
	        $ch = curl_init();
	        curl_setopt($ch, CURLOPT_URL, SVC_AUTH_URL . "/GetSession/$token/" . $_SERVER["HTTP_HOST"]);
	        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
	        $data = curl_exec($ch);
	        curl_close($ch);
	        return $data;
	}

	private function startsWith($haystack, $needle) {
	    return $needle === "" || strrpos($haystack, $needle, -strlen($haystack)) !== FALSE;
	}

	public static function mapToObject($data, $class) {
		foreach ($data as $key => $value) $class->{$key} = $value;
		return $class;
	}
}

class WsInvoker {
	
	private $baseUrl;
	private $conType;
	private $headerArray;


	public function post($relUrl, $body){
//		echo json_encode($body);
		$data_string = json_encode($body);    
//		echo $this->baseUrl . $relUrl;
//		echo "<br/>";
		
		if (!isset($this->conType))
			$this->conType = 'application/json';

		$ch = curl_init($this->baseUrl . $relUrl);
		curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
		curl_setopt($ch, CURLOPT_POST, 1 );
		curl_setopt($ch, CURLOPT_POSTFIELDS, $data_string);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		$this->addHeader('Content-Type', $this->conType);
		$this->addHeader('Content-Length', strlen($data_string));
		curl_setopt($ch, CURLOPT_HTTPHEADER, $this->headerArray);
		curl_setopt($ch, CURLOPT_ENCODING ,"");		
		$result = curl_exec($ch);
		//var_dump($result);
		return $result;
	}

	public function delete($relUrl, $body){
//		echo json_encode($body);
		$data_string = json_encode($body);        
//		echo $this->baseUrl . $relUrl;
//		echo "<br/>";		
		if (!isset($this->conType))
			$this->conType = 'application/json';

		$ch = curl_init($this->baseUrl . $relUrl);
		curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "DELETE");
		curl_setopt($ch, CURLOPT_POST, 1 );
		curl_setopt($ch, CURLOPT_POSTFIELDS, $data_string);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		$this->addHeader('Content-Type', $this->conType);
		$this->addHeader('Content-Length', strlen($data_string));
		curl_setopt($ch, CURLOPT_HTTPHEADER, $this->headerArray);
		curl_setopt($ch, CURLOPT_ENCODING ,"");
		
		$result = curl_exec($ch);
		//var_dump($result);
		return $result;
	}

	public function addHeader($k, $v){
		array_push($this->headerArray, $k . ": " . $v);
	}

	public function get($relUrl){
		//echo $this->baseUrl . $relUrl;
		$ch = curl_init();
		curl_setopt($ch, CURLOPT_HTTPGET,true);
		curl_setopt($ch, CURLOPT_URL, $this->baseUrl . $relUrl);
		curl_setopt($ch, CURLOPT_HTTPHEADER,  $this->headerArray);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		curl_setopt($ch, CURLOPT_ENCODING ,"");
		$result = curl_exec($ch);
		return $result;
	}	

	public function map($json, $class) {
		$data = json_decode($json, true);
		return Common::mapToObject($data,$class);
	}

	public function setContentType($ct){
		$this->conType = $ct;
	}

	function __construct($bu){
		$this->baseUrl = $bu;
		$this->headerArray = Array();
	}
}

$DUO_COMMON = new DuoWorldCommon();

if (defined("AUTH_FAIL_RESPONSE_JSON"))
	$DUO_COMMON->CheckAuth(true);
else
	$DUO_COMMON->CheckAuth(false);

?>
