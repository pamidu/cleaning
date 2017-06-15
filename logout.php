<?php
        session_start();
        require_once ("include/config.php");
        require_once ("include/session.php");
        
        if($_SERVER['HTTP_HOST']!=$mainDomain){
                 header("Location: http://".$mainDomain."/logout.php");
                 exit();
        }
                 
        if(isset($_COOKIE['securityToken'])){
                $ch=curl_init();
                curl_setopt($ch, CURLOPT_HTTPHEADER, array(
                                        'SecurityToken :'.$_COOKIE['securityToken'],
                                        'X-Apple-Store-Front: 143444,12'
            ));
                curl_setopt($ch, CURLOPT_URL, $GLOBALS['authURI'].'/LogOut/'.$_COOKIE['securityToken']);
                echo $GLOBALS['authURI'].'/LogOut/'.$_COOKIE['securityToken'];
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
                $data = curl_exec($ch);
                echo $data;
                setcookie ("securityToken", null, time() - 14600);
                setcookie ("authData", null, time() - 14600);
                setcookie ("securityToken", null, time() - 14600,"/",$_SERVER['HTTP_HOST']);
                setcookie ("authData", null, time() - 14600,"/",$_SERVER['HTTP_HOST']);
                unset($_COOKIE["securityToken"]);
                unset($_COOKIE["authData"]);
                unset($_SESSION);
                header("Location: /");
        }else{
                header("Location: /");
        }
                        
?>
