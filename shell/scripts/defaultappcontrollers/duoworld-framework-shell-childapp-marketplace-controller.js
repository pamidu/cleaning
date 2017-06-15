//duoworld-framework-shell-launcher-marketplace-controller.js

(function(){

	var duoworldFrameworksShellLauncherMarketPlaceControl = function($scope, $state, $objectstore, $http, $rootScope, ngDialog, $timeout){

		/*Dont touch This*/
		$scope.childApplicationClose = function(){
			$state.go('dock');
		};

		$scope.childApplicationMinimise = function(){
			$state.go('dock');
		};

		/*Do what you want !*/

		var apps;
		var client = $objectstore.getClient("duoworld.duoweb.info","appStoreApps", true);
        
         client.onGetMany(function(data){
               if (data)
                $scope.allApps = data;
                $scope.apps=$scope.allApps;
                

         });
            
         client.onError(function(data){
             alert ("Error occured");
         });
            
         client.getByKeyword('*');
         this.products = apps;

        $scope.download=function (app ) {
	      $scope.app=app;
	     /* alert(app.id)*/
	       $http({
	        method:'GET',
	        url:'shell_specific_components/marketplace/install.php?appCode='+app.id
	      }).success(function(data){
	        console.log(data);
	      }).error(function(data){
	        console.log('error')
	      })
	    };

		  $rootScope.name= "testing";
	      $rootScope.app="testing";
	      $rootScope.name= "testing";
	      $rootScope.catogery="testing";
	      $rootScope.developer="testing";
	      $rootScope.price="testing";
	      $rootScope.rating="testing";
	      $rootScope.contact="testing";
	      $rootScope.id="testing";
	      $rootScope.images= $rootScope.app.images;


           
        $scope.open = function (app) {
          $rootScope.app=app;
          $rootScope.name= app.name;
          $rootScope.catogery=app.catogery;
          $rootScope.developer=app.developer;
          $rootScope.price=app.price;
          $rootScope.rating=app.rating;
          $rootScope.contact=app.contact;
          $rootScope.id=app.id;
          $rootScope.images=app.images;
         /* alert(app.name)*/
            var new_dialog = ngDialog.open({ template: 'firstDialogId', data: {name: app.name,catogery:app.catogery} });

                            // example on checking whether created `new_dialog` is open
                            $timeout(function() {
                                console.log(ngDialog.isOpen(new_dialog.id));
                            }, 2000)
        };		
	};

	duoworldFrameworksShellLauncherMarketPlaceControl.$inject = ['$scope','$state','$objectstore', '$http', '$rootScope', 'ngDialog', '$timeout'];

	mambatiFrameworkShell.controller('duoworld-framework-shell-launcher-marketplace-ctrl', duoworldFrameworksShellLauncherMarketPlaceControl);
})();