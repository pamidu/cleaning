<?php

if (!class_exists("RequestBody")){
	class RequestBody {
		public $Parameters;
		public $Query;
		public $Object;
		public $Objects;
	}
}

if (!class_exists("Query")){
	class Query {
		public $Type;
		public $Parameters;
	}
}

if (!class_exists("ObjectParameters")){
	class ObjectParameters {
		public $KeyProperty;
		public $KeyValue;
		public $AutoIncrement;
	}
}

if (!class_exists("GetModifier")){
	class GetModifier{
		private $osClient;
		private $wsInvoker;
		private $reqBody;
		private $mapObj;

		function __construct($osClient){
			$this->osClient = $osClient;
			$this->wsInvoker = new WsInvoker(SVC_OS_URL . "/". $this->osClient->getNamespace() . "/". $this->osClient->getClass() . "/");
			$this->wsInvoker->addHeader("securityToken", $this->osClient->getToken());
		}

		public function skip($skip){
			$this->osClient->setParam("skip", $skip);
		}

		public function take($take){
			$this->osClient->setParam("take", $take);
		}

		public function map($obj){
			$this->mapObj = $obj;
		}

		public function andSearch ($s){
			if (!$this->osClient->checkJwtPermission("r"))
				return $this->osClient->getDefaultFailObject("Permission denied to retrieve in JWT");

			$res = $this->wsInvoker->get("?keyword=" . $s);
			return (isset($this->mapObj)) ? $this->wsInvoker->map($res, $this->mapObj) :   json_decode($res,true);
		}

		public function byGlobalSearch ($s){
			if (!$this->osClient->checkJwtPermission("r"))
				return $this->osClient->getDefaultFailObject("Permission denied to retrieve in JWT");

			$res = $this->wsInvoker->get("?keyword=" . $s);
			$this->wsInvoker->addHeader("searchGlobalNamespace","TRUE");
			return (isset($this->mapObj)) ? $this->wsInvoker->map($res, $this->mapObj) :   json_decode($res,true);
		}

		public function bySearching ($s){
			if (!$this->osClient->checkJwtPermission("r"))
				return $this->osClient->getDefaultFailObject("Permission denied to retrieve in JWT");

			$res = $this->wsInvoker->get("?keyword=" . $s);
			return (isset($this->mapObj)) ? $this->wsInvoker->map($res, $this->mapObj) :   json_decode($res,true);
		}

		public function byFiltering ($f){
			if (!$this->osClient->checkJwtPermission("r"))
				return $this->osClient->getDefaultFailObject("Permission denied to retrieve in JWT");

			$req = $this->osClient->getRequest();
			$req->Query->Type = "filter";
			$req->Query->Parameters = $f;
			unset($req->Parameters);
			unset($req->Objects);
			unset($req->Object);
			$res = $this->wsInvoker->post("", $req);
			return (isset($this->mapObj)) ? $this->wsInvoker->map($res, $this->mapObj) :   json_decode($res,true);
		}

		public function byKey($k){
			if (!$this->osClient->checkJwtPermission("r"))
				return $this->osClient->getDefaultFailObject("Permission denied to retrieve in JWT");

			$res = $this->wsInvoker->get($k);
			return (isset($this->mapObj)) ? $this->wsInvoker->map($res, $this->mapObj) :   json_decode($res);
		}

		public function all(){
			if (!$this->osClient->checkJwtPermission("r"))
				return $this->osClient->getDefaultFailObject("Permission denied to retrieve in JWT");

			$res = $this->wsInvoker->get("");
			return (isset($this->mapObj)) ? $this->wsInvoker->map($res, $this->mapObj) :   json_decode($res,true);
		}
	}
}

