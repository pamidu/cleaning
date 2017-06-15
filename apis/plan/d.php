<?php

require_once(ROOT_PATH. "/include/config.php");
require_once(ROOT_PATH. "/include/duoapi/cloudcharge.php");
require_once (ROOT_PATH ."/include/duoapi/objectstoreproxy.php");
require_once(ROOT_PATH. "/payapi/duoapi/ratingengine/ratingengine.php");

class CustomPlanAttrirutesStruct {

    public $tag;
    public $feature;
    public $amount;
    public $quantity;
    public $action;

    function __construct($_tag, $_feature, $_amount, $_quantity, $_action) {
        $this->tag = $_tag;
        $this->feature = $_feature;
        $this->amount = $_amount;
        $this->quantity = $_quantity;
        $this->action = $_action;
    }

}

class TenantRule {

    private $tenantId;
    private $securityToken;

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

        // echo json_encode($this->tenantId); exit();

        $ch = curl_init("http://" . $GLOBALS["mainDomain"] ."/apis/ratingservice/createfortenant/$this->tenantId");
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
        curl_setopt($ch, CURLOPT_HTTPHEADER, array("Host: ". $this->tenantId, "securityToken: ". $this->securityToken)); 
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

        if(isset($_COOKIE['securityToken'])) $this->securityToken = $_COOKIE['securityToken'];
        else $this->securityToken = getallheaders()['securityToken'];
    }

}

class NonPricingPlan {

    public function storeSubscription($plan, $tenantId) {

        $planType = ($plan->price === 0.0 && is_null($plan->subscriptionunit)) ? "free" : "trial";

        $npplan = new stdClass();
        $npplan->planCode = $plan->code;
        $npplan->tenantId = $tenantId;
        $npplan->planName = $plan->name;
        $npplan->type = $planType;
        $npplan->status = "trialing";
        $npplan->created = time();
        $npplan->currentperiodstart = time();
        $npplan->currentperiodend = ($planType === "free") ? 0 : $this->getTrailExpiry($npplan->currentperiodstart, $plan->subscriptionunit, $plan->subscriptionqty);
        $npplan->alacarts = [];

        $client = ObjectStoreClient::WithNamespace($tenantId, "tenantsubscription", "123");
        $osresponse = $client->store()->byKeyField("tenantId")->andStore($npplan);

        return $osresponse;

    }

    private function getTrailExpiry($pt, $su, $sq) {
        return strtotime ( "+$sq $su"."s", $pt);
    }

}

class FixedPlan {

    public function subscribe($plan, $token) {
        /* {"plan":"Gold", "amount": 10, "quantity":1} */

        $fixedplan = new stdClass();
        $fixedplan->plan = $plan->code;
        $fixedplan->amount = (is_string($plan->price)) ? (float)$plan->price : $plan->price;
        $fixedplan->quantity = 1;

        $response = (new CloudCharge())->plan()->subscribeToFixedplan($token ,$fixedplan);
        return $response;

    }

    public function upgrade($plan) {
        /* {"plan":"Gold", "amount": 10, "quantity":1} */

        $fixedplan = new stdClass();
        $fixedplan->plan = $plan->code;
        $fixedplan->amount = (is_string($plan->price)) ? (float)$plan->price : $plan->price;
        $fixedplan->quantity = 1;

        $response = (new CloudCharge())->plan()->upgradeToFixedplan($fixedplan);
        return $response;
    }

    public function storeSubscription($plan, $subscription, $tenantId) {

        $fxplan = new stdClass();
        $fxplan->planCode = $plan->code;
        $fxplan->tenantId = $tenantId;
        $fxplan->planName = $plan->name;
        $fxplan->type = "fixed";
        $fxplan->created =  $subscription->createdDate;
        $fxplan->currentperiodstart = $subscription->currentPeriod;
        $fxplan->currentperiodend = $subscription->currentPeriodEnd;
        $fxplan->status = $subscription->status;
        $fxplan->alacarts = [];

        $client = ObjectStoreClient::WithNamespace($tenantId, "tenantsubscription", "123");
        $osresponse = $client->store()->byKeyField("tenantId")->andStore($fxplan);

        return $osresponse;

    }

}

class CustomPlan {

    public function subscribe($plan, $token, $alacarts) {

        /*
            {
                "attributes": [
                    {"tag":"package","feature": "Gold Package","amount": 20,"quantity":1,"action":"add"},
                    {"tag":"storage","feature": "25GB storage","quantity":0,"amount": 30,"action":"remove"},
                    {"tag":"user","feature": "Additional users","amount": 15,"quantity":5,"action":"add"}
                ],
                "subscription": "month",
                "quantity": 1 
            }
        */

        $customplan = new stdClass();
        $customplan->subscription = $plan->subscriptionunit;
        $customplan->quantity = 1;
        $customplan->attributes = $this->attributes($plan, $alacarts);

        echo json_encode($customplan); exit();

        $response = (new CloudCharge())->plan()->subscribeToCustomplan($token ,$customplan);
        return $response;
    }

