<?php
	function ObjGet($url, $headers){
		
		// $headerArray = array(                                                                          
		// 		    'Content-Type: application/json',                                                                                
		// 		    'Content-Length: ' . strlen($data_string));

		$headerArray = array(                                                                          
				    'Content-Type: application/json');

		if(!empty($headers)){
			$headerArray=array_merge($headers, $headerArray);
		}

		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, $url);
		curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		curl_setopt($ch, CURLOPT_HEADER, false);          
		curl_setopt($ch, CURLOPT_HTTPHEADER, $headerArray); 
		$data = curl_exec($ch);
		curl_close($ch);
		return $data;
	}

	function ObjPost($url, $data, $headers){                                                                
		$data_string = json_encode($data);

		$headerArray = array(                                                                          
				    'Content-Type: application/json',                                                                                
				    'Content-Length: ' . strlen($data_string));

		if(!empty($headers)){
			$headerArray=array_merge($headers, $headerArray);
		}
				        	                                                                                                             
		$ch = curl_init($url);                                                                      
		curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");                                                                     
		curl_setopt($ch, CURLOPT_POSTFIELDS, $data_string);                                                                  
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);                                                                      
		curl_setopt($ch, CURLOPT_HTTPHEADER, $headerArray);                                                                                                                                                                                                                                        
		$result = curl_exec($ch);
		curl_close($ch);
		return $result;
	}


?>