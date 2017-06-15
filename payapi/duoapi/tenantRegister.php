<?php
    
    require_once($_SERVER["DOCUMENT_ROOT"] . "/include/config.php");
    require_once (ROOT_PATH .  "/payapi/duoapi/appinstaller.php");

    $baseURL = "http://" . $_SERVER['HTTP_HOST'] . ":3048/tenant/CreateTenant";

    if ( $_SERVER['REQUEST_METHOD'] == 'POST' ){
        $postdata  = file_get_contents('php://input');
            if( !empty($postdata) ){
                if (isset($_COOKIE['securityToken'])){
                    $tData = json_decode($postdata);
                    $ftData = formatTenantObject($tData);
                    $securityToken=$_COOKIE['securityToken'];
                    $request_headers =array(
                        'Content-Type: application/json',
                        'securityToken:' . $securityToken
                    );
                    
                    $ch = curl_init();

                    $options=array(
                        CURLOPT_URL => $baseURL,
                        CURLOPT_RETURNTRANSFER => 1,
                        CURLOPT_HTTPHEADER => $request_headers,
                        CURLOPT_POSTFIELDS => json_encode($ftData)
                    );
                    curl_setopt_array($ch, $options);
                    $result = curl_exec($ch);
                    InstallApps($ftData);
                    echo json_encode($result);
                    curl_close($ch);

                }else{
                    // security token is not set
                }

            }else{
                // post data is empty
            }
    }else {
            echo 'ERROR';
    }
    
    function formatTenantObject($tData) {
        global $mainDomain;
        switch($tData->Type){
            case "dev":
                $tData->TenantID = $tData->TenantID . ".dev." . $mainDomain;
                break;
            case "com":
                $tData->TenantID .= $tData->TenantID . "." . $mainDomain;
                break;
        }
        unset($tData->Type);
        return $tData;
    }

    function InstallApps($tenantData) { 
        $tenantName = $tenantData->TenantID;
        if(strpos($tenantName, '.dev.') !== false){
            $type = "dev";
        }
        $installer = new AppInstaller();
        $devApps = array("APP_SHELL_MY_ACCOUNT","APP_SHELL_SETTINGS","APP_SHELL_DEVSTUDIO","APP_SHELL_MARKETPLACE");
        $comApps = array("APP_SHELL_MY_ACCOUNT","APP_SHELL_SETTINGS", "APP_TRANSACTION","APP_TRANSACTION_DETAILS","APP_COMPANY_ATTRIBUTES","APP_SHELL_MARKETPLACE");
        $custApps = array("APP_SHELL_MY_ACCOUNT","APP_SHELL_MY_TENANTS","APP_SHELL_SETTINGS","APP_SHELL_MARKETPLACE");

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
            $installer->Install($app, $tenantName);
        
    }

?>
