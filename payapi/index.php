<?php

require_once($_SERVER['DOCUMENT_ROOT'] . "/include/config.php");
define("BASE_PATH", ROOT_PATH. "/payapi");

require_once(ROOT_PATH . "/dwcommon.php");
require_once ("common.php");

require_once BASE_PATH . '/flight/Flight.php';

require_once ("./services/accountservice.php");
require_once ("./services/bankservice.php");
require_once ("./services/payservice.php");
require_once ("./services/regservice.php");
require_once ("./services/testservice.php");
require_once ("./services/leger.php");
require_once ("./services/product.php");
require_once ("./services/cloudtransactions.php");
require_once ("./services/intouchContact.php");
require_once ("./services/revenue.php");


function getGUID(){
    if (function_exists('com_create_guid')){
        return com_create_guid();
    }else {
            mt_srand((double)microtime()*10000);//optional for php 4.2.0 and up.
            $charid = strtoupper(md5(uniqid(rand(), true)));
            $hyphen = chr(45);// "-"
            $uuid = chr(123)// "{"
            .substr($charid, 0, 8).$hyphen
            .substr($charid, 8, 4).$hyphen
            .substr($charid,12, 4).$hyphen
            .substr($charid,16, 4).$hyphen
            .substr($charid,20,12)
                .chr(125);// "}"
            //echo 
                return md5($uuid);
            }
        }

        new AccountService();
        new BankService();
        new PayService();
        new RegistrationService();
        new TestService();
        new Ledger();
        new Product();
        new TransactionService();
        new intouchContact();
        new revenue();

        Flight::start();
        
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST');  

        ?>