    public function upgrade() {

    }

    public function customize() {

    }

    private function attributes($plan, $alacarts) {
        $_attrs = array();
        $packageattr = (new CustomPlanAttrirutesStruct("package", $plan->name, $plan->price, 1, "add"));
        foreach ($alacarts as $alacart) {
            $alattr = (new CustomPlanAttrirutesStruct($alacart->tag, $alacart->name, $alacart->price, 3, "add"));
            array_push($_attrs, $alattr);            
        }

        array_push($_attrs, $packageattr);
        return $_attrs;
    } 

}

class PricePlan {

    public function subscribe($p) {

        $vpresponse = $this->validPayload($p, array('planCode', 'tenantId'));
        if(!$vpresponse->status)
            throw new Exception("Payload validation error: $vpresponse->property property required.");

        $subscription = $this->eligibleToSubscribe($p->tenantId);
        if(!$subscription->eligibility)
            throw new Exception("Subscription failure: Alreday subscribes to '".$subscription->plan->planName."' plan.");

        $plan = $this->getPlan($p->planCode);
        if(is_null($plan)) throw new Exception("Failed to fetch data: Invalid plan code.");

        if($plan->price === 0.0) { // free plan or trail plan

            $ruleresponse = (new TenantRule($p->tenantId))->create($plan->rules); // add rules to rating engine 
            if(isset($ruleresponse->success) && $ruleresponse->success) {
                $osresponse = (new NonPricingPlan())->storeSubscription($plan, $p->tenantId); // store subscription details in objectstore
                if(isset($osresponse->IsSuccess) && $osresponse->IsSuccess) {  echo '{"success": true, "message": "Successfull."}'; return; }
                else throw new Exception("Data storing error: $osresponse->Message");
            } else throw new Exception("Tenant rule failure: $ruleresponse->message");
        } else { // paid plan

            if(!isset($p->token))
                throw new Exception("Payload validation error: token property required.");

            $planClient;
            if($plan->price > 0.0 && !$plan->customizable) // fixed plan
                $planClient = new FixedPlan(); 
            else if($plan->price > 0.0 && $plan->customizable) // custom plans
                $planClient = new FixedPlan(); //$planClient = new CustomPlan();

            $ccresponse = $planClient->subscribe($plan, $p->token);

            if(isset($ccresponse->status)) { 
                if($ccresponse->status) { // payment successfull
                    $ruleresponse = (new TenantRule($p->tenantId))->create($plan->rules); // add rules to rating engine
                    if(isset($ruleresponse->success) && $ruleresponse->success) { // rules added
                        $subscriptionInfo = $ccresponse->response[0];
                        $osresponse = $planClient->storeSubscription($plan, $subscriptionInfo, $p->tenantId); // store subscription details in objectstore
                        if(isset($osresponse->IsSuccess) && $osresponse->IsSuccess) {  echo '{"success": true, "message": "Successfull."}'; return; }
                        else throw new Exception("Data storing error: $osresponse->Message");
                    }else throw new Exception("Tenant rule failure: $ruleresponse->message"); // error in adding rules
                }
                else throw new Exception("Payment processing error: $ccresponse->response"); //error in payment
            }
        }

    }

    public function customize($p) {

        $cplan = $this->_currentPlan();
        if(!empty($cplan)){
            if($cplan->status !== "trialing") throw new Exception("Plan customize failure: ");
        } else throw new Exception("Plan customize failure: Currently not subscribed to any plan.");
        
        if($cplan->type !== "custom") throw new Exception("Plan customization restricted: This option only available for custom plans.");
        

    }

