<?php
// require_once(ROOT_PATH. "/payapi/duoapi/ratingengine/ratingengine.php");
// require_once(ROOT_PATH. "/include/duoapi/plan/plan.php");
require_once(ROOT_PATH. "/include/duoapi/objectstoreproxy.php");
require_once(ROOT_PATH. "/include/duoapi/cloudcharge.php");
require_once(ROOT_PATH. "/payapi/duoapi/ratingengine/ratingengine.php");

class TenantRule {

    private $tenantId;

    public function create($rules) {

        $arr = array();
        foreach ($rules as $rule) {
            foreach ($rule as $key => $value) {
                if($key === 'tag') { $tag = $value; $arr[$value] = new stdClass(); }
                if($key === 'expiry') { 
                    if(is_null($value)) $arr[$tag]->expiry = $value;
                    else { $arr[$tag]->expiry = $this->getExpiryDate($value); }
                }
                else $arr[$tag]->$key = $value;
            }
        }    

        $ch = curl_init("http://developer.duoworld.com/apis/ratingservice/createfortenant/$this->tenantId");
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
        curl_setopt($ch, CURLOPT_HTTPHEADER, array("Host: ". $this->tenantId, "securityToken:df0c8776a2e05357de3a23e8466c985b")); 
        curl_setopt($ch, CURLOPT_POST, 1 );
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($arr));
   
        $result = curl_exec($ch); 
        return json_decode($result);

    }

    public function get($tenantId) {
        return;
    }

    private function getExpiryDate($expiry) {
        $expiryDate = "";
        $date = explode("-", date("m-d-h-i"));
        switch ($expiry->uom) {
            case 'year':
                $expiryDate = ($date[3] - 3)." ".$date["2"]." ".$date[1]." ".$date[0]." "."*";
                break;
            case 'month':
                $expiryDate = ($date[3] - 3)." ".$date["2"]." ".$date[1]." 1-12 *";
                break;
        }

        return $expiryDate;   
    }

    function __construct($_tenantId) {
        $this->tenantId = $_tenantId;
    }

}

class FixedPlan {
    
    public function subscribe($planInfo, $token, $tenantId) {

        $plan = new stdClass();
        $plan->plan = $planInfo->code;
        $plan->amount = $planInfo->price;
        $plan->quantity = 1;

        var_dump($plan); exit();
        // (new CloudCharge())->plan()->subscribeToFixedplan($token ,$planInfo); 
        // {"plan":"Gold", "amount": 10, "quantity":1}
    }

    public function upgrade() {

        (new CloudCharge())->plan()->upgradeToFixedplan($planInfo); 
        // {"plan":"Gold", "amount": 10, "quantity":1}
    }

}

class AlacartePlan {

    public function subscribe() {
        // require_once('include/duoapi/cloudcharge.php');
        (new CloudCharge())->plan()->subscribeToCustomplan($token ,$planInfo);

        // {"tag": "user", "sign": "==", "qty": "3", "expiry":"0 0 1 1-12 *" } plan object
        // {"tag":"Package","feature": "Gold Package","amount": 20,"quantity":0,"action":"add"}

        /* {
            "attributes":  [{"tag":"Package","feature": "Gold Package","amount": 20,"quantity":0,"action":"add"},{"tag":"user","feature": "Additional +1 user","amount": 10, "quantity":5,"action":"add"}],
            "subscription": "month",
            "quantity": 1 
         } */
    }

    public function customize() {
        // require_once('include/duoapi/cloudcharge.php');
        (new CloudCharge())->plan()->customize($planInfo);
        /* {
            "features": [
                {"tag":"storage","feature": "25GB storage","quantity":0,"amount": 30,"action":"remove"},
                {"tag":"user","feature": "Additional users","amount": 15,"quantity":5,"action":"add"}
            ]
        } */
    }

    public function upgrade() {
        // require_once('include/duoapi/cloudcharge.php');
        (new CloudCharge())->plan()->upgradeToCustomplan($planInfo);
        /* {
            "attributes": [
                {"tag":"storage","feature": "25GB storage","quantity":0,"amount": 30,"action":"remove"},
                {"tag":"user","feature": "Additional users","amount": 15,"quantity":5,"action":"add"}
            ],
            "subscription": "month",
            "quantity": 1 
        } */ 
    }

    private function tags() {
        $attributes = array();
        $attr = new attribute("Package", $plan->name, $plan->price, "add");
        

    }

}

class FreePlan {

