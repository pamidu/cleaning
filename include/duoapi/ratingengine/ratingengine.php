<?php
    require_once($_SERVER["DOCUMENT_ROOT"]. "/payapi/duoapi/queuemanager/queuemanager.php");
    class RatingEngine {
        public function RateStorage($namespace, $class, $size){
            $headers = array("class"=>$class);
            return $this->Rate($namespace, "storage", $size, "tenant", $headers);
        }
        public function Rate($namespace, $route, $size, $criteria, $headers=null){
            $rateObj = new stdClass();
            $rateObj->headers = new stdClass();
                $rateObj->headers->namespace = $namespace;
                $rateObj->headers->securityToken = $_COOKIE["securityToken"];
                
                if (isset($_COOKIE["authData"])){
                    $authObj = json_decode($_COOKIE["authData"]);
                    $rateObj->headers->username = $authObj->Username;
                }else $rateObj->headers->username = "anonymous";
            if (isset($headers)){
                foreach ($headers as $hkey => $hvalue) 
                    $rateObj->headers->$hkey = $hvalue;
            }
            $rateObj->body = new stdClass();
                $rateObj->body->size = $size;
                $rateObj->body->criteria = $criteria;
            $rateObj->route = $route;
            
            return $this->sendToQueue($route, $rateObj);
        }
        
         public function getUsage($key){
            require_once($_SERVER["DOCUMENT_ROOT"]. "/payapi/duoapi/ratingengine/vendor/autoload.php");
            Predis\Autoloader::register();
            
            $host;
            if (defined("RATING_ENGINE_REDIS_HOST")) $host = RATING_ENGINE_REDIS_HOST;
            else $host = "localhost";
            $client = new Predis\Client(['scheme'=>'tcp','host'=>$host,'port'=>6379, 'database' => 10]);
            $value = $client->get($key);     
           
            return $value;
        }
        
         public function getFree($key){             
             
            require_once($_SERVER["DOCUMENT_ROOT"]. "/payapi/duoapi/ratingengine/vendor/autoload.php");
            Predis\Autoloader::register();
            
            $host;
            if (defined("RATING_ENGINE_REDIS_HOST")) $host = RATING_ENGINE_REDIS_HOST;
            else $host = "localhost";
            $client = new Predis\Client(['scheme'=>'tcp','host'=>$host,'port'=>6379, 'database' => 10]);
            $used = $client->get($key); 
            $limitValue = $client->get($key."_limit");
            $free = 0;
             
            if(isset($used)){
               if (is_string($used)) $used = (int)($used);
               if (is_string($limitValue)) $limitValue = (int)($limitValue);
               $free = $limitValue - $used;
            }
            else{
               if (is_string($limitValue)) $limitValue = (int)($limitValue);
               $free = $limitValue;
            }
           return $free;
             
           
            
        }
        
        
        private function validateWithRedis($key,$size){
            require_once($_SERVER["DOCUMENT_ROOT"]. "/payapi/duoapi/ratingengine/vendor/autoload.php");
            Predis\Autoloader::register();
            $host;
            if (defined("RATING_ENGINE_REDIS_HOST")) $host = RATING_ENGINE_REDIS_HOST;
            else $host = "localhost";
            $client = new Predis\Client(['scheme'=>'tcp','host'=>$host,'port'=>6379, 'database' => 10]);
            $limitValue = $client->get($key."_limit");
            $isValid = true;
            //var_dump($key);
            if (isset($limitValue)){
                $value = $client->get($key);
                if (is_string($value)) $value = (int)($value);
                if (is_string($size)) $size = (int)($size);
                if (is_string($limitValue)) $limitVal = (int)($limitValue);
                $newVal = $value + $size;
                if ($newVal > $limitValue) $isValid = false;
            }
            return $isValid;
        }
        private function sendToQueue($name,$obj){
            $queueManager = new QueueManager();
            return $queueManager->Queue($name,$obj);
        }
        public function ValidateStorage($namespace, $class, $size){
            return $this->Validate($namespace, "storage", $size, "tenant");
        }
        public function Validate($namespace, $class, $size, $criteria){
            
            $username;
            if (isset($_COOKIE["authData"])){
                $authObj = json_decode($_COOKIE["authData"]);
                $username = $authObj->Username;
            }else $username = "anonymous";
            
            $key = ($criteria === "tenant") ? "deny:$namespace.$class": "deny:$namespace.$class:$username";
            $isValid = $this->validateWithRedis($key,$size);
            /*if (!$isValid){
                http_response_code(404);
                header ("Content-Type: application/json");
                echo '{"success": false, "message": "Your storage quota has been exceed"}';
                exit();
            }*/
            return $isValid;
        }
        public function CreateRulesForUser($namespace, $userid, $obj, $expiry = null){
            $this->createRules($namespace, $userid, $obj, $userid, $expiry);
        }
        public function CreateRulesForTenant($namespace, $obj, $expiry = null){
            $this->createRules($namespace, $namespace, $obj, $namespace, $expiry);
        }
        private function createRules($namespace, $userid, $obj, $id, $expiry){
            require_once(ROOT_PATH. "/payapi/duoapi/objectstoreproxy.php");
            $client = ObjectStoreClient::WithNamespace($_SERVER["HTTP_HOST"],"ratingenginerules","123");	
            $ruleObj = new stdClass();
            $ruleObj->id = $id;
            $ruleObj->username = $userid;
            $ruleObj->expiry = $expiry;
            $ruleObj->data = $obj;
            $client->store()->byKeyField("id")->andStore($ruleObj);
            $this->sendRuleToQueue($ruleObj);
        }
        private function sendRuleToQueue($rules){
            $rateObj = new stdClass();
            $rateObj->body = new stdClass();
                $rateObj->body->rules = $rules;
                $rateObj->body->criteria = "rule";
            $rateObj->route = "rule";
            $this->sendToQueue("rule", $rateObj);
        }
        private function updateRulesInRedis(){
        }
    }
?>
