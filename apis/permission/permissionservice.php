<?php
require_once ("permissionhandler.php");

class PermissionService {

    private function test(){
        echo "Permission Service is Working!!! v1.0.1";
    }

    private function inviteUser(){
        $handler = new PermissionHandler();
        $postBody=json_decode(Flight::request()->getBody());
        $handler->Invite($postBody);
        echo ('{"isSuccess":true, "message":"Successfully Sent Invitation"}');
    }

    private function updatePermission(){
        $handler = new PermissionHandler();
        
        $postBody=json_decode(Flight::request()->getBody());
        $handler->UpdateAllRoles($postBody);
        echo ('{"isSuccess":true, "message":"Successfully Updated Permission"}');
    }

    private function getPermission($email){
        $handler = new PermissionHandler();
        $permissions  = $handler->Get($email);
        
        echo json_encode($permissions);
    }

    private function getRole($email){
        $handler = new PermissionHandler();
        $permissions  = $handler->GetPermission($email);
        
        echo json_encode($permissions);
    }

    private function checkPermission($module,$function){
        $handler = new PermissionHandler();
        $permissions  = $handler->IsPermitted($module,$function);
        
        echo json_encode($permissions);   
    }
    private function getactiveapplist($email){
        $handler = new PermissionHandler();
        $permissions  = $handler->Get($email);
    	$apps=array();
	foreach ($permissions as $data) {
		if($data->view){
			array_push($apps,$data->appName);
		}
	}
#    var_dump($permissions);
	echo json_encode($apps);
    }

    function __construct(){       
        Flight::route("GET /test",function(){$this->test();});
        Flight::route("GET /ispermitted/@module/@function",function($module,$function){$this->checkPermission($module,$function);});
        Flight::route("POST /update",function(){$this->updatePermission();});
        Flight::route("POST /invite",function(){$this->inviteUser();});
        Flight::route("GET /get/@email",function($email){$this->getPermission($email);});
        Flight::route("GET /getactiveapplist/@email",function($email){$this->getactiveapplist($email);});
	Flight::route("GET /getrole/@email",function($email){$this->getRole($email);});
    }
}

?>
