<?php

class RequestBody {
	public $Parameters;
	public $Query;
	public $Object;
	public $Objects;
    public $Special;
}

class Query {
	public $Type;
	public $Parameters;
}

class ObjectParameters {
	public $KeyProperty;
	public $KeyValue;
	public $AutoIncrement;
}

class GetModifier{
	private $osClient;
	private $wsInvoker;
	private $reqBody;
	private $mapObj;

	function __construct($osClient){
		$this->osClient = $osClient;
		$this->wsInvoker = new WsInvoker(SVC_OS_URL . "/". $this->osClient->getNamespace() . "/". $this->osClient->getClass() . "/");
		$this->wsInvoker->addHeader("securityToken", $this->osClient->getToken());
		$headers = $this->osClient->getHeaders();
		if(!empty($headers)) {
			foreach ($headers as $key => $value) {
				$this->wsInvoker->addHeader($key, $value);
			}
		}

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
		$res = $this->wsInvoker->get("?keyword=" . $s);
		return (isset($this->mapObj)) ? $this->wsInvoker->map($res, $this->mapObj) :   json_decode($res,true);
	}

	public function byFiltering ($f){
		$req = $this->osClient->getRequest();
		$req->Query->Type = "Query";
		$req->Query->Parameters = $f;
		unset($req->Parameters);
		unset($req->Objects);
		unset($req->Object);
        unset($req->Special); 
		$res = $this->wsInvoker->post("", $req);
		return (isset($this->mapObj)) ? $this->wsInvoker->map($res, $this->mapObj) :   json_decode($res,true);
	}

	public function byKey($k){
		$res = $this->wsInvoker->get($k);
		return (isset($this->mapObj)) ? $this->wsInvoker->map($res, $this->mapObj) :   json_decode($res);
	}

	public function all(){        
//        $res = $this->wsInvoker->get("");
//        return (isset($this->mapObj)) ? $this->wsInvoker->map($res, $this->mapObj) :   json_decode($res,true);
        $queryStr = "";
        $res = null;
        $params = $this->osClient->getParams();
        
        if(!empty($params))
            $queryStr = $this->formatQueryString($params);
        
        $res = $this->wsInvoker->get($queryStr);
		return (isset($this->mapObj)) ? $this->wsInvoker->map($res, $this->mapObj) : json_decode($res,true);
	}
    
    public function getClasses(){
        $req = $this->osClient->getRequest();
		$req->Special->Type = "getClasses";
		$req->Special->Parameters = "";
		unset($req->Parameters);
		unset($req->Objects);
		unset($req->Object);
		unset($req->Query); 
		$res = $this->wsInvoker->post("", $req);
        return (isset($this->mapObj)) ? $this->wsInvoker->map($res, $this->mapObj) :   json_decode($res,true);
    }
    
    public function getSelected($parameters){
        $req = $this->osClient->getRequest();
        $req->Special->Type = "getSelected";
        $req->Special->Parameters = $parameters;
        unset($req->Parameters);
        unset($req->Objects);
        unset($req->Object);
        unset($req->Query);
        $res = $this->wsInvoker->post("",$req);
        return (isset($this->mapObj)) ? $this->wsInvoker->map($res, $this->mapObj) :   json_decode($res,true);
    }
    
    private function formatQueryString($params){
        $queryStr = "?";
        $cit = new CachingIterator(new ArrayIterator($params));
        foreach($cit as $key => $value){
            $queryStr .= $key."=".$value;
            if ($cit->hasNext()) {
                $queryStr .= "&";
            }
        }
        return $queryStr;
    }
}

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
		$req = $this->osClient->getRequest();
		$req->Parameters->KeyProperty = $this->keyProp;
		if (gettype($so) == "array"){
            
			$req->Objects = $so;
			unset($req->Object);
			unset($req->Query);
            unset($req->Special);
		}
		else{
			$req->Object = $so;
			unset($req->Objects);
			unset($req->Query);
            unset($req->Special);
		}

		$res = $this->wsInvoker->post("", $req);

		return (isset($this->mapObj)) ? $this->wsInvoker->map($res, $this->mapObj) :   json_decode($res);
	}

	public function andStoreArray($so){
		$req = $this->osClient->getRequest();
		$req->Parameters->KeyProperty = $this->keyProp;

		$req->Object = $so;
		unset($req->Objects);
		unset($req->Query);
        unset($req->Special);
		$res = $this->wsInvoker->post("", $req);
		return (isset($this->mapObj)) ? $this->wsInvoker->map($res, $this->mapObj) :   json_decode($res);
	}
}

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
		return $this;
	}

	public function andDelete($so){
		$req = $this->osClient->getRequest();
		$req->Parameters->KeyProperty = $this->keyProp;
		$req->Object = $so;

		unset($req->Objects);
		unset($req->Query);
		unset($req->Special);
		$res = $this->wsInvoker->delete("", $req);
		return (isset($this->mapObj)) ? $this->wsInvoker->map($res, $this->mapObj) :   json_decode($res);
	}
}

class ObjectStoreClient {
	private $ns;
	private $cls;
	private $params;
	private $token;
	private $headers;

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

	public function setHeader($header, $value) {
		$this->headers[$header] = $value;
	}

	public function getHeaders() {
		return $this->headers;
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
//		array_push($params, $key, $value);
        $this->params[$key] = $value;
	}

	public function getRequest(){
		$req = new RequestBody();
		$req->Parameters = new ObjectParameters();
		$req->Query = new Query();
        $req->Special = new Query();
		return $req;
	}

	function __construct(){
		$this->params = [];
		$this->headers = [];
	}

	public static function WithClass($cls,$token){
		$c = new ObjectStoreClient();
		$c->setNamespace(DuoWorldCommon::GetHost());
		$c->setClass($cls);
		$c->setToken($token);
		return $c;
	}

	public static function WithNamespace($ns,$cls,$token){
		$c = new ObjectStoreClient();
		$c->setNamespace($ns);
		$c->setClass($cls);
		$c->setToken($token);
		return $c;
	}
}

?>