//////////////////////////////////////////////////////////////////////
// Cloud Charge Payment Module
/////////////////////////////////////////////////////////////////////
(function(){

	'use strict';

	angular
		.module('ccPackage',[])
		.factory('ccPackageService',ccPackageService);

	function ccPackageService($window,$http,$q,$log){
		var baseHost = $window.location.host;
		var isPrimed = false;

		var ccPackageService = { 
			setSubscriptionPlan : setSubscriptionPlan,
			upgradeSubscriptionPlan : upgradeSubscriptionPlan,
			getSubscriptionPlan : getSubscriptionPlan
		};

		return ccPackageService;

		function setSubscriptionPlan(planDetails){
			return $http.post('/apis/plan/subscribe/',planDetails)
				.then(subscribeSuccess)
				.catch(function(message){
					$log.error('Subscription was unsuccessfull !');
				});
			var subscribeSuccess = function(data, status, headers, config){
				return(data);
			};
		}

		function upgradeSubscriptionPlan(planDetails){
			return $http.post('/apis/plan/upgrade',planDetails)
				.then(upgradeSuccess)
				.catch(function(message){
					$log.error('Upgrade was unsuccessfull !');
				});
			var upgradeSuccess = function(data, status, headers, config){
				return(data);
			};
		}

		function getSubscriptionPlan(planDetails){
			return $http.get('/apis/plan/current');
		}
	};

})();

/*
12_pkg_personal - free
12_pkg_just_try - trail
12_pkg_business_perY - business plan

POST <domain>/apis/plan/subscribe/  // for plan subscription
{
 "token": "tok_vnsdfuioby78fybd89hwn93vy7",
 "tenantId": "superman.dev.developer.duoworld.com",
 "planCode": "12_pkg_mini_team",
 "alacarts":[
  {"acode": "12_alacart_user_perM", "quantity":10}
 ]
}

POST <domain>apis/plan/upgrade  // for upgrade a plan

{
 "token": "tok_vnsdfuioby78fybd89hwn93vy7",
 "tenantId": "superman.dev.developer.duoworld.com",
 "planCode": "12_pkg_world_team",
 "alacarts":[
  {"acode": "12_alacart_user_perM", "quantity":10}
 ]
}

GET <domain>apis/plan/current  // for get current plan informations*/