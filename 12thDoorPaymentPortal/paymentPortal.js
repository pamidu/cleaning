// 'use strict';

var p_payment_portal_module = angular.module("platformPaymentPortal", ["ui.router","ngAnimate","uiMicrokernel","ngMaterial","ngMessages"]);

//Platform entry theme resgister
p_payment_portal_module.config(function($mdThemingProvider){

  $mdThemingProvider.definePalette('12thDoorPrimary', {
    '50': '235B91',
    '100': '235B91',
    '200': '235B91',
    '300': '235B91',
    '400': '235B91',
    '500': '235B91',
    '600': '235B91',
    '700': '235B91',
    '800': '235B91',
    '900': '235B91',
    'A100': '235B91',
    'A200': '235B91',
    'A400': '235B91',
    'A700': '235B91',
    'contrastDefaultColor': 'light',          
    'contrastDarkColors': ['50', '100',
     '200', '300', '400', 'A100'],
    'contrastLightColors': undefined  

  });

    $mdThemingProvider.definePalette('12thDoorAccent', {
    '50': 'ffffff',
    '100': 'ffffff',
    '200': 'ffffff',
    '300': 'ffffff',
    '400': 'ffffff',
    '500': 'ffffff',
    '600': 'ffffff',
    '700': 'ffffff',
    '800': 'ffffff',
    '900': 'ffffff',
    'A100': 'ffffff',
    'A200': 'ffffff',
    'A400': 'ffffff',
    'A700': 'ffffff',
    'contrastDefaultColor': 'dark',
    'contrastDarkColors': ['50', '100',
     '200', '300', '400', 'A100'],
    'contrastLightColors': '7c7c7c'
  });

  $mdThemingProvider.theme('default')
    .primaryPalette('12thDoorPrimary')
    .accentPalette('12thDoorAccent')
    .warnPalette('red');

  	$mdThemingProvider.alwaysWatchTheme(true);
});

//Platform entry view route configuration - Start
p_payment_portal_module.config(['$stateProvider','$urlRouterProvider', function($sp, $urp){
	$urp.otherwise('/exploredocument');
	$sp
	.state('exploredocument', {
		url: '/exploredocument',
		templateUrl: 'exploredocument-partial.html',
		controller: 'portal-exploredocument-ctrl'
	})
	.state('interactdocument', {
		url: '/interactdocument',
		templateUrl: 'interactdocument-partial.html',
		controller: 'portal-interactdocument-ctrl'
	});
}]);
//Platform entry view route configuration - End

// portal document explore controller - start
p_payment_portal_module.controller("portal-exploredocument-ctrl", ["$scope","$http","$timeout","$state","$location",function ($scope, $http, $timeout, $state, $location){
    $scope.invoiceSampleData = {};

    var loadSampleInvoiceData = function(){
        $http.get('data/invoiceSampleData.json').
        success(function(data, status, headers, config){
            $scope.invoiceSampleData = data;
            console.log($scope.invoiceSampleData);
        }).
        error(function(data, status, headers, config){
            console.log('cant load sample invoice data !');
        });
    };

    loadSampleInvoiceData();

    $scope.switchportalViews = function(switchedState){
        $state.go(switchedState);
    };
}]);
// portal document explore controller - end

// portal document explore controller - start
p_payment_portal_module.controller("portal-interactdocument-ctrl", ["$scope", "$timeout","$state","$location",function ($scope, $timeout, $state, $location){

    $scope.switchportalViews = function(switchedState){
        $state.go(switchedState);
    };

}]);
// portal document explore controller - end

