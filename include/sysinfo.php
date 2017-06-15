<?php
require_once ($_SERVER["DOCUMENT_ROOT"]."/include/config.php");
$infoObj = new stdClass();
$infoObj->mainDomain = $mainDomain;
header ("Content-type: application/json");
echo json_encode($infoObj, JSON_PRETTY_PRINT);
?>