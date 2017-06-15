<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

class UtilityHandler {

	public function getCountryList() {
		$queryparams = Flight::request()->query;
		$skip = (isset($queryparams['skip'])) ? $queryparams['skip'] : "0";
		$take = (isset($queryparams['take'])) ? $queryparams['take'] : "1000";

		$client = ObjectStoreClient::WithNamespace("com.duosoftware.geo", "country", "123");
		$client->get()->skip($skip); 
		$client->get()->take($take);

		$countries = $client->get()->all();

		if(!isset($countries["IsSuccess"])) {
			usort($countries, array(__CLASS__, 'sortByCountryName'));
		    echo '{"success": true, "message": "", "data": '. json_encode($countries) .'}';
		}

		exit();
	}

	public function getCurrency($countrycode) {
		$client = ObjectStoreClient::WithNamespace("com.duosoftware.geo", "currency", "123");
		$currency_codes = $client->get()->byFiltering("SELECT * FROM currency WHERE country_code ='". $countrycode ."'");
		if(!isset($currency_codes["IsSuccess"]))
			echo '{"success": true, "message": "", "data": '. json_encode($currency_codes[0]) .'}';

		exit();
	}

	public function getCurrencyList() {
		$queryparams = Flight::request()->query;
		$skip = (isset($queryparams['skip'])) ? $queryparams['skip'] : "0";
		$take = (isset($queryparams['take'])) ? $queryparams['take'] : "1000";

		$client = ObjectStoreClient::WithNamespace("com.duosoftware.geo", "currency", "123");
		$client->get()->skip($skip); 
		$client->get()->take($take);

		$currency_list = $client->get()->all();
		$outarr = array();
		if(!isset($currency_list["IsSuccess"])) {
			foreach ($currency_list as $currency) {
				array_push($outarr, $currency['currency_code']);
			}
			echo '{"success": true, "message": "", "data": '. json_encode($outarr) .'}';
		}
	}

	public function sortByCountryName($a, $b) {
    	return strcmp($a['country_name'], $b['country_name']);
	}

	function __construct() {

	}
}
