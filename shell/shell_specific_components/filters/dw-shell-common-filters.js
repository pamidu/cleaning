/*use strict*/
(function(dwShellCommonFilters){

	dwShellCommonFilters.filter('unique', function(){
		return function(collection, keyname){
			var output = [],
				keys = [];

			angular.forEach(collection, function(item){
				var key = item[keyname];
				if(keys.indexOf(key) === -1){
					keys.push(key);
					output.push(item);
				}
			});
			return output;
		};
	});

	dwShellCommonFilters.filter('remspclchar', function(){
		return function(specialCharString){
			specialCharString = specialCharString.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g,' ');
			return specialCharString;
		};
	});

})(angular.module('dwShellCommonFilters', []));