    public function subscribe($planInfo, $tenantId) {

        $plan = new stdClass();
        $plan->planCode = $planInfo->code;
        $plan->tenantId = $tenantId;
        $plan->planName = $planInfo->name;
        $plan->type = $planInfo->type;
        $plan->datePurchased = date('Y-m-d');
        $plan->dateExpiration = "no expiry";
        $plan->alacarts = [];

        $client = ObjectStoreClient::WithNamespace($tenantId, "tenantsubscription", "123");
        $response = $client->store()->byKeyField("tenantId")->andStore($plan);
        if(isset($response->IsSuccess) && $response->IsSuccess) { 
            $response = (new TenantRule($tenantId))->create($planInfo->rules);
            if(isset($response->success) && $response->success) {
                echo '{"success": true, "message": "successfully purchased."}';
            }
        }
        
    }

}

class TrialPlan {

    public function subscribe() {
        return;
    }

    public function upgrade() {
        return;
    }

}

class PlanHandler {

   /*
        {
            "token": "tok_vnsdfuioby78fybd89hwn93vy7",
            "tenantId": "priceplan.developer.duoworld.com",
            "planCode": "12_alacart_user_perM",
            "alacarts":[
                {"acode": "12_alacart_user_perM", "quantity":10}
            ]
        }
    */

    public function subscribe($payload) {
        
        // check validity of the payload
        $reqpayload = array('tenantId', 'planCode');
        if(!$this->isValidPayload($payload, $reqpayload))  { /* invalid request payload */ }

        // check for tenant subscription 
        // code goes here

        // search for plan 

        $plan = $this->getPlan($payload->planCode);
        if($plan->price > 0 && !$plan->customizable) (new FixedPlan())->subscribe($plan, $payload->token, $payload->tenantId);
        // free plan
        // (new FreePlan())->subscribe($plan, $payload->tenantId);

        // fixed plan
        // (new FixedPlan())->subscribe()

    }

    public function upgrade() {
        // if user currently in free package 
        // when upgrading to fixed or custom package
        // initial payment should be happened.

    }

    public function current() {
        $client = ObjectStoreClient::WithNamespace(DuoWorldCommon::GetHost(), "tenantsubscription", "123");
        $subscription = $client->get()->bykey(DuoWorldCommon::GetHost());

        if(!isset($subscription->IsSuccess)) {
            if(!empty($subscription)) {
                $obj = new stdClass();
                $obj->planCode = $subscription->planCode;
                $obj->planname = $subscription->planName;
                $obj->type = $subscription->type;
                $obj->purchasedDate = $subscription->datePurchased;
                $obj->expiryDate = $subscription->dateExpiration;
                $obj->alacarts = $subscription->alacarts; 

                echo '{"success": true, "message": "", "data": '.json_encode($obj).'}';
            } else echo '{"success": false, "message": "no plan subscription found.", "data": ""}';  
        } else echo '{"success": false, "message": "'.$subscription->Message.'", "data": ""}';

        return;

    }

    public function getPlan($planCode) {
        $plans = json_decode(file_get_contents('12thDoor_pkg_ref.json'));
        foreach ($plans as $plan) {
            if($plan->code === $planCode)
                return $plan;
        }
    }

    public function checkSubscription($checklocally = false) {

        if($checklocally) {
            $client = ObjectStoreClient::WithNamespace(DuoWorldCommonTest::GetHost(), "tenantsubscription", "123");
        }

        $subscription = (new CloudCharge())->plan()->checkSubscription(); 
        if($subscription->status)
        
       
        $account = $client->get()->bykey();
    }

    public function stopSubscription() {

    }

    private function isValidPayload($payload, $reqPayload) {
        $is_valid = true;
        if(!is_array($payload)) $payload = (array)$payload;
        foreach ($reqPayload as $key) {
            if(!isset($payload[$key])) { $is_valid = false; break; }
            if(empty($payload[$key])) { $is_valid = false; break; }
        }
        return $is_valid;
    }

    function __construct() {

    }

}

class PlanService {

    public function subscribe() { 
        $payload = json_decode(Flight::request()->getBody());
        (new PlanHandler())->subscribe($payload);
    }

    public function upgrade() { }

    public function current() {
        (new PlanHandler())->current();
    }


    function __construct() {

        // POST /plan/subscribe
        Flight::route('POST /subscribe', function() { $this->subscribe(); });

        // POST /plan/upgrade
        Flight::route('POST /upgrade', function() { $this->upgrade(); });

        // GET /plan/current
        Flight::route('GET /current', function() { $this->current(); });

        // GET  /plan/all
        // GET  /plan/@code
    }

}

?>
