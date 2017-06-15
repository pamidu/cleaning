/*Duo World - pannel - controller [applicationsPanelCtrl] */

mambatiFrameworkShell.controller('applicationsPanelCtrl', ['$rootScope', '$state', '$scope', '$location', '$http', '$rootScope' , '$presence', '$auth', '$apps', '$helpers', function ($rootScope,$scope,$location,$http,$rootScope,$presence,$auth,$apps,$helpers) {

	// $scope.applicationPaneCollections = $rootScope.frameworkApplications;

	$scope.frameworkpannelApps = []; //to temporily store raw app information recived from the $apps service from uiMicrokernal

	$scope.frameworkpannelAppCollection = []; //to store formated app infomation for view consumption.

	$scope.showFeatureHolderStatus = true;

	$scope.showArrangementStatus = true;

	$scope.navigateToApp = function(){
		console.log('this is possible');
		$state.go('marketplace');
	};

	
	$scope.applicationPanelinit = function(){

		$apps.onAppsRetrieved(function(e,data){

			for(appIndex in data.apps){

				var retrivedAppsImg = data.apps[appIndex].ImageId;

				if(retrivedAppsImg){
					data.apps[appIndex].ImageId = retrivedAppsImg;
				}
				else{
					data.apps[appIndex].ImageId = "/defaultApp.png";
				} 
			}

			$scope.frameworkpannelApps = data.apps;

			$scope.retrivedAppPanelsFormatedDataPush();
		});

		$apps.getAppsForUser();

		console.log($scope.frameworkpannelAppCollection);
	};

	$scope.retrivedAppPanelsFormatedDataPush = function(){
		for (var i = 0; i < $scope.frameworkpannelApps.length; i++){
			var appTempRef = $scope.frameworkpannelApps[i];
			$scope.frameworkpannelAppCollection.push({applicationID: appTempRef.ApplicationID, applicationTitle: appTempRef.Name, applicationCategory: appTempRef.Description, applicationUri: "/duoworld-framework/launcher/customapps/"+appTempRef.ApplicationID+"/"+appTempRef.Name, applicationIcoUri: "./images/appIcons/"+appTempRef.ImageId});
		}
	};

	$scope.arrangeApplications = function(){
		$scope.showArrangementStatus = !$scope.showArrangementStatus;
	};

	$scope.changePanelFeatureMenuView = function(){
		$scope.showFeatureHolderStatus = !$scope.showFeatureHolderStatus;
		$scope.appSearchQuery = "";
	}; 


	$scope.applicationPanelChildAppAccess = function(selectedApplicationUri){
		$location.path(selectedApplicationUri);
	};

	console.log('This is comming from application panel');

}]);