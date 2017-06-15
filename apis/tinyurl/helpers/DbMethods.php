<?php
include_once (HELPERS . 'HttpRequest.php');
include_once (HELPERS . 'result.php');
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
class GetModifier {
	private $osClient;
	private $wsInvoker;
	private $reqBody;
	private $mapObj;
	
	function __construct($osClient) {
		$this->osClient = $osClient;
		$this->wsInvoker = new WsInvoker ( DB_URL . "/" . $this->osClient->getNamespace () . "/" . $this->osClient->getClass () . "/" );
		$this->wsInvoker->addHeader ( "securityToken", $this->osClient->getToken () );
	}
	public function skip($skip) {
		$this->osClient->setParam ( "skip", $skip );
	}
	public function orderBy($field) {
		$this->osClient->setParam ( "orderBy", $field );
	}
	public function orderByDsc($field) {
		$this->osClient->setParam ( "orderByDsc", $field );
	}
	public function take($take) {
		$this->osClient->setParam ( "take", $take );
	}
	public function map($obj) {
		$this->mapObj = $obj;
	}
	public function andSearch($s) {
		$res = $this->wsInvoker->get ( "?keyword=" . $s );
		return (isset ( $this->mapObj )) ? $this->wsInvoker->map ( $res, $this->mapObj ) : json_decode ( $res, true );
	}
	public function byFiltering($f) {
		$req = $this->osClient->getRequest ();
		$req->Query->Type = "Query";
		$req->Query->Parameters = $f;
		unset ( $req->Parameters );
		unset ( $req->Objects );
		unset ( $req->Object );
		unset ( $req->Special );
		$res = $this->wsInvoker->post ( "", $req );
		return (isset ( $this->mapObj )) ? $this->wsInvoker->map ( $res, $this->mapObj ) : json_decode ( $res, true );
	}
	public function byKey($k) {
		$res = $this->wsInvoker->get ( $k );
		return (isset ( $this->mapObj )) ? $this->wsInvoker->map ( $res, $this->mapObj ) : json_decode ( $res );
	}
	public function all() {
		// $res = $this->wsInvoker->get("");
		// return (isset($this->mapObj)) ? $this->wsInvoker->map($res, $this->mapObj) : json_decode($res,true);
		$queryStr = "";
		$res = null;
		$params = $this->osClient->getParams ();
		
		if (! empty ( $params ))
			$queryStr = $this->formatQueryString ( $params );
		
		$res = $this->wsInvoker->get ( $queryStr );
		return (isset ( $this->mapObj )) ? $this->wsInvoker->map ( $res, $this->mapObj ) : json_decode ( $res, true );
	}
	public function getClasses() {
		$req = $this->osClient->getRequest ();
		$req->Special->Type = "getClasses";
		$req->Special->Parameters = "";
		unset ( $req->Parameters );
		unset ( $req->Objects );
		unset ( $req->Object );
		unset ( $req->Query );
		$res = $this->wsInvoker->post ( "", $req );
		return (isset ( $this->mapObj )) ? $this->wsInvoker->map ( $res, $this->mapObj ) : json_decode ( $res, true );
	}
	public function getSelected($parameters) {
		$req = $this->osClient->getRequest ();
		$req->Special->Type = "getSelected";
		$req->Special->Parameters = $parameters;
		unset ( $req->Parameters );
		unset ( $req->Objects );
		unset ( $req->Object );
		unset ( $req->Query );
		$res = $this->wsInvoker->post ( "", $req );
		return (isset ( $this->mapObj )) ? $this->wsInvoker->map ( $res, $this->mapObj ) : json_decode ( $res, true );
	}
	
	public function idService($IsPattern, $commandText){
		$req = $this->osClient->getRequest();
		$req->Special->Type = "IDService";
		$req->Special->Parameters = "";
		$ExtrasData = new stdClass();
		$ExtrasData->Pattern = $IsPattern;
		$ExtrasData->Command = $commandText;
		$req->Special->Extras = $ExtrasData;
		unset($req->Parameters);
		unset($req->Objects);
		unset($req->Object);
		unset($req->Query);
		
		$res = $this->wsInvoker->post("", $req);
		//var_dump($res);
		return $res;
	}
	
