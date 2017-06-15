<?php
require_once ("include/config.php");
require_once ("include/session.php");
$fullHost = strtolower($_SERVER['HTTP_HOST']);

switch ($fullHost) {
		/*
    	 case "duoworld.duoweb.info":
        	include ("u.php");
            break;*/
            case "saffron.12soul.com":
		//echo "For Saffron Tecnical Test only :/  saffron_tmp.php";
            include ("saffron_tmp.php");
            break;
            case $mainDomain:
            if(!isset($_COOKIE["securityToken"])){
              //include ("index1.php");
 		header("Location: ".SITE_PROTOCOL.$mainDomain."/12thDoorEntry");
          }else{
            getURI();

        }
        break;
        case "www.".$mainDomain:
        if(!isset($_COOKIE["securityToken"])){
          include ("index1.php");
      }else{
        getURI();

    }
    break;
    default:
    if(!isset($_COOKIE["securityToken"])){
        if($mainDomain!=$_SERVER['HTTP_HOST'])
        {
            header("Location: ".SITE_PROTOCOL.$mainDomain."/login.php?r=http://".$_SERVER['HTTP_HOST'].'/s.php');
        }
        else
        {
            header("Location: ".SITE_PROTOCOL.$mainDomain."/login.php?r=http://".$_SERVER['HTTP_HOST'].'/s.php');
        }
                //echo "string";
        exit();
    }
    getURI();
    break;
}

?>


