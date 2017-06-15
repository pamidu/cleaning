<?php
require_once(ROOT_PATH. "/payapi/duoapi/ratingengine/ratingengine.php");
class RatingService {
    private $rateEngine;
    private function test(){
        echo "Rating Engine Service is Working!!!";
    }
    private function Process($tenantid, $route, $size, $criteria){
        $headers=null;
        if ($_SERVER['REQUEST_METHOD'] === 'POST'){
            $headers = json_decode(Flight::request()->getBody());
            if (!is_array($headers)) $headers = null;
        }
        if ($this->rateEngine->Validate($tenantid, $route, $size,$criteria)){
            $this->rateEngine->Rate($tenantid, $route, $size, $criteria, $headers);
            $this->showSuccess("Rating successfully completed!!!");
        }
        else{
             $this->showFaluire("Your quota has been exceed");
        }
    }
    
    private function getUsage($namespace, $route, $criteria){
        $obj = json_decode(Flight::request()->getBody());        
        $key = ($criteria === "tenant") ? "deny:$namespace.$route": "deny:$namespace.$route:$username";       
        $this->showSuccess( $this->rateEngine->getUsage($key));
    }
    
    private function getFree($namespace, $route, $criteria){
        $obj = json_decode(Flight::request()->getBody());        
        $key = ($criteria === "tenant") ? "deny:$namespace.$route": "deny:$namespace.$route:$username";       
        $this->showSuccess( $this->rateEngine->getFree($key));
    }
    
    private function CreateForUser($namespace, $userid){
        $obj = json_decode(Flight::request()->getBody());
        $this->rateEngine->CreateRulesForUser($namespace, $userid, $obj);
        $this->showSuccess("Successfully added rules for user $userid in tenant $namespace");
    }
    private function CreateForTenant($namespace){
        $obj = json_decode(Flight::request()->getBody());
        $this->rateEngine->CreateRulesForTenant($namespace, $obj);
        $this->showSuccess("Successfully added rules for tenant $namespace");
    }
    private function showSuccess($msg){
        header("Content-Type: application/json");
        if($msg=="")
                $msg=0;
        echo "{\"success\": true, \"message\":\"$msg\"}";
    }
    
    private function showFaluire($msg){
        header("Content-Type: application/json");
        echo "{\"success\": false, \"message\":\"$msg\"}";
    }
    function __construct(){       
        $this->rateEngine = new RatingEngine();
        Flight::route("GET /test",function(){$this->test();});
        Flight::route("GET /process/usage/@tenantid/@route/@criteria",function($tenantid,$route, $criteria){$this->getUsage($tenantid, $route, $criteria);});
        Flight::route("GET /process/free/@tenantid/@route/@criteria",function($tenantid,$route, $criteria){$this->getFree($tenantid, $route, $criteria);});
        
        Flight::route("POST /process/@tenantid/@route/@size/@criteria",function($tenantid,$route,$size, $criteria){$this->Process($tenantid, $route, $size, $criteria);});
        Flight::route("GET /process/@tenantid/@route/@size/@criteria",function($tenantid,$route,$size, $criteria){$this->Process($tenantid, $route, $size, $criteria);});
        Flight::route("POST /createforuser/@namespace/@userid",function($namespace, $userid){$this->CreateForUser($namespace, $userid);});
        Flight::route("POST /createfortenant/@namespace",function($namespace){$this->CreateForTenant($namespace);});
    }
}
?>