if (!class_exists("StoreModifier")){
	class StoreModifier{
		private $osClient;

		private $keyProp;

		function __construct($osClient){
			$this->osClient = $osClient;
			$this->wsInvoker = new WsInvoker(SVC_OS_URL . "/". $this->osClient->getNamespace() . "/". $this->osClient->getClass() . "/");
			$this->wsInvoker->addHeader("securityToken", $this->osClient->getToken());
			$this->wsInvoker->addHeader("log", "log");
		}

		public function byKeyField($kf){
			$this->keyProp = $kf;
			return $this;
		}

		public function andStore($so){
			if (!$this->osClient->checkJwtPermission("w"))
				return $this->osClient->getDefaultFailObject("Permission denied to store in JWT");

			$req = $this->osClient->getRequest();
			$req->Parameters->KeyProperty = $this->keyProp;
			if (gettype($so) == "array"){
				$req->Objects = $so;
				unset($req->Object);
				unset($req->Query);
			}
			else{
				$req->Object = $so;
				unset($req->Objects);
				unset($req->Query);
			}
			$res = $this->wsInvoker->post("", $req);
			return (isset($this->mapObj)) ? $this->wsInvoker->map($res, $this->mapObj) :   json_decode($res);
		}

		public function andStoreArray($so){
			if (!$this->osClient->checkJwtPermission("w"))
				return $this->osClient->getDefaultFailObject("Permission denied to store in JWT");

			$req = $this->osClient->getRequest();
			$req->Parameters->KeyProperty = $this->keyProp;

			$req->Object = $so;

			unset($req->Objects);
			unset($req->Query);
			$res = $this->wsInvoker->post("", $req);
			return (isset($this->mapObj)) ? $this->wsInvoker->map($res, $this->mapObj) :   json_decode($res);
		}
	}
}

if (!class_exists("DeleteModifier")){
	class DeleteModifier{
		private $osClient;

		private $keyProp;

		function __construct($osClient){
			$this->osClient = $osClient;
			$this->wsInvoker = new WsInvoker(SVC_OS_URL . "/". $this->osClient->getNamespace() . "/". $this->osClient->getClass() . "/");
			$this->wsInvoker->addHeader("securityToken", $this->osClient->getToken());
		}

		public function byKeyField($kf){
			$this->keyProp = $kf;
		}

		public function andDelete($so){
			if (!$this->osClient->checkJwtPermission("d"))
				return $this->osClient->getDefaultFailObject("Permission denied to delete in JWT");
				
			$req = $this->osClient->getRequest();
			$req->Parameters->KeyProperty = $this->keyProp;

			$res = $this->wsInvoker->post("", $req);
			return (isset($this->mapObj)) ? $this->wsInvoker->map($res, $this->mapObj) :   json_decode($res);
		}
	}
}

if (!class_exists("ObjectStoreClient")){
	class ObjectStoreClient {
		private $ns;
		private $cls;
		private $params;
		private $token;
		private $jwtpermissions;

		public function checkJwtPermission($pt){
			if (isset($this->jwtpermissions)){
				if (isset($this->jwtpermissions->$pt)) return $this->jwtpermissions->$pt;
				else return false; 
			}

			return true;
		}

		public function getDefaultFailObject($message){
			$outData = new stdClass();
			$outData->IsSuccess = false;
			$outData->Message = $message;
			return $outData;
		}

		public function getToken(){
			return $this->token;
		}

		public function setToken($t){
			$this->token = $t;
		}

		public function get(){
			return new GetModifier($this);
		}

		public function store(){
			return new StoreModifier($this);
		}

		public function delete(){
			return new DeleteModifier($this);
		}

		public function setNamespace($ns){
			$this->ns = $ns;
		}

		public function getNamespace(){
			return $this->ns;
		}

		public function setClass($cls){
			$this->cls = $cls;
		}

		public function getClass(){
			return $this->cls;
		}

		public function getParams(){
			return $this->params;
		}

		public function getParam($name){
			return $params[$name];
		}

		public function setParam($key,$value){
			array_push($params, $key, $value);
		}

		public function getRequest(){
			$req = new RequestBody();
			$req->Parameters = new ObjectParameters();
			$req->Query = new Query();

			return $req;
		}

		function __construct(){
			$this->params = [];
		}

		public function checkJwt(){
			$jwtFile = $_SERVER["DOCUMENT_ROOT"] . "/include/jwtvalidator.php";

			if (function_exists("getallheaders") && file_exists($jwtFile)){
				$allHeaders = getallheaders();
				if (isset($allHeaders["jwt"])){
					require_once ($jwtFile);
					$validator = new JWTValidator();
					$this->jwtpermissions =  $validator->ValidateData ($this->cls, array("r","w","d"));
				}
			}
		}

		public static function WithClass($cls,$token){
			$c = new ObjectStoreClient();
			$c->setNamespace(DuoWorldCommon::GetHost());
			$c->setClass($cls);
			$c->setToken($token);
			$c->checkJwt();
			return $c;
		}

		public static function WithNamespace($ns,$cls,$token){
			$c = new ObjectStoreClient();
			$c->setNamespace($ns);
			$c->setClass($cls);
			$c->setToken($token);
			$c->checkJwt();
			return $c;
		}
	}

}

?>