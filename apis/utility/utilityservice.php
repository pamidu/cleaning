<?php

require_once (ROOT_PATH ."/include/duoapi/objectstoreproxy.php");
require_once("utilityhandler.php");

class UtilityService {

    public function getCountryList() {
        try {
            (new UtilityHandler())->getCountryList();
        } catch(Exception $ex) {

        } 
    }

    public function getCurrencyList() {
        try {
            (new UtilityHandler())->getCurrencyList();
        } catch(Exception $ex) {

        }
    }

    public function getCurrency($countrycode) {
        try {
            (new UtilityHandler())->getCurrency($countrycode);
        } catch(Exception $ex) {

        }
    }

    function __construct() {
        Flight::route("GET /country/list", function() { $this->getCountryList(); });
        Flight::route("GET /currency/list", function() { $this->getCurrencyList(); });
        Flight::route("GET /currency/@countrycode", function($countrycode) { $this->getCurrency($countrycode); });
    }
}
