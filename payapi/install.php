<?php
  require_once($_SERVER['DOCUMENT_ROOT'] . "/include/config.php");
  define ("BASE_PATH", ROOT_PATH . "/payapi");
  
  header("Content-type: text/html");
	if ($_SERVER['REQUEST_METHOD'] == "GET"){
		if (isset($_GET["appCode"]))
		{
			require ("./bulktransfer.php");

			$appCode = $_GET["appCode"];
			echo $appCode;
			echo "install method ";
			$obj = new BulkHeader();
      
      if (isset($_GET["mp"])){
        $obj->dest = "duoworld.duoweb.info";
			  $obj->src = (strpos($_SERVER['HTTP_HOST'], "localhost") !== false) ? "localhost" : $_SERVER['HTTP_HOST'];
      }
			else{
        $obj->src = "duoworld.duoweb.info";
			  $obj->dest = (strpos($_SERVER['HTTP_HOST'], "localhost") !== false) ? "localhost" : $_SERVER['HTTP_HOST'];
			}
      
			$obj->addDetailId("application", $appCode, "ApplicationID");
			$obj->addDetailId("appdescriptor", $appCode, "appKey");
			$obj->addDetailFilter("appresources", "appCode: " . $appCode, "id");
			$transferObject = new BulkTransfer();
			$transferObject->Transfer($obj);

		} else {
			echo "Application Code not Defined";
		}
	} else {
		
	}
?>
