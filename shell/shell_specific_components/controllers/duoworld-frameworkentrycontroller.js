/*duoWorld-frameworkentryController.js*/

(function(){

	var duoWorldFrameworkEntryCtrl = function($scope, $state, $mdDialog, duoWorldTennantInfoFactory, $http, $presence, $auth, $apps, $helpers){
		$scope.tennantDetails = {};

		$scope.loginDetails = {};

		$scope.registerDetails = {};

		duoWorldTennantInfoFactory.importTennantDetails()
			.success(function(data, status, headers, config){
				$scope.tennantDetails = data;
			})
			.error(function(data, status, headers, config){
				console.log('could not return client config details.', status);
			});

	    $scope.submitLoginDetails = function(){

	    	var submitedCredentials = $scope.loginDetails;


	    	/*
	    	$auth.login(submitedCredentials.username, submitedCredentials.password, "");

			$auth.onLoginResult(function(data){
				$state.go('duoworld-framework.dock');
			});

			$auth.onLoginError(function(data){
				alert('wrong user name password');
			});
			*/
			
			if ($auth.checkSession()){
				$state.go('duoworld-framework.dock');
			}/*else{
				$state.go('duoworld-frameworkentry.login');
			}*/
				
	    };

	    $scope.submitRegistrationDetails = function(ev){
	    	var registrationSubmissionDetails = JSON.stringify({"EmailAddress":$scope.registerDetails.email,"Name":$scope.registerDetails.fullName,"Password":$scope.registerDetails.password,"ConfirmPassword":$scope.registerDetails.confirmPassword});
	    	
	    	console.log(registrationSubmissionDetails);

	    	$http({
	    		url: 'http://192.168.1.201:3048/AddUser',
	    		method: 'POST',
	    		data: registrationSubmissionDetails,
	    		headers: {'Content-Type': 'application/x-www-form-urlencoded'}	
	    	})
	    	.success(function (data,status,headers,config){
	    		$state.go('duoworld-frameworkentry.login');
	    	})
	    	.error(function (data,status,headers,config){
	    		alert("all fail");
	    		console.log(data+" - "+status);
	    	});


	    };

	};

	duoWorldFrameworkEntryCtrl.$inject = ['$scope','$state','$mdDialog','duoWorldTennantInfoFactory','$http','$presence', '$auth', '$apps', '$helpers'];
	//Here the dependancies are injected into the controller as string values so that javascript utility tools such as minfiers will not effect the dependancies when they minify the source code.

	mambatiFrameworkShell.controller('duoWorld-Framework-Entry-Ctrl', duoWorldFrameworkEntryCtrl);
	//Here the said controller is registered with the main ap module.
})();