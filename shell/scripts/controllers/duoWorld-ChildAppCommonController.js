(function(){

	var duoWorldChildAppCommonCtrl = function($scope, $routeParams, $location, $http, $rootScope , $presence, $auth, $apps, $helpers){
		
		$scope.routedAppId = $routeParams.childAppID;
		$scope.routedAppName = $routeParams.childAppName;

		console.log($scope.routedAppId, $scope.routedAppName);		

		var renderElement = "idRenderDiv";
		
		$("#" + renderElement).empty();

		$scope.close = function(){
			$scope.runningApp.instance.close();
		}

		$apps.onAppOpened(function(e,data){
			$scope.runningApp = data;
		});

		$apps.onAppClosed(function(e,data){
			if (!data.instance.isChild()){
				$window.history.back();
			}
			
		});

		$apps.execute($scope, renderElement, $scope.routedAppId, function (message){
			alert (message);
		});
	};

	duoWorldChildAppCommonCtrl.$inject = ['$scope', '$routeParams', '$location', '$http', '$rootScope' , '$presence', '$auth', '$apps', '$helpers'];

	mambatiFrameworkShell.controller('duoWorld-ChildApp-Common-Ctrl', duoWorldChildAppCommonCtrl);
}());