    public function upgrade($p) {

        $vpresponse = $this->validPayload($p, array('planCode'));
        if(!$vpresponse->status)
            throw new Exception("Payload validation error: $vpresponse->property property required.");

        $cplan = $this->_currentPlan();
        if(!empty($cplan)){ 
            if($cplan->status !== "trialing") throw new Exception("Plan upgrade failure: ");
        } else throw new Exception("Plan upgrade failure: Currently not subscribed to any plan.");

        $uplan = $this->getPlan($p->planCode);
        if(is_null($uplan)) throw new Exception("Plan upgrade failure: Trying to upgrade to invalid plan.");

        // already subscribe for requested plan
        if($cplan->planCode === $uplan->code)
            throw new Exception("Plan upgrade restricted: Already subscribed for requested plan.");

        if($cplan->type === "trial" || $cplan->type === "free") { // if currently in trial or free plan, plan subscription should happen not a upgrade.
            $p->tenantId = DuoWorldCommon::GetHost();
            $this->subscribe($p);
        } else {
            $planClient;
            if($uplan->price > 0.0 && !$uplan->customizable) // trying to upgrade to fixed plan
                $planClient = new FixedPlan();
            if($uplan->price > 0.0 && $uplan->customizable) // trying to upgrade to custom plan
                $planClient = new FixedPlan();// $planClient = new CustomPlan();

            $ccresponse = $planClient->upgrade($uplan);

            if(isset($ccresponse->status)) { 
                if($ccresponse->status) { // payment successfull
                    $ruleresponse = (new TenantRule(DuoWorldCommon::GetHost()))->create($uplan->rules); // add rules to rating engine
                    if(isset($ruleresponse->success) && $ruleresponse->success) { // rules added
                        $subscriptionInfo = $ccresponse->response[0];
                        $osresponse = $planClient->storeSubscription($uplan, $subscriptionInfo, DuoWorldCommon::GetHost()); // store subscription details in objectstore
                        if(isset($osresponse->IsSuccess) && $osresponse->IsSuccess) {  echo '{"success": true, "message": "Successfull."}'; return; }
                        else throw new Exception("Data storing error: $osresponse->Message");
                    }else throw new Exception("Tenant rule failure: $ruleresponse->message"); // error in adding rules
                }
                else throw new Exception("Payment processing error: $ccresponse->response"); //error in payment
            }
        }

    }

    public function checkSubscription() {

        $subscriptionStatus = false; // if not expired subscriptionStatus = true
        $cplan = $this->_currentPlan();
        if(empty($cplan)) echo '{"success": false, "message": "Tenant Subscription: Not subscribed to any plan."}';

        if($cplan->type === "free") $subscriptionStatus = true; // free plan never expire
        else if($cplan->type === "trial") { // trial plan
            $expired = $this->isSubscriptionExpired($cplan->currentperiodend);
            if(!$expired) $subscriptionStatus = true;
        } else { // fixed or custom plan
            $expired = $this->isSubscriptionExpired($cplan->currentperiodend);
            if($expired) { // subscription period expired according to local database.
                $ccresponse = (new CloudCharge())->plan()->checkSubscription(); 
                if(isset($ccresponse->status)) { // subscription charges repaid.
                    $subscriptionStatus = true;
                    $subscription = $ccresponse->response[0];
                    $this->updateSubscription($subscription);
                }else { // subscription charges not paid
                    $subscription = $ccresponse->response[0];
                    $this->updateSubscription($subscription);
                }
            } else $subscriptionStatus = true;
        }

        
        $subscriptionStatus = ($subscriptionStatus) ? "true" : "false";
        echo "{\"success\": $subscriptionStatus}";
        return;

    }

    public function getPlan($planCode) {

        $_plan = null;
        $plans = json_decode(file_get_contents('priceplan.json'));
        foreach ($plans as $plan)
            if($plan->code === $planCode)
                $_plan = $plan;
        return $_plan;

    }

    public function getAlacart($alacartCode) {
        $_alacart = null;
        $alacarts = json_decode(file_get_contents('alacarts.json'));
        foreach ($alacarts as $alacart) {
            if($alacart->code === $alacartCode)
                $_alacart = $alacart;
        }
        return $alacart;

    }

    public function currentPlan($namespace) {

        $cplan = $this->_currentPlan();
        if(empty($cplan)) echo '{"success": false, "message": "Tenant Subscription: Not subscribed to any plan."}';
        else {

            $response = new stdClass();
            $response->codename = $cplan->planCode;
            $response->planName = $cplan->planName;
            $response->type = $cplan->type;
            $response->status = $cplan->status;
            $response->subscriptionperiodEnd = ($cplan->currentperiodend === 0) ? "0000-00-00 00:00:00" : date("Y-m-d h:i:s", $cplan->currentperiodend);
            $response->subscriptionPeriodStart = date("Y-m-d h:i:s", $cplan->currentperiodstart);
            $response->subscriptionCreated = date("Y-m-d h:i:s", $cplan->created);
            echo '{"success": true, "message": "", "data":'.json_encode($response).'}';
        }
        return;

    }

    public function stopSubscription() {

    }

    private function renewSubscription() {
        
        $client = ObjectStoreClient::WithNamespace($namespace, "tenantsubscription", "123");
        $osresponse = $client->store()->byKeyField("tenantId")->andStore($cplan);
        return $osresponse;
    }

