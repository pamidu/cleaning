<?php

    //require_once($_SERVER["DOCUMENT_ROOT"]."/payapi/duoapi/objectstoreproxy.php");


    class PermissionHandler {

        public static $GetCache;

        public function Get($email){
            if (isset(PermissionHandler::$GetCache))
                return PermissionHandler::$GetCache;
            else{
                $client = ObjectStoreClient::WithNamespace(DuoWorldCommon::GetHost(),"userapp_permission","123");
                $permObj = $client->get()->byKey($email);
                $finalObj = isset($permObj->permission) ? $permObj->permission : array();
                PermissionHandler::$GetCache = $finalObj;
                return  $finalObj;
            }
            
        }

        public function IsPermitted($module, $type){
            $isPermitted = false;

            $authData = $_COOKIE["authData"];
            $authObj = json_decode($authData);
            $email = $authObj->Username;
            $allPermissions = $this->Get($email);

            foreach ($allPermissions as $permission)
            if (strcmp($permission->appName, $module)==0){
                if (isset($permission->$type))
                $isPermitted = $permission->$type;
                break;
            }

            return $isPermitted;

        }

        public function Invite($roleObj, $saveRoles = true){
            $permObj = new stdClass();
            $permObj->email = $roleObj->email;
            $permObj->permission = $this->getFinalizedPermissions($roleObj->roles);
                        
            $this->updateCurrentPermissions($permObj);
            $this->saveRoleSnapshot($roleObj);

            if ($saveRoles)
                $this->saveAllRoles($roleObj);
        }

        public function UpdateAllRoles($modifiedRole){
            $roleId = $modifiedRole->id;

            $client = ObjectStoreClient::WithNamespace(DuoWorldCommon::GetHost(),"userapp_userroles","123");
            $affectedUsers = $client->get()->byFiltering("SELECT * FROM userapp_userroles WHERE roleid='$roleId'");

            foreach ($affectedUsers as $user){
                $roleObj = $this->getRoleSnapshot($user["email"]);

                foreach ($roleObj->roles as $role)
                if ($role->id == $modifiedRole->id){
                    $role->appPermission = $modifiedRole->appPermission;
                    break;
                }

                if (isset($roleObj))
                    $this->Invite($roleObj);
            }

        }

        private function getFinalizedPermissions($roles){
            return $roles[0]->appPermission;
        }

        private function updateCurrentPermissions($newRole){
			$client = ObjectStoreClient::WithNamespace(DuoWorldCommon::GetHost(),"userapp_permission","123");
			$outObject=$client->store()->byKeyField("email")->andStore($newRole);
            return $outObject;
        }

        private function saveAllRoles($permObj){
            $saveObjects = array();

            foreach ($permObj->roles as $role){
                $permCache = new stdClass();
                $permCache->email = $permObj->email;
                $permCache->role = $role->roleName;
                $permCache->roleid = $role->id;
                $permCache->id = $permObj->email . "_" . $role->id;
                array_push($saveObjects, $permCache);
            }
            $client = ObjectStoreClient::WithNamespace(DuoWorldCommon::GetHost(),"userapp_userroles","123");
			$outObject=$client->store()->byKeyField("id")->andStore($saveObjects);
        }

        public function GetPermission($email){
            $snapshot = $this->getRoleSnapshot($email);
            return $snapshot->roles[0];
        }

        private function saveRoleSnapshot($roleObj){
            $client = ObjectStoreClient::WithNamespace(DuoWorldCommon::GetHost(),"userapp_permissionsnapshot","123");
            $outObject=$client->store()->byKeyField("email")->andStore($roleObj);
            return $outObject;            
        }

        private function getRoleSnapshot($email){
            $client = ObjectStoreClient::WithNamespace(DuoWorldCommon::GetHost(),"userapp_permissionsnapshot","123");
            return $permObj = $client->get()->byKey($email);
        }
    }
?>