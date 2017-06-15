<?php

class TenantCreationRequest {
    public $TenantID;
    public $TenantType;
    public $Name;
    public $Shell;
    public $Statistic;
    public $Private;
    public $OtherData;
}

class TenantService {

    private $securityToken;
    private $apps;

    public function CreateTenant() {
        $uiData = Flight::request()->data;
        $tenantObj = new TenantCreationRequest();
        $relUrl = "/tenant/CreateTenant/";

        foreach ($tenantObj as $key => $value) {
            if(!isset($uiData->$key)) { 
                echo '{"Success":false, "Message": "Request payload should contains '. $key .' property.", "Data": {}}'; return;
            }
        }

        DuoWorldCommon::mapToObject($uiData, $tenantObj);

        // cross check against database whether tenant id is already registered.
        $tenantResponse = json_decode($this->retriveTenantData($tenantObj->TenantID));
        if(isset($tenantResponse->TenantID) && $tenantResponse->TenantID === $tenantObj->TenantID) {
            echo '{"Success":false, "Message": "' .$tenantObj->TenantID. ' is already registered.", "Data": {}}'; return;   
        }

	$appStr = @file_get_contents("appcodes.json");
        if(!appStr) {
            echo '{"Success":false, "Message": "appcodes.json file not found.", "Data": {}}'; return;
        }
        
        $Ttype = $tenantObj->TenantType;
        $this->apps = @$apps->$Ttype;
        if(is_null($this->$this->apps)) {
            echo '{"Success":false, "Message": "Invalid tenant type.", "Data": {}}'; return;
        }
        
        unset($tenantObj->TenantType);

        // execute post request to auth
        $invoker = new WsInvoker(SVC_AUTH_URL);
        $invoker->addHeader('securityToken', $this->securityToken);
        $tenantObj = $invoker->post($relUrl, $tenantObj);
        $tenantDecoded = json_decode($tenantObj);

        if($tenantDecoded) {
            if(isset($tenantDecoded->TenantID)) {
		$this->installApps($tenantDecoded->TenantID);
                echo '{"Success":true, "Message": "' . $tenantDecoded->TenantID . ' is successfully created.", "Data":' . $tenantObj . '}'; return; 
            }else {
                echo '{"Success":false, "Message": "' . $tenantObj . '", "Data": {}}'; return;    
            }
        }else {
            echo '{"Success":false, "Message": "' . $tenantObj . '", "Data": {}}'; return;    
        }
    }

    public function GetTenantInfo($tenantid) {
        $tenantResponse = $this->retriveTenantData($tenantid);
        $tenantResDecoded= json_decode($tenantResponse);
        if($tenantResDecoded) {
            if(isset($tenantResDecoded->TenantID)) { 
                echo json_encode($tenantObj);
            }else {
                echo '{"Success":false, "Message": "' . $tenantResponse . '", "Data": {}}'; return;   
            }
        }else {
                echo '{"Success":false, "Message": "' . $tenantResponse . '", "Data": {}}'; return;    
        }
    }
    
    private function retriveTenantData($tenantid) {
        $relUrl = "/tenant/GetTenant/";
        
        // execute post request to auth
        $invoker = new WsInvoker(SVC_AUTH_URL);
        $invoker->addHeader('securityToken', $this->securityToken);
        $tenantObj = $invoker->get($relUrl . $tenantid);
        return $tenantObj;
    }

    private function installApps($tenantid) {
        require_once("appinstaller.php");
        $installer = new AppInstaller();
        foreach($this->apps as $app) {
           $installer->install($app, $tenantid);
        }
        
        return;
    }
    

    function __construct() {

/*        
	$response = DuoWorldCommon::CheckSession();
        if(!$response->Success) {
            echo json_encode($response); return;
        }
*/
        
//	DuoWorldCommon::CheckAuth();
        $this->securityToken = $_COOKIE["securityToken"];

        Flight::route("POST /tenant", function() {
            $this->CreateTenant();
        });
        Flight::route("GET /tenant/@tenantid", function($tenantid) {
		$this->GetTenantInfo($tenantid);
        });
    }
}

