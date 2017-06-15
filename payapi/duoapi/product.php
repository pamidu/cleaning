<?php
	class productclass{
		public $productId;
		public $productcode;
		public $other;
		public $imageId;
		public $taxId;
		public $unitPrice;
		public $productCategory;
		public $productType;
		public $reorderLevel;
		public $productGroup;
		public $productArry;
		public $measurement;
		public $active;

		function __construct(){
			$this->productArry = array();
		}
	}

	class getproduct{
		public $productId;
	}

	
	class Product{
		
		
		public function testproduct()
		{
			# code...
			echo " test";
		}

		public function getbyProductId($key){
			$client=ObjectStoreClient::WithNamespace(DuoWorldCommon::GetHost(),"Products","123");
			$respond=$client->get()->byKey($key);
			return $respond;

					
		}
		public function deleteProduct()
		{
			# code...
			$pid=new getproduct();
			$post=json_decode(Flight::request()->getBody());
			DuoWorldCommon::mapToObject($post,$pid);
			$producttodelete=$this->getbyProductId($pid->productId);
			$producttodelete->active=false;
			$client=ObjectStoreClient::WithNamespace(DuoWorldCommon::GetHost(),"Products","123");
			$respond=$client->store()->byKeyField("productId")->andStore($producttodelete);
			echo json_encode($respond);
		}
		public function addproducts()
		{
			# code...

			$pro=new productclass();
			$json=json_decode(Flight::request()->getBody());
			$client = ObjectStoreClient::WithNamespace(DuoWorldCommon::GetHost(),"Products","123");
			if(empty($json->productArry)){
				array_push($pro->productArry, []);
				$tempproducts=$pro->productArry;
				DuoWorldCommon::mapToObject($json,$pro);
				$pro->productArry=$tempproducts;
				$respond=$client->store()->byKeyField("productId")->andStore($pro);
				echo json_encode($respond);

			}else{
				echo json_encode("not empty");
				foreach ($json->productArry as $product) {
					echo json_encode($product);
					$refproduct=$this->getbyProductId($product);
					unset($refproduct->__osHeaders);
		 			array_push($pro->productArry, $refproduct);

				}
				
				$tempproducts=$pro->productArry;
				DuoWorldCommon::mapToObject($json,$pro);
				$pro->productArry=$tempproducts;
				$respond=$client->store()->byKeyField("productId")->andStore($pro);
				echo json_encode($respond);


			}
		}
		public function getProducts()
		{
			# code...
			$pid=new getproduct();
			$post=json_decode(Flight::request()->getBody());
			DuoWorldCommon::mapToObject($post,$pid);
			$client=ObjectStoreClient::WithNamespace(DuoWorldCommon::GetHost(),"Products","123");
			$respond=$client->get()->byKey($post->productId);
			echo json_encode($respond);
		}


	
	function __construct(){
			
			Flight::route("GET /testproducts", function(){$this->testproduct();});
			Flight::route("POST /addproducts", function(){$this->addproducts();});
			Flight::route("POST /getproduct",function(){$this->getProducts();});
			Flight::route("POST /deleteproduct",function(){$this->deleteProduct();});
		}	
	}
	
?>









