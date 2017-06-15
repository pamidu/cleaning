<?php
	class TenantTransferProxy {

		private $secToken;
		private $invoker;
	
		public function AddUser($user){
			$json = $this->invoker->post("/UserRegistation/", $user);
			return json_decode($json);
		}
		
		function __construct($secToken){
			$this->invoker = new WsInvoker(SVC_AUTH_URL);
			//$this->invoker->setContentType("application/x-www-form-urlencoded");
			$this->secToken = $secToken;
		}
	}
?>