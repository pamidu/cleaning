<?php
require_once($_SERVER['DOCUMENT_ROOT'] . "/include/config.php");
define ("BASE_PATH", ROOT_PATH . "/payapi");
require_once(ROOT_PATH . "/dwcommon.php");
require_once ("common.php");
require_once("duoapi/tenantapiproxy.php");
require_once("duoapi/appinstaller.php");
require_once("duoapi/objectstoreproxy.php");


//require_once (ROOT_PATH . "/include/config.php");

if(!isset($_COOKIE["securityToken"])){
 header("Location: http://".$mainDomain."/login.php");
}

if(isset($_GET["type"])){
	 $type=$_GET["type"];
	 $uriuser=$_GET["TenantID"];
	 //bank, com
}
else
{
	$type = "cust";
	$user = json_decode($_COOKIE['authData']);
//	$uriuser = str_replace("@",".",$user->Email).".cust.".$mainDomain;
    $client = ObjectStoreClient::WithNamespace("duosoftware.com","usernames","123");
    $usernames = $client->get()->byFiltering("select * from usernames where Email = '". $user->Email . "'");
    
    if(sizeof($usernames)>1){
        foreach($usernames as $username){
            if($username['Email'] == $user->Email){
                $uriuser = $username['Username'];
                break;
            }
        }
    }else{
        //$uriuser = $usernames[0]['Username'];
    }

}

//str_replace("world","Peter","Hello world!");

class OtherTenantData {
	public $Email;
	public $UserName;
    public $AccountID;
}

function genarateTenantAccountID(){
    return substr(number_format(time() * rand(),0,'',''),0,4) ."-" . substr(number_format(round(microtime(true)) * rand(),0,'',''),0,4);  
}

if ($type=="cust"){
	
	$authObj = json_decode($_COOKIE["authData"]);
	$secToken = $_COOKIE["securityToken"];
	//echo str_replace('.','', str_replace('@','',$authObj->Username));
	//exit();

	$tenantObj = new CreateTenantRequest();
	$tenantObj->Shell = "/shell/index.html#/duoworld-framework/dock";
	unset($tenantObj->Statistic);
	$tenantObj->Private = true;
	$tenantObj->TenantID = str_replace('.','', str_replace('@','',$authObj->Username)).".space.".$mainDomain;
	$tenantObj->Name = "My Dock"; //$authObj->Username;
	$uriuser=$tenantObj->TenantID;
	$otherData = new OtherTenantData();
	$otherData->Email = $authObj->Email;
	$otherData->UserName = $authObj->Username;
	$otherData->AccountID = "dw-" . genarateTenantAccountID();
	$tenantObj->OtherData = $otherData;

	$tenantService = new TenantProxy($secToken);
	$tenantResponse = $tenantService->CreateTenant($tenantObj);	
    
    $tRef = new TenantRef();
    $tRef->AccountID = $otherData->AccountID;
    $tRef->TenantID = $tenantObj->TenantID;
    $tRef->Email = $otherData->Email;
    
    $client = ObjectStoreClient::WithNamespace("pay.gov.lk","tenantRef","123");
    $client->store()->byKeyField("AccountID")->andStore($tRef);
}

$installer = new AppInstaller();
$devApps = array("APP_SHELL_SETTINGS","APP_SHELL_DEVSTUDIO","APP_SHELL_MARKETPLACE");
$comApps = array("APP_SHELL_SETTINGS", "APP_TRANSACTION", "APP_TRANSACTION_DETAILS","APP_COMPANY_ATTRIBUTES","APP_SHELL_MARKETPLACE");
$custApps = array("APP_SHELL_MY_TENANTS","APP_SHELL_SETTINGS","APP_SHELL_MARKETPLACE");
$installApps;

if (isset($type)){
	switch ($type){
		case "dev":
			$installApps = $devApps;
			break;
		case "com":
			$installApps = $comApps;
			break;
		default:
			$installApps = $custApps;
			break;
	}	
}
else $installApps = $custApps;

foreach ($installApps as $app)
	$installer->Install($app, $uriuser);

header("Location: http://". $uriuser. "/s.php?securityToken=" . $secToken);

?>
