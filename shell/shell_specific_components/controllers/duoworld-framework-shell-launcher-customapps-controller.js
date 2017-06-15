//duoworld-framework-shell-launcher-customapps-controller.js

(function(){

	var duoworldFrameworkShellLauncherCustomappsCtrl = function($scope, $state, $stateParams, $rootScope, $presence, $auth, $apps, $helpers, $timeout){

		$scope.defaultClassView = true;
		$scope.routedAppId = $stateParams.childAppID;
		$scope.routedAppName = $stateParams.childAppName;
		$scope.routedAppIconUri = $rootScope.opendAppIconUrl;

			var renderElement = "idRenderDiv";
			
			$("#" + renderElement).empty();

			var dwChildAppHeaderController = angular.element('#dw-child-application-header-control-bar');
			var dwChildAppSplashCover = angular.element('.dw-childapp-backgroundcover');
			var dwChildAppContainer = angular.element('.customeAppContainer');
			var dwChildAppSplashLogo = angular.element('.dw-childapp-splash-logo');
			var dwChildAppSplashText = angular.element('.dw-childapp-splash-title');
			var dwChildAppSplashLoadingSpinner = angular.element('.dw-childapp-splash-loadingspinner');
			var dwChildAppSplashLoadingTextIndicator = angular.element('.dw-childapp-splash-loadingtextindicator');
			var dwChildAppHeaderInfomationTitle = angular.element('.dw-child-application-header-control-bar-left-section span');
			var dwChildAppHeaderInfomationIcon = angular.element('.dw-child-application-header-control-bar-left-section img');			

			$timeout(function(){
				dwChildAppHeaderController.css({'top':'0px','background':'rgba(0,0,0,0.1)'});
			},1000);

			$timeout(function(){
				dwChildAppSplashLogo.css('bottom','0px');
			},1300);

			$timeout(function(){
				dwChildAppSplashText.css('top','0px');
			},1500);

			$timeout(function(){
				dwChildAppSplashLoadingSpinner.css('top','0px');
			},1700);

			$timeout(function(){
				dwChildAppSplashLoadingTextIndicator.css('top','0px');
			},1800);


			$timeout(function(){
				dwChildAppSplashLoadingSpinner.css('top','-400px');
				dwChildAppSplashLoadingTextIndicator.css('top','-400px');
			},4500);

			$timeout(function(){
				dwChildAppSplashText.css('top','-400px');
			},4800);

			$timeout(function(){
				dwChildAppSplashLogo.css('bottom','-150px');
			},5000);

			$timeout(function(){
				dwChildAppSplashCover.css('height','50px');
			},5200);

			$timeout(function(){
				dwChildAppHeaderInfomationTitle.css('top','0px');
				dwChildAppHeaderInfomationIcon.css('top','0px');
			},5200);

			$timeout(function(){
				dwChildAppContainer.css({'opacity':1,'z-index':1,'top':'0px'}); 
			},5200);


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

	duoworldFrameworkShellLauncherCustomappsCtrl.$inject = ['$scope', '$state', '$stateParams', '$rootScope', '$presence', '$auth', '$apps', '$helpers', '$timeout'];

	mambatiFrameworkShell.controller('duoworld-framework-shell-launcher-customapps-ctrl', duoworldFrameworkShellLauncherCustomappsCtrl);
})();