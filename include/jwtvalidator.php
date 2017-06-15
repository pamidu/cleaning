<?php

class JWTValidator {

    private $allHeaders;

    public function ValidateFunction($class){
        
    }

    public function ValidateData ($class, $type=null, $jwt=null){
        if (!isset($type))
            $type = $this->getDataValidationType();

        return $this->Validate("data", $class, $type, $jwt);
    }

    public function getDataValidationType (){
        switch ($_SERVER['REQUEST_METHOD']) {
            case 'PUT':
                return "w";
            case 'POST':
                return "w";
            case 'GET':
                return "r";
            case 'DELETE':
                return "d";
        }
    }

    public function Validate($scope, $class, $type, $jwt = null){

        $arrayMode = is_array($type);
        $outObj;

        if (!isset($jwt))
            $jwt = $this->getJwtFromHeaders();

        if (isset($jwt)){
            $splitData = explode(".", $jwt);

            if (sizeof($splitData) == 3){
                $header = base64_decode($splitData[0]);
                $body = json_decode(base64_decode($splitData[1]));
                $tail = base64_decode($splitData[2]);
                
                if (is_object($body))
                if (isset ($body->scope))
                if (isset ($body->scope->$scope))                
                if (isset ($body->scope->$scope->$class))
                if (isset($body->scope->$scope->$class->allow))
                {
                    $allow = $body->scope->$scope->$class->allow;

                    $arrayMode = is_array($type);

                    if ($arrayMode)
                        $outObj = new stdClass();

                    for ($i=0; $i < strlen($allow); $i++) { 
                        if ($arrayMode){

                            foreach ($type as $ti) 
                            if ($allow[$i] === $ti){
                                $outObj->{$allow[$i]} = true;
                                break;
                            }
                            
                        }else{
                            if ($allow[$i] === $type){
                                return true;
                            }   
                        }
                    }

                }
            }
        }

        if ($arrayMode){
            if (!isset($outObj)) $outObj = new stdClass();
            return $outObj;
        }
        else
            return false;
    }

    private function getScope(){

    }

    private function getJwtFromHeaders (){
        if (!isset($this->allHeaders))
            $this->allHeaders = getallheaders();
        return $this->allHeaders["jwt"];
    }

    public function HasJwt(){
        if (!isset($this->allHeaders))
            $this->allHeaders = getallheaders();
        
        return isset($this->allHeaders["jwt"]);
    }

    function __construct() {
    }


}


?>