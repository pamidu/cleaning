<?php 

	class AccountAuthenticationRequest {
		public $SecurityToken;
		public $SessionID;
		public $Unique;
		public $TimeStamp;
		public $TransactionID;
		public $CBankID;
		public $CAccountID;
		public $ExpiryDate;
		public $CVS;
		public $VerificationCode;
		public $Tags;
	}

	class AccountAuthenticationResponse {
		public $TimeStamp;
		public $TransactionID;
		public $SecretTransactionKey;
		public $ReplyID;
		public $StatusCode;
		public $StatusDescription;
		public $Tags;
		public $ReturnURL;
	}

	class TransactionAcknowledgementRequest {
		public $SecurityToken;
		public $SessionID;
		public $BankID;
		public $TransactionID;
		public $SecretTransactionKey;
		public $StatusCode;
		public $MerchantReferenceID;
		public $MerchantDocumentID;
		public $MerchantDocumentURL;
		public $Tags;

	}

	class TransactionAcknowledgementResponse {
		public $TimeStamp;
		public $TransactionID;
		public $ReplyID;
		public $StatusCode;
	}


	class CheckTransactionStatusRequest {
		public $SecurityToken;
		public $SessionID;
		public $TimeStamp;
		public $SecretTransactionKey;
		public $TransactionID;
		public $BanksTransactionRefID;
		public $SessionRequestType;
		public $StatusCode;
		public $StatusDescription;
		public $Tags;
	}

	class CheckTransactionStatusResponse {
		public $TimeStamp;
		public $TransactionID;
		public $ReplyID;
		public $StatusCode;
		public $StatusDescription;
		public $Tags;
	}

	class TransactionRequestRequest { 
		public $SecurityToken;
		public $SessionID;	
		public $TimeStamp;
		public $TransactionID;
		public $TrasactionIDOriginator;
		public $PPLK;
		public $SecretTransactionKey;
		public $PaymentMerchantName;
		public $PaymentMerchantBankID;
		public $PaymentMerchantAccountID;
		public $TransactionCurrency;
		public $TransactionAmount;
		public $TransactionType;
		public $TransactionDescription;
		public $Tags;
	}

	class TransactionRequestResponse {
		public $TimeStamp;
		public $TransactionID;
		public $SecretTransactionKey;
		public $ReplyID;
		public $StatusCode;
		public $StatusDescription;
		public $Tags;
		public $RedirectURL;
	}

	class BankProxy {

		private $invoker;

		public function AccountAuthentication($r){
			$json = $this->invoker->post("/Bank/AccountAuthentication", $r);
			return $this->invoker->map($json, new AccountAuthenticationResponse());
		}

		public function TransactionAcknowledgement($r){
			$json = $this->invoker->post("/Bank/TransactionAcknowledgement", $r);
			return $this->invoker->map($json, new TransactionAcknowledgementResponse());
		}

		public function CheckTransactionStatus($r){
			$json = $this->invoker->post("/Bank/CheckTransactionStatus", $r);
			return $this->invoker->map($json, new CheckTransactionStatusResponse());
		}

		public function TransactionRequest($r){
			$json = $this->invoker->post("/Bank/TransactionRequest", $r);
			return $this->invoker->map($json, new TransactionRequestResponse());
		}

		function __construct(){
			$this->invoker = new WsInvoker(SVC_BANK_URL);
		}
	}
?>