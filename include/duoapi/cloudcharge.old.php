<?php

/*

	CloudCharge Endpoint Library
		Version 1.0.2
	
	change-log [
		2016-8-23 - added token authentication for card.
		2016-8-23 - added method for get registered stripe customer information.
	]
*/


ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once($_SERVER['DOCUMENT_ROOT'] ."/dwcommon.php");
require_once($_SERVER['DOCUMENT_ROOT'] ."/include/config.php");

class AppStruct {
	public $uom;
	public $code;
	public $product_name;
	public $category;
	public $price_of_unit;
	public $status;
	public $type;
	public $subscriptionDetails;
}

class SubscriptionStruct {
	public $interval; // month, year
	public $currency;
}

class PaymentStuct {
	public $customer;
	public $token;
	public $amount;
	public $appkey;
	public $type;
}

class Customer {

	private $cClient;

	public function get() {
		$res = $this->cClient->getRequestInvoker()->get("/getStripeCustomer");
		return $this->getDefaultValue($res);
	}

	function __construct($cClient) {
		$this->cClient = $cClient;
	}

}

class App {

	private $cClient;

	public function create($appInfo) { 

		$app = new AppStruct();

		if(isset($appInfo->paymentMethod)) {
			$appInfo->paymentMethod = strtolower($appInfo->paymentMethod);
			switch ($appInfo->paymentMethod) {

				case 'onetime':

					$app->uom = "UNITS";
					$app->type = "onetime";
					$app->subscriptionDetails = array();
					break;

				case 'subscription':

					$app->type = "subscription";

					if(isset($appInfo->subscriptionInfo)) {
						$app->uom = $appInfo->subscriptionInfo->subscriptionPeriod;

						$subscription = new SubscriptionStruct();

						$subscription->interval = $appInfo->subscriptionInfo->subscriptionPeriod;	
						$subscription->currency = (isset($appInfo->subscriptionInfo->currency)) 
													? strtolower($appInfo->subscriptionInfo->currency) : "usd";

						$app->subscriptionDetails = array($subscription);
					}
					break;

			}
		}

		$app->code = $appInfo->appKey;
		$app->product_name = $appInfo->appName;
		$app->category = $appInfo->appCategory;
		$app->price_of_unit = $appInfo->unitPrice;
		$app->status = true;

		$res = $this->cClient->getRequestInvoker()->post("/registerPlan", $app);
		return $this->getDefaultValue($res);

	}

	private function getDefaultValue($res){
		$jsonObj =json_decode($res);
		if (!$jsonObj){
			$jsonObj = new stdClass();
			$jsonObj->status = false;
			$jsonObj->message = $res;
		}
		return $jsonObj;
	}

	public function purchase($appkey, $price, $token = "") { 

		$pay = new PaymentStuct();

		if(empty($token)) {
			$pay->customer = "exist";
			$pay->token = "";
		}else {
			$pay->customer = "new";
			$pay->token = $token;
		}

		$pay->appkey = $appkey;
		$pay->amount = $price;
		$pay->type = "onetime";

		$res = $this->cClient->getRequestInvoker()->post("/purchaseApp", $pay);
		return $this->getDefaultValue($res);

	}

	public function subscribe($appkey, $price, $token = "") { 

		$pay = new PaymentStuct();

		if(empty($token)) {
			$pay->customer = "exist";
			$pay->token = "";
		}else {
			$pay->customer = "new";
			$pay->token = $token;
		}

		$pay->appkey = $appkey;
		$pay->amount = $price;
		$pay->type = "subscription";

		$res = $this->cClient->getRequestInvoker()->post("/purchaseApp", $pay);
		return $this->getDefaultValue($res);

	}

	public function reinstall($appkey) {

		if($appKey === "") 
			return;

		$res = $this->cClient->getRequestInvoker()->post("/reinstall", json_decode('{"appKey":"'. $appkey .'"}')); 
		return $this->getDefaultValue($res);

	}

	public function uninstall($appkey) {

		if($appKey === "") 
			return;

		$res = $this->cClient->getRequestInvoker()->post("/uninstallApp", $pay);
		return $this->getDefaultValue($res);

	}

	function __construct($cClient) {
		$this->cClient = $cClient;
	}

}

class Plan {

	private $cClient;

	public function purchase() { echo __METHOD__; }

	public function upgrade() { echo __METHOD__; }

	function __construct($cClient) {
		$this->cClient = $cClient;
	}

}

class CloudCharge {

	private $invoker;

	public function customer() {
		return new Customer($this);
	}

	public function plan() {
		return new Plan($this);
	}

	public function app() {
		return new App($this);
	}

	public function getRequestInvoker() {
		if(property_exists($this, "invoker"))
			return $this->invoker;
	}

	function __construct($paygateway = "") {

		if($paygateway === "")
			if(defined("PAYMENT_GATWAY"))
				$paygateway = PAYMENT_GATWAY;

		$this->invoker = new WsInvoker("http://". $GLOBALS['mainDomain'] ."/services/duosoftware.paymentgateway.service/" . $paygateway);
		$this->invoker->addHeader("securityToken", $_COOKIE['securityToken']);
	}
}

/*

	(new CloudCharge())->customer()->get();

	(new CloudCharge())->plan()->purchase();
	(new CloudCharge())->plan()->upgrade();

	(new CloudCharge())->app()->create($app); // invoke during app publishing
	(new CloudCharge())->app()->purchase($appkey, $price [,$token]); // invoke during one time payment app purchase
	(new CloudCharge())->app()->subscribe($appkey, $price [,$token]); //invoke during app subscription
	(new CloudCharge())->app()->reinstall($appkey); //invoke during app reinstallation
	(new CloudCharge())->app()->uninstall($appkey); //invoke during app uninstallation


*/
?>