    private function updateSubscription($cplan, $namespace, $start, $end, $create = "") {

        $cplan->created = ($create !== "") ? $create : $cplan->created; 
        $cplan->currentperiodstart = $start;
        $cplan->currentperiodend = $end; 

        $client = ObjectStoreClient::WithNamespace($namespace, "tenantsubscription", "123");
        $osresponse = $client->store()->byKeyField("tenantId")->andStore($cplan);
        return $osresponse;

    }

    private function eligibleToSubscribe($tenantId) {
        $eligibility = false;
        $cplan = $this->_currentPlan($tenantId);
        if(!empty($cplan)) {
            if($cplan->type === "trial" || $cplan->type === "free") $eligibility = true;
            else if( $cplan->status === "canceled") $eligibility = true;
        } else $eligibility = true;

        $res = new stdClass(); $res->eligibility = $eligibility; $res->plan = $cplan;
        return $res;

    }

    private function _currentPlan($namespace = "") {
        if($namespace === "") $namespace = DuoWorldCommon::GetHost();

        $client = ObjectStoreClient::WithNamespace($namespace, "tenantsubscription", "123");
        $osresponse = $client->get()->bykey($namespace);

        if(!isset($osresponse->IsSuccess)) return $osresponse;
        else throw new Exception("Data fetching error: $osresponse->Message");
    }

    private function isSubscriptionExpired($currentperiodend) {
        $expired = false;
        $currentTimestamp = time();

        if($currentTimestamp > $currentperiodend) $expired = true;
        return $expired;

    }

    private function validPayload($payload, $reqPayload) {
        $valid = true;
        $property = "";

        if(!is_array($payload)) $payload = (array)$payload;
        foreach ($reqPayload as $key) {
            if(!isset($payload[$key])) { $valid = false; $property = $key; break; }
            if(empty($payload[$key])) { $valid = false; $property = $key; break; }
        }

        $valid = ($valid) ? "true" : "false";
        return json_decode("{\"status\": $valid, \"property\": \"$property\"}");

    }

}

class PlanService {

    public function subscribe() { 

        $request = Flight::request();

        try {
            $payload = json_decode($request->getBody());
            if(is_null($payload))
                throw new Exception("Invalid request payload.");

            (new PricePlan())->subscribe($payload);
        } catch(Exception $ex) {
            echo 'Message: ' . $ex->getMessage() . " line:" . $ex->getLine() . " file:" . $ex->getFile();
        }

    }

    public function upgrade() { 

        $request = Flight::request();

        try {
            $payload = json_decode($request->getBody());
            if(is_null($payload))
                throw new Exception("Invalid request payload.");

            (new PricePlan())->upgrade($payload);
        } catch(Exception $ex) {
            echo 'Message: ' . $ex->getMessage() . " line:" . $ex->getLine() . " file:" . $ex->getFile();
        }

    }

    public function customize() {

        $request = Flight::request();

        try {
            $payload = json_decode($request->getBody());
            if(is_null($payload))
                throw new Exception("Invalid request payload.");

            (new PricePlan())->customize($payload);
        } catch(Exception $ex) {
            echo 'Message: ' . $ex->getMessage() . " line:" . $ex->getLine() . " file:" . $ex->getFile();
        }

    }

    public function checkSubscription() {
        
        try {
            (new PricePlan())->checkSubscription();
        } catch(Exception $ex) {
            echo 'Message: ' . $ex->getMessage() . " line:" . $ex->getLine() . " file:" . $ex->getFile();
        }

    }

    public function current() {

        try {
            (new PricePlan())->currentPlan(DuoWorldCommon::GetHost());
        } catch(Exception $ex) {
            echo 'Message: ' . $ex->getMessage() . " line:" . $ex->getLine() . " file:" . $ex->getFile();
        }

    }

    public function stopSubscription($now) { }

    function __construct() {

        // POST /plan/subscribe
        Flight::route('POST /subscribe', function() { $this->subscribe(); });

        // POST /plan/upgrade
        Flight::route('POST /upgrade', function() { $this->upgrade(); });

        // POST /plan/customize
        Flight::route('POST /customize', function() { $this->customize(); });

        // GET /plan/subscription/check
        Flight::route('GET /subscription/check', function() { $this->checkSubscription(); });

        // GET /plan/current
        Flight::route('GET /current', function() { $this->current(); });

        // GET /plan/subscription/stop
        Flight::route('GET /subscription/stop(/@stopnow)', function($stopnow) { /* stop subscription */ });

    }

}

?>