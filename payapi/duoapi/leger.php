<?php
	class ledgerFeilds{
		
		public $InvoiceNumber;
		public $Date;
		public $TransactionType;
		public $Description;
		public $OtherData;
		public $Amount;
		public $Balance;
		public $TennentId;
			
	}
	class TennentID{
		public $TennentId;
	}
	class InvoiceNumber{
		public $InvoiceNumber;
	}
	class MakePayment{
		public $InvoiceNumber;
		public $Date;
		public $TransactionType;
		public $Description;
		public $OtherData;
		public $Amount;
		public $Balance;
		public $TennentId;
		//refference transaction id 
		public $referrence;
		
	}
	
	class Ledger{
		
		//genarate unique InvoiceNumber
		public function getInvoiceNumber(){
			return uniqid();
		}
		//new ledger Entry from Endpoint 
		public function createLedgerEntry()
		{
			
			$ledger=new ledgerFeilds();
			$json=json_decode(Flight::request()->getBody());
			DuoWorldCommon::mapToObject($json,$ledger);
			$client = ObjectStoreClient::WithNamespace(DuoWorldCommon::GetHost(),"Ledger","123");
			$respond=$client->store()->byKeyField("$product->productArry")->andStore($ledger);
			echo json_encode($respond);
		}
		
		public function transactionForTennent(){
			$tennid=new TennentID();
			$post=json_decode(Flight::request()->getBody());
			DuoWorldCommon::mapToObject($post,$tennid);
			$client=ObjectStoreClient::WithNamespace(DuoWorldCommon::GetHost(),"Ledger","123");
			$respond=$client->get()->byFiltering ($tennid->TennentId);
			echo json_encode($respond);

		}
		
		public function TransactionDetails()
		{
			$tkey=new InvoiceNumber();
			$post=json_decode(Flight::request()->getBody());
			DuoWorldCommon::mapToObject($post,$tkey);
		
			$client=ObjectStoreClient::WithNamespace(DuoWorldCommon::GetHost(),"Ledger","123");
			$respond=$client->get()->byKey($tkey->InvoiceNumber);
			echo json_encode($respond);
			
		}
		
		//make payment
		public function Payment()
		{
			$makepay=new MakePayment();
			$post=json_decode(Flight::request()->getBody());
			DuoWorldCommon::mapToObject($post,$makepay);
			
			if(($makepay->referrence) != ''){
				if(is_array($makepay->referrence)){
				// multiple payments
				//[{"id":"55e6e5e031700","amount":500},{"id":"55e6e5e031700","amount":30}]
					foreach (($makepay->referrence) as $refid) {
					 	$refTransac=$this->getbyInvoiceNumber($refid->id);
					 	$newRecord=new ledgerFeilds();
					 	$newRecord->InvoiceNumber=$makepay->InvoiceNumber;
					 	$newRecord->Date=$makepay->Date;
		 			 	$newRecord->TransactionType=$makepay->TransactionType;
		 				$newRecord->Description=$makepay->Description;
		 				$newRecord->OtherData=$makepay->OtherData;
		 			 	$newRecord->Amount=$refid->amount;
		 			 	$newRecord->Balance=$makepay->Balance;
		 			 	$newRecord->TennentId=$makepay->TennentId;
					 	echo json_encode($this->addRecord($newRecord));
					 	$refTransac->Balance=($refTransac->Balance)-($refid->amount);
					 	echo json_encode($this->addRecord($refTransac));
					}
					
				}
				else{
				//single payment
					$refTransac=$this->getbyInvoiceNumber($makepay->referrence);
					//$makepay->InvoiceNumber=$this->getInvoiceNumber();
					echo json_encode($this->addRecord($makepay));
					echo json_encode($refTransac->Balance);
					$refTransac->Balance=($refTransac->Balance)-($makepay->Amount);
					echo json_encode($refTransac->Balance);
					echo json_encode($this->addRecord($refTransac));
				
				}
			}
			else{
			//payment without refference (Advanced Payment)
				echo json_encode("Advanced Payment Not Allowed");
			}
			
		}
		public function getbyInvoiceNumber($key){
			$client=ObjectStoreClient::WithNamespace(DuoWorldCommon::GetHost(),"Ledger","123");
			$respond=$client->get()->byKey($key);
			return $respond;
					
		}
		public function addRecord($obj){
			$client = ObjectStoreClient::WithNamespace(DuoWorldCommon::GetHost(),"Ledger","123");
			$respond=$client->store()->byKeyField("InvoiceNumber")->andStore($obj);
			return ($respond);	
		}
		
		function __construct(){
			
			Flight::route("GET /getInvoiceNumber", function(){$this->getInvoiceNumber();});
			Flight::route("POST /createLedgerEntry", function(){$this->createLedgerEntry();});
			Flight::route("POST /transactionForTennent", function(){$this->transactionForTennent();});
			Flight::route("POST /transactionDetails", function(){$this->TransactionDetails();});
			Flight::route("POST /payment ", function(){$this->Payment();});
		}
	}
	
?>