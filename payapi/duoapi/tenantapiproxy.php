<?php

/*
{"TenantID":"smapletenat.duoworld.info","Name":"Sample Tenant","Shell":"Shell",
"Statistic":{"DataDown":"1GB","DataUp":"1GB","NumberOfUsers":"10"},
"Private":true,"OtherData":{"CompanyName":"DuoSoftware Pvt Ltd","SampleAttributs":"Values"}}
*/

	class CreateTenantRequest {
		public $TenantID;
		public $Name;
		public $Shell;
		public $Statistic;
		public $Private;
		public $OtherData;
	}

    class TenantRef{
        public $AccountID;
        public $TenantID;
        public $Email;
    }

	class TenantProxy {

		private $secToken;
		private $invoker;

		public function Authorized($tid){
			$json = $this->invoker->get("/tenant/Autherized/". $tid);
			return json_decode($json);
		}

		public function GetTenant($tid){
			$json = $this->invoker->get("/tenant/GetTenant/". $tid);
			return json_decode($json);
		}

		public function GetTenants($secLevel){
			$json = $this->invoker->get("/tenant/AcceptRequest/". $secLevel);
			return json_decode($json);
		}

		public function GetSampleTenantForm($r){
			$json = $this->invoker->get("/tenant/GetSampleTenantForm/");
			return json_decode($json);
		}

		public function InviteUser($r){
			$this->invoker->addHeader("securityToken", $this->secToken);
			$json = $this->invoker->post("/tenant/InviteUser/", $r);
			return json_decode($json);
		}

		public function CreateTenant($r){
			$this->invoker->addHeader("securityToken", $this->secToken);
			$json = $this->invoker->post("/tenant/CreateTenant/", $r);
			return json_decode($json);
		}

		public function SearchTenants($str, $size, $point){
			$json = $this->invoker->post("/tenant/SearchTenants/" . $str ."/" . $size . "/" . $point, $r);
			return json_decode($json);
		}
		
		public function GetTenantUsers($tenant){
			$this->invoker->addHeader("SecurityToken", $this->secToken);
			$json = $this->invoker->get("/tenant/GetUsers/$tenant");
			return json_decode($json);
		}

		function __construct($secToken){
			$this->invoker = new WsInvoker(SVC_AUTH_URL);
			//$this->invoker->setContentType("application/x-www-form-urlencoded");
			$this->secToken = $secToken;
		}
	}

?>