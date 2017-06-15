<!DOCTYPE html>
<?php

    if(!isset($_COOKIE["securityToken"])) {
        header("Location: http://". "app.12thDoor.com" ."/login.php?r=http://". $_SERVER['HTTP_HOST'] .'/s.php');
    }
?>
<html>
<head>
	<meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimal-ui" />
    <title>12thDoor | Boarding</title>
    <link rel="shortcut icon" href="dw-favicon.png" type="image/png">
	<link rel="stylesheet" href="/bower_components/angular-material/angular-material.min.css">
    <link rel="stylesheet" href="boardingProcess-styles.css"> 
</head>
<body id="platformentry-container" ng-app="platformBoardingModule" ng-controller="boarding-parent-ctrl" ng-cloak>
    <div id="commonEntryHeader">
        <img src="12thdoorLogo-Beta.png" width="114" height="34">
    </div>
	<div id="viewContainer" layout="column" layout-align="center center" ui-view md-theme="default" md-theme-watch="true"></div>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
	<script type="text/javascript" src="/bower_components/angular/angular.min.js"></script>
	<script type="text/javascript" src="/bower_components/angular-ui-router/release/angular-ui-router.min.js"></script>
    <script type="text/javascript" src="/bower_components/angular-aria/angular-aria.min.js"></script>
    <script type="text/javascript" src="/bower_components/angular-messages/angular-messages.min.js"></script>
    <script type="text/javascript" src="/bower_components/angular-animate/angular-animate.min.js"></script>	
    <script type="text/javascript" src="/bower_components/angular-material/angular-material.min.js"></script>
    <script type="text/javascript" src="/uimicrokernel/uimicrokernel.js"></script>
    <script type="text/javascript" src="cc_packageHandler.js"></script>
    <script type="text/javascript" src="customerBoarding.js"></script>
</body>
</html>