	private function formatQueryString($params) {
		$queryStr = "?";
		$cit = new CachingIterator ( new ArrayIterator ( $params ) );
		foreach ( $cit as $key => $value ) {
			$queryStr .= $key . "=" . $value;
			if ($cit->hasNext ()) {
				$queryStr .= "&";
			}
		}
		return $queryStr;
	}
}
class StoreModifier {
	private $osClient;
	private $keyProp;
	function __construct($osClient) {
		$this->osClient = $osClient;
		$this->wsInvoker = new WsInvoker ( DB_URL . "/" . $this->osClient->getNamespace () . "/" . $this->osClient->getClass () . "/" );
		$this->wsInvoker->addHeader ( "securityToken", $this->osClient->getToken () );
		// $this->wsInvoker->addHeader("log", "log");
	}
	public function byKeyField($kf) {
		$this->keyProp = $kf;
		return $this;
	}
	
	// public function andStore($so){
	// $req = $this->osClient->getRequest();
	// $req->Parameters->KeyProperty = $this->keyProp;
	// if (gettype($so) == "array"){
	
	// $req->Objects = $so;
	// unset($req->Object);
	// unset($req->Query);
	// unset($req->Special);
	// }
	// else{
	// $req->Object = $so;
	// unset($req->Objects);
	// unset($req->Query);
	// unset($req->Special);
	// }
	// $res = $this->wsInvoker->post("", $req);
	// return (isset($this->mapObj)) ? $this->wsInvoker->map($res, $this->mapObj) : json_decode($res);
	// }
	public function andStore($so) {
		$req = $this->osClient->getRequest ();
		$req->Parameters->KeyProperty = $this->keyProp;
		if (gettype ( $so ) == "array") {
			
			$req->Objects = $so;
			unset ( $req->Object );
			unset ( $req->Query );
			unset ( $req->Special );
		} else {
			$req->Object = $so;
			unset ( $req->Objects );
			unset ( $req->Query );
			unset ( $req->Special );
		}
		// var_dump($req);
		$res = $this->wsInvoker->post ( "", $req );
		// $result=array('IsSuccess'=>false,'Message'=>'Error has occured.','ID'=>'','StatusCode'=>'404');
		// echo $res;
		// var_dump($res);
		$result = new Result ();
		$result->isSuccess = false;
		$result->message = 'Error has occured.';
		$result->ID = '';
		$result->statusCode = 404;
		if (isset ( $res )) {
// 			var_dump($res);
			$out = json_decode ( $res );
// 			var_dump($out);
			// $result=array('IsSuccess'=>$out->IsSuccess,'Message'=>$out->Message,'ID'=>$out->Data[0]->ID,'StatusCode'=>$out->IsSuccess ==true?200:404);
			if (isset ( $out )) {
				$result->isSuccess = $out->IsSuccess;
				$result->message = $out->Message;
				$result->ID = $out->Data == null ? '' : $out->Data [0]->ID;
				$result->statusCode = $out->IsSuccess == true ? 200 : 404;
			}
			else 
			{
				$result->isSuccess = false;
				$result->message = "error occured";				
			}
		}
		
		// echo json_decode(json_encode($result));
		return (isset ( $this->mapObj )) ? $this->wsInvoker->map ( $result, $this->mapObj ) : $result;
		// json_encode($result)
	}
	public function andStoreArray($so) {
		$req = $this->osClient->getRequest ();
		$req->Parameters->KeyProperty = $this->keyProp;
		
		$req->Object = $so;
		unset ( $req->Objects );
		unset ( $req->Query );
		unset ( $req->Special );
		$res = $this->wsInvoker->post ( "", $req );
		return (isset ( $this->mapObj )) ? $this->wsInvoker->map ( $res, $this->mapObj ) : json_decode ( $res );
	}
}
class DeleteModifier {
	private $osClient;
	private $keyProp;
	function __construct($osClient) {
		$this->osClient = $osClient;
		$this->wsInvoker = new WsInvoker ( DB_URL . "/" . $this->osClient->getNamespace () . "/" . $this->osClient->getClass () . "/" );
		$this->wsInvoker->addHeader ( "securityToken", $this->osClient->getToken () );
	}
	public function byKeyField($kf) {
		$this->keyProp = $kf;
		return $this;
	}
	public function andDelete($so) {
		$req = $this->osClient->getRequest ();
		$req->Parameters->KeyProperty = $this->keyProp;
		
		$req->Object = $so;
		unset($req->Objects);
		unset($req->Query);
		unset($req->Special);
		
		$res = $this->wsInvoker->delete ( "", $req );
		return (isset ( $this->mapObj )) ? $this->wsInvoker->map ( $res, $this->mapObj ) : json_decode ( $res );
	}
}

?>