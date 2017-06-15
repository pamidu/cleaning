<?php

	if ($_SERVER['REQUEST_METHOD'] == "GET"){
		if (isset($_GET["appCode"]))
		{
			require ("bulktransfer.php");

			$appCode = $_GET["appCode"];
			echo $appCode;
			echo "install method ";
			$obj = new BulkHeader();
			$obj->src = "duoworld.duoweb.info";
			$obj->dest = (strpos($_SERVER['HTTP_HOST'], "localhost") !== false) ? "localhost" : $_SERVER['HTTP_HOST'];
			
			$obj->addDetailId("application", $appCode, "ApplicationID");
			$obj->addDetailId("appdescriptor", $appCode, "applicationKey");
			$obj->addDetailFilter("appresources", "appCode: " . $appCode, "id");
			$transferObject = new BulkTransfer();
			$transferObject->Transfer($obj);

		} else {
			echo "Application Code not Defined";
		}
	} else {
		
	}
?>