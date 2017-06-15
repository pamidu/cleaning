var p_estimate_portal_module = angular.module("platformEstimatePortal", ["ui.router", "ngAnimate", "uiMicrokernel", "ngMaterial", "ngMessages", "stripe-payment-tools"]);

//Platform entry theme resgister
p_estimate_portal_module.config(function($mdThemingProvider) {

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
      '200', '300', '400', 'A100'
    ],
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
      '200', '300', '400', 'A100'
    ],
    'contrastLightColors': '7c7c7c'
  });

  $mdThemingProvider.theme('default')
    .primaryPalette('12thDoorPrimary')
    .accentPalette('12thDoorAccent')
    .warnPalette('red');

  $mdThemingProvider.alwaysWatchTheme(true);
});

//Platform entry view route configuration - Start
p_estimate_portal_module.config(['$stateProvider', '$urlRouterProvider', function($sp, $urp) {
  $urp.otherwise('/exploredocument');
  $sp
    .state('exploredocument', {
      //url: '/exploredocument/:guInv/:securityToken',
      url: '/exploredocument?guEst&securityToken&jwt', //
      templateUrl: 'exploredocument-partialNew.html',
      controller: 'portal-exploredocument-ctrl'
    })
    .state('interactdocument', {
      url: '/interactdocumentN',
      templateUrl: 'interactdocument-partialNew.html',
      controller: 'portalInteractdocumentCtrl'
    });
}]);


p_estimate_portal_module.controller("main-ctrl", ["$scope", "$location", function($scope, $location) {
  $scope.accessindex = function() {
    location.replace('http://test.12thdoor.com/12thDoorEntry/index.html#/signin');
  };
}]);

p_estimate_portal_module.controller("portal-exploredocument-ctrl", ["$scope", "$http", "$timeout", "$state", "$location", "$stateParams", "$mdDialog", "$mdToast","currencyFilter", function($scope, $http, $timeout, $state, $location, $stateParams, $mdDialog, $mdToast,currencyFilter) {

  console.log("in exploredocument");
  $scope.disableButton = function() {
    $scope.isDisabled = true;
  }

  // $scope.isDisabled;
  //$scope.isDisabled = false;

  var loadInvoiceData = function() {
    console.log('running !');
    console.log($stateParams);
    $http({
      url: "/services/duosoftware.estimate.service/estimate/getEstimateByGUID?estimateGUID="+$stateParams.guEst,
      method: "POST",
      headers: {
        securityToken: $stateParams.securityToken,
        jwt: $stateParams.jwt
      }
    }).then(function(response) {
      console.log(response);

      $scope.invoiceBreakdown = response.data;
      $scope.exchangeRate = response.data.exchangeRate;
      $scope.estimateNo = response.data.estimateNo;

      $scope.estimateDataMy = [];
      $scope.estimateDataMy = response.data;
      $scope.profileID = response.data.profileID;
      console.log(response.data);

    }, function(response) {
      $mdDialog.show(
        $mdDialog.alert()
        .parent(angular.element(document.body))
        .content('Error loading estimate data.')
        .ariaLabel('Alert Dialog Demo')
        .ok('OK')
        .targetEvent()
      );
    })
  };

  loadInvoiceData();

  $scope.loadSettingData = function() {
    $http({
      url: "/services/duosoftware.setting.service/setting/getAllByQuery",
      method: "POST",
      headers: {
        securityToken: $stateParams.securityToken,
        jwt: $stateParams.jwt
      },
      data: {
        "setting": "profile,payments",
        "preference": "invoicePref,paymentPref"
      }
    }).then(function(response) {
      console.log(response);
      $scope.companyData = response.data[0].profile;
      $scope.companyLogo = response.data[0].profile.companyLogo.imageUrl;
      console.log(response.data[0].profile.companyLogo.imageUrl);
     
      $scope.invoicePrefData = response.data[0].preference.invoicePref;

    }, function(response) {
      console.log("error loading setting")
    })
  }

  $scope.loadSettingData();

  $scope.switchportalViews = function(switchedState) {
    $state.go(switchedState);
  };

 

  $scope.accepted = function(estimateData) {
      console.log(estimateData.status);
      $scope.estimateData=estimateData;
      
      if(estimateData.status=="Accepted"){
            $mdToast.show(
                  $mdToast.simple()
                    .textContent('Estimate No.' +$scope.estimateData.estimateNo+' already Accepted')
                    .position('top right' )
                    .hideDelay(3000)
            );
          
      }
      else{
        $scope.estimateData.status="Accepted";
        console.log($scope.estimateData.estimateNo);
        var Estimate = {"estimate" : $scope.estimateData, "image" :$scope.estimateData.uploadImages, "permissionType" : "edit", "appName":"Estimates" };
        var jsonString = JSON.stringify(Estimate);
              $http({
                method : "POST",
                url : "/services/duosoftware.process.service/process/updateEstimate",
                data : jsonString
              }).then(function(response){
                $mdToast.show(
                  $mdToast.simple()
                    .textContent('Thank you for accepting Estimate No.'+$scope.estimateData.estimateNo+'')
                    .position('top right' )
                    .hideDelay(3000)
                );
              },function(response){
                $mdToast.show(
                  $mdToast.simple()
                    .textContent('error')
                    .position('top right' )
                    .hideDelay(3000)
                );
              })
      }
  };

}]);

p_estimate_portal_module.filter('datetime', function($filter) {
  return function(input) {
    if (input == null) {
      return "";
    }

    var _date = $filter('date')(new Date(input), 'yyyy/MM/dd');
    return _date.toUpperCase();

  };
});

p_estimate_portal_module.filter('toDateObject',toDateObject);
function toDateObject(){
        return function(value)
        {
            return new Date(value);
        };
    }
