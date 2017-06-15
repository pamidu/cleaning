<?php

	class AddUserRequest {
		public $UserID;
		public $EmailAddress;
		public $Name;
		public $Password;
		public $Active;
        public $OtherData;
	}

    class OtherData {
        public $TenantID;
    }

	class AuthProxy {

		private $invoker;
	
		public function AddUser($user){
			$json = $this->invoker->post("/UserRegistation/", $user);
			return json_decode($json);
		}
        
        public function RegisterTenantUser($user){
            $json = $this->invoker->post("/RegisterTenantUser/", $user);
			return json_decode($json);
        }
		
		function __construct(){
			$this->invoker = new WsInvoker(SVC_AUTH_URL);
			//$this->invoker->setContentType("application/x-www-form-urlencoded");
		}

		public function GetAccess($token){
			$json = $this->invoker->get("/GetSession/". $token . "/duosoftware.com");
			return json_decode($json);
		}


	}
?>