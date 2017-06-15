//////////////////////////////////////////////////////////////////////
// Tenant Context Module
/////////////////////////////////////////////////////////////////////
(function(){

	'use strict';

	angular
		.module('tenantContext',[])
		.factory('tenantContextService',tenantContextService);

	function tenantContextService($window,$http,$q,$log){
		var baseHost = $window.location.host;
		var isPrimed = false;

		var tenantContextService = { 
			getDefaultTenant : getDefaultTenant,
			setDefaultTenant : setDefaultTenant
		};

		return tenantContextService;

		function getDefaultTenant(baseUrl, userID){
			return $http.get(baseUrl+'/tenant/GetDefaultTenant/'+userID);
		}

		function setDefaultTenant(baseUrl, userID, targetTenant){
			return $http.get(baseUrl+'/tenant/SetDefaultTenant/'+userID+'/'+targetTenant)
				.then(setDefaultTenantSuccess)
				.catch(function(message){
					// console.log(message);
					$log.error('Setting a default tenant was unsuccessfull !');
				});
			var setDefaultTenantSuccess = function(){
				return(data);
			};
		}

	};

})();

