<?php
class CebProxy {

	private $securityToken;

	public function InvokeCommand($name, $data){
		
		$wrapper = new stdClass();
		$wrapper->name = $name;
		$wrapper->type = "command";
		$wrapper->data = $data;
		return $this->callRest($wrapper);
		
	}

	private function sendCebNotification($message, $type, $to=NULL){
		if (is_object($message))
			$message = json_encode($message);

		$authData = json_decode($_COOKIE["authData"]);

		$sendObj = new stdClass();
		$sendObj->message = $message;
		$sendObj->from = $authData->Username;
		$sendObj->type = $type;

		if (isset($to))
			$sendObj->to = $to;

		return $this->InvokeCommand("notification", $sendObj);
	}

	public function NotificationToTenant ($message){
		return $this->sendCebNotification($message, "tenantbulkshell");
	}

	public function NotificationToUser ($message, $user){
		return $this->sendCebNotification($message, "shell" , $user);
	}

	private function callRest($wrapper){
	    $ch = curl_init();

	    $forwardHeaders = array("Host: ". $_SERVER["HTTP_HOST"], "Content-Type: application/json", "securityToken: ". $this->securityToken);
		curl_setopt($ch, CURLOPT_TIMEOUT, 5);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER,1);
		curl_setopt($ch, CURLOPT_POST,1);
		curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($wrapper->data)); 
		curl_setopt($ch, CURLOPT_HTTPHEADER, $forwardHeaders); 
	    curl_setopt($ch, CURLOPT_URL, SVC_CEB_URL . "/command/$wrapper->name");

	    $data = curl_exec($ch);

	    return $data;
	}

	function __construct($secToken){
		$this->securityToken = $secToken;
	}
}

?>
