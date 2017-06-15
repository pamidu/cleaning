<?php

	class PreRegisterVerificationRequest {
		public $SecurityToken;
		public $SessionID;
		public $TimeStamp;
		public $TransactionID;
		public $SecretTransactionKey;
		public $VerificationCode;
		public $Tags;
	}

	class PreRegisterVerificationResponse {
		public $SecurityToken;
		public $SessionID;
		public $TimeStamp;
		public $TransactionID;
		public $SecretTransactionKey;
		public $VerificationCode;
		public $Tags;
	}

	class LAccountAuthenticationRequest {
		public $SecurityToken;
		public $SessionID;
		public $TimeStamp;
		public $TransactionID;
		public $SecretTransactionKey;
		public $SessionRequestType;
		public $StatusCode;
		public $VerificationCode;
		public $Tags;
	}

	class LAccountAuthenticationResponse {
		public $TransactionID;
		public $SecretTransactionKey;
		public $ReplyID;
		public $StatusCode;
		public $StatusDescription;
		public $Tags;
		public $ReturnURL;
	}

	class LCheckTransactionStatusRequest {
		public $SecurityToken;
		public $SessionID;
		public $TimeStamp;
		public $SecretTransactionKey;
		public $TransactionID;
		public $SessionRequestType;
		public $StatusCode;
		public $StatusDescription;
		public $Tags;
	}

	class LCheckTransactionStatusResponse {
		public $TimeStamp;
		public $TransactionID;
		public $ReplyID;
		public $StatusCode;
		public $StatusDescription;
		public $Tags;
	}

	class TransactionBankRequest {
		public $SecurityToken;
		public $SessionID;
		public $TimeStamp;
		public $MessageRouteID;
		public $TransactionID;
		public $TrasactionIDOriginator;
		public $SecretTransactionKey;
		public $PaymentMerchantName;
		public $PaymentMerchantBankID;
		public $PaymentMerchantAccountID;
		public $TransactionCurrency;
		public $TransactionAmount;
		public $CallType;
		public $PPLKAccountID;
	}

	class TransactionBankResponse {
		public $TimeStamp;
		public $TransactionID;
		public $SecretTransactionKey;
		public $ReplyID;
		public $StatusCode;
		public $StatusDescription;
		public $Tags;
		public $RedirectURL;
	}

	class LgpsProxy {

		private $invoker;

		public function PreRegisterVerification ($r) {
			$json = $this->invoker->post("/LGPS/PreRegisterVerification", $r);
			return $this->invoker->map($json, new PreRegisterVerificationResponse());
		}

		public function AccountAuthentication ($r){
			$json = $this->invoker->post("/LGPS/AccountAuthentication", $r);
			return $this->invoker->map($json, new LAccountAuthenticationResponse());
		}

		public function CheckTransactionStatus ($r){
			$json = $this->invoker->post("/LGPS/CheckTransactionStatus", $r);
			return $this->invoker->map($json, new CheckTransactionStatusResponse());
		}

		public function TransactionBank($r){
			$json = $this->invoker->post("/LGPS/TransactionBank", $r);
			return $this->invoker->map($json, new TransactionBankResponse());
		}

		function __construct(){
			$this->invoker = new WsInvoker(SVC_BANK_URL);
		}
	}


?>