<?php
require_once ($_SERVER['DOCUMENT_ROOT'] . "/include/config.php");
require_once ($_SERVER['DOCUMENT_ROOT'] ."/include/duoapi/objectstoreproxy.php");

class devReve{
    public $id;  
    public $DevTenantID;
    public $BuyerTenantID;
    public $Appid;
    public $catogery;
    public $AppName;
    public $onetimeOrsubcription;
    public $period;
    public $price;
    public $date;
    public $RevenueToDeveloper;
    public $CommitionToDuoworld;
    public $client;
    

}
class TenantReve{
    public $id;
    public $TenantName;
    public $appOrPackage;
    public $appOrPackageid;
    public $installedBy;
    public $catogery;
    public $price;
    public $date;
    public $clent;
    

}
class appData{
    public $id;
    public $appkey;
    public $user;
    public $price;
    public $date;
    public $tenant;
    public $client;

}
class revenue {
    private function test(){
        echo '{"success":true "message":"Revenue data Service 1.0.0}';
    }
    public function getClientData(){
        $ip = $_SERVER['REMOTE_ADDR'];
        return (json_decode(file_get_contents("http://ipinfo.io/{$ip}")));
    }
    public function revenue($key,$type,$price,$tenantid){
        $authObj = json_decode($_COOKIE["authData"]);
        $username = $authObj->Username;
        date_default_timezone_set('Asia/Colombo');
        $date = date('m-d-Y h:i:s a', time());
        $Tenantpayment=new TenantReve();
        $DevPayment=new devReve();
        $appwise=new appData();

        $Tenantpayment->id="-999";
        $Tenantpayment->date=$date;
        $Tenantpayment->clent=$this->getClientData();
        $Tenantpayment->installedBy=$username;
        $Tenantpayment->price=-(int)$price;

        $DevPayment->id="-999";
        $DevPayment->BuyerTenantID=$tenantid;
        $DevPayment->Appid=$key;
        $DevPayment->date=$date;
        $DevPayment->client=$this->getClientData();
        $DevPayment->price=$price;
    
        $appwise->id="-999";
        $appwise->date=$date;
        $appwise->client=$this->getClientData();
        $appwise->user=$username;
        $appwise->price=$price;
        $appwise->tenant=$tenantid;
        $appwise->appkey=$key;

        if(strcmp($type,"TR")==0){
            $Tenantpayment->TenantName=$tenantid;
            $Tenantpayment->appOrPackage=$type;
            $planid = ObjectStoreClient::WithNamespace($tenantid, "tenantsubscription", "123");
            $planData=$planid->get()->byKey($tenantid);
            if(empty($planData)){
                echo '{"success":false "message":"plan data not found "}';
                exit();
            }
            // if(strcmp($key,$planData->code)!=0)
            $Tenantpayment->appOrPackageid=$key;
            $Tenantpayment->catogery="tenantsubscription";
            $clinetTenantWise=ObjectStoreClient::WithNamespace("cloudcharge.duoworld.com","TenantWiseRevenue","123");
            $Respond=$clinetTenantWise->store()->byKeyField("id")->andStore($Tenantpayment);
            if($Respond->IsSuccess ){
                echo '{"success":true "message":"Done..."}';
            }else{
                echo '{"success":false, "message":"request failed "}';
            }
        }else if(strcmp($type,"APP")==0){
            $Tenantpayment->TenantName=$tenantid;
            $Tenantpayment->appOrPackage="APP";
            $Tenantpayment->appOrPackageid=$key;
            $App = ObjectStoreClient::WithNamespace($GLOBALS['mainDomain'],"appstoreapps","123");
            $appdata = $App->get()->byKey($key);
        
            $Tenantpayment->catogery=$appdata->catogery;
            $Tenantpayment->price=$price;

            $DevPayment->catogery=$appdata->catogery;
            $DevPayment->AppName=$appdata->name;
            //$DevPayment->developeremail=$appdata->developer;
            $DevPayment->DevTenantID=$appdata->developer;
            if(isset($appData->subscriptionPeriod)){
                $DevPayment->onetimeOrsubcription="subcription";
                $DevPayment->period=$appdata->subscriptionPeriod;
            }else{
                $DevPayment->onetimeOrsubcription="onetime";
                $DevPayment->period="";
            }
            $DevPayment->RevenueToDeveloper=round((((int)$appdata->price)-(((int)$appdata->price*30)/100)),2);
            $DevPayment->CommitionToDuoworld=(int)$appdata->price-$DevPayment->RevenueToDeveloper;
            $clinetTenantWise=ObjectStoreClient::WithNamespace("cloudcharge.duoworld.com","TenantWiseRevenue","123");
            $clinetDevWise=ObjectStoreClient::WithNamespace("cloudcharge.duoworld.com","DevWiseRevenue","123");
            $clinetAppWise=ObjectStoreClient::WithNamespace("cloudcharge.duoworld.com","AppMarket","123");

            $RespondTenantWiseRevenue=$clinetTenantWise->store()->byKeyField("id")->andStore($Tenantpayment);
            $RespondDevWiseRevenue=$clinetDevWise->store()->byKeyField("id")->andStore($DevPayment);
            $RespondAppMarket=$clinetAppWise->store()->byKeyField("id")->andStore($appwise);


            if($RespondTenantWiseRevenue->IsSuccess && $RespondDevWiseRevenue->IsSuccess && $RespondAppMarket->IsSuccess){
                echo '{"success":true "message":"Done..."}';
            }else{
                echo '{"success":false, "message":"one or more requests failed "}';
            }
        }else{
            echo '{"success":false, "message":"Cannot identify the payment Type"}';
            exit();
        }
   }
    function __construct(){
        Flight::route("GET /",function(){$this->test();});
        Flight::route("GET /revenue/@appkey/@type/@price/@tenantid", function($appkey,$type,$price,$tenantid){$this->revenue($appkey,$type,$price,$tenantid);});

      
        
        header('Content-Type: application/json');
        header('Access-Control-Allow-Headers: Content-Type');
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST');
        
        
    }
}
?>
