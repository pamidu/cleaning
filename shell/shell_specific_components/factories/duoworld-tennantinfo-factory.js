mambatiFrameworkShell.factory('duoWorldTennantInfoFactory', function duoWorldTennantInfoFactory ($rootScope, $http){
	var tennantDetails = {};
	
	tennantDetails.importTennantDetails = function(){
		return $http.get('shell_specific_components/local_data/tennantconfig.json')
		.error(function(data){
			alert('there was an error in retreving tennant config information.');
		});
	};

	return tennantDetails;
});