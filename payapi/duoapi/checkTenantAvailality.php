<?php

    require_once("/var/www/html/include/_config.php");

    if ( $_SERVER['REQUEST_METHOD'] == 'GET' ) {
        if(isset($_GET['tenantId'])){
            if(isset($_COOKIE['securityToken'])){
                $tenantId = $_GET['tenantId'];
                $tenantType = $_GET['tenantType'];
                $chUrl = "";
                
                if($tenantType == "dev")
                    $chUrl = $tenantId . ".dev." . $mainDomain;
                else
                    $chUrl = $tenantId . "." . $mainDomain;
                
                $securityToken = $_COOKIE['securityToken'];
                $request_headers = array(
                    'Content-Type: application/json',
                    'securityToken: ' . $securityToken
                );
                
                $ch = curl_init();

                $options=array(
                    CURLOPT_URL => "http://". $_SERVER['HTTP_HOST'] .":3048/tenant/GetTenant/" . $chUrl,
                    CURLOPT_RETURNTRANSFER => 1,
                    CURLOPT_HTTPHEADER => $request_headers
                );

                curl_setopt_array($ch, $options);
                $result = curl_exec($ch);
                echo $result;
                curl_close($ch);
            }else {
                echo '{"Error" : true, "Message" : "Security token is not set.Please signin first."}';
            }
        }else {
            echo '{"Error" : true, Message : "Tenant id is not set"}';
        }
    }

?>
