<?php

class BulkHeader {
	public $src;
	public $dest;
	public $details;

	function __construct(){
		$this->details = array();
	}

   public function addDetailId($class, $key, $keyField){
   	$detailObj = new BulkDetails();
   	$detailObj->type = "id";
   	$detailObj->class = $class;
   	$detailObj->params->key = $key;
   	$detailObj->params->keyField = $keyField;
   	array_push($this->details , $detailObj);
   }

   public function addDetailFilter($class, $filter, $keyField){
   	$detailObj = new BulkDetails();
   	$detailObj->type = "filter";
   	$detailObj->class = $class;
   	$detailObj->params->filter = $filter;
   	$detailObj->params->keyField = $keyField;
   	array_push($this->details , $detailObj);
   }
}

class BulkDetails {
	public $class;
	public $type;
	public $params;

	function __construct(){
		$this->params = new BulkParams();
	}

}

class BulkParams {
	public $key;
	public $keyField;
	public $filter;
}

class BulkTransfer {

	public function Transfer($obj){
		$this->sendToObjectStore(json_encode($obj));
	}

	private function sendToObjectStore($json){
		$ch = curl_init('http://localhost:3001/transfer');                                                                      
		curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");                                                                     
		curl_setopt($ch, CURLOPT_POSTFIELDS, $json);                                                                  
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);                                                                      
		curl_setopt($ch, CURLOPT_HTTPHEADER, array(                                                                          
		    'Content-Type: application/json',                                                                                
		    'Content-Length: ' . strlen($json))                                                                       
		);                                                                                                                   
		 
		$result = curl_exec($ch);
	}
}

?>