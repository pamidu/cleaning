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
		url: '/exploredocument/:invoiceID',
		templateUrl: 'exploredocument-partial.html',
		controller: 'portal-exploredocument-ctrl'
	})
	.state('interactdocument', {
		url: '/interactdocument',
		templateUrl: 'interactdocument-partial.html',
		controller: 'portal-interactdocument-ctrl'
	});
}]);

//payment portal data fetch service

p_payment_portal_module.factory('invoiceFactory', ['$http', function($http){
    // var urlBase = 'http://test.12thdoor.com:3000/test.12thdoor.com/invoice12thdoor';
    var urlBase = 'http://dev12thdoor.duoworld.com/services/duosoftware.invoice.service/invoice/getCusPortalByKey';
    var invoiceFactory = {};

    invoiceFactory.getSampleInvoice = function(){
        return $http.get('data/invoiceSummarySchema.json');
        // return $http.get('data/12thdoorsampleInvoice.json');
    };

    invoiceFactory.getAllInvoice = function(){
        var req = {
            method: 'GET',
            url:urlBase,
            headers: {
                'securityToken':'securityToken'
            }
        };

        return $http(req);
    };

    invoiceFactory.getInvoiceById = function(invID){
        var req = {
            method: 'GET',
            url: urlBase+'?invoicekey='+invID,
            headers: {
                'securityToken':'123'
            }
        };

        return $http(req);
    };

    return invoiceFactory;
}]);

// p_payment_portal_module.directive('strMod', function(){
//     return {
//         restrict:'E',
//         scope:{
//             textvalue: '='
//         },
//         link: function (scope, element, attrs){
//             console.log(scope.textvalue);
//         },
//         template:'<div class="note"></div>'
//     }
// });

//Platform entry view route configuration - End

p_payment_portal_module.controller("main-ctrl", ["$scope","$location",function($scope,$location){
    $scope.accessindex = function(){
        location.replace('http://test.12thdoor.com/12thDoorEntry/index.html#/signin');
    };
}]);

// portal document explore controller - start
p_payment_portal_module.controller("portal-exploredocument-ctrl", ["$scope","$http","$timeout","$state","$location","$stateParams","invoiceFactory",function ($scope, $http, $timeout, $state, $location, $stateParams, invoiceFactory){

    $scope.invoiceData = {};

    // $scope.calaculatedValues = {};

    // $scope.invoiceTotalValue = 0;

    // $scope.invoiceSubTotal = 0;

    // $scope.invoiceTaxCollection = [];

    // $scope.invoiceTax = 0;

    $scope.invoiceDiscount = 0;

    if($stateParams.invoiceID){
        $scope.invoiceData.invoiceid = $stateParams.invoiceID;
    }else{
        location.replace('http://test.12thdoor.com/12thDoorEntry/index.html#/signin');
    };

    var loadSampleInvoiceData = function(){
        invoiceFactory.getInvoiceById($scope.invoiceData.invoiceid).
            success(function(data, status, headers, config){
                $scope.invoiceData = data;
                console.log($scope.invoiceData);
                // calculateInvoiceValues();
                // calculateInvoiceTotal();
            }).
            error(function(data, status, headers, config){
                console.log('cant load invoice data !');
            });
    };

    loadSampleInvoiceData();

    // var calculateInvoiceValues = function(){
    //     var invoiceItems = $scope.invoiceData.invoiceProducts;
    //     for(var i=0; i<invoiceItems.length; i++){
    //         var linetotal = invoiceItems[i].amount * invoiceItems[i].quantity,
    //                 linetax = (linetotal/100) * invoiceItems[i].tax.rate,
    //                     lineDiscount = (linetotal/100) * invoiceItems[i].discount;
    //         invoiceItems[i].tax.lineTax = linetax;
    //         $scope.invoiceTaxCollection.push(invoiceItems[i].tax);

    //         $scope.invoiceSubTotal = $scope.invoiceSubTotal+linetotal;
    //         $scope.invoiceTax = $scope.invoiceTax+linetax;
    //         $scope.invoiceDiscount = $scope.invoiceDiscount+lineDiscount;
    //     };
    //     console.log($scope.invoiceTaxCollection);
    // };

    // var calculateInvoiceTotal = function(){
    //     $scope.invoiceTotalValue = ($scope.invoiceSubTotal-$scope.invoiceDiscount)+$scope.invoiceTax;
    //     // this equation might change depending on the process
    // };

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

