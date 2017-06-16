var p_estimate_portal_module = angular.module("platformEstimatePortal", ["ui.router", "ngAnimate", "uiMicrokernel", "ngMaterial", "ngMessages", "ngSanitize","stripe-payment-tools"]);

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
    });
   
}]);


// p_estimate_portal_module.controller("portal-exploredocument-ctrl", ["$scope", "$location", "$http", function($scope, $location, $http) {
//   $scope.accessindex = function() {
//     location.replace('http://test.12thdoor.com/12thDoorEntry/index.html#/signin');
//   };


// }]);

p_estimate_portal_module.controller("portal-exploredocument-ctrl", ["$scope", "$rootScope","$http", "$timeout", "$state", "$location", "$stateParams", "$mdDialog", "$mdToast","currencyFilter","AddressService", function($scope, $rootScope, $http, $timeout, $state, $location, $stateParams, $mdDialog, $mdToast,currencyFilter,AddressService) {

 $scope.accessindex = function() {
    location.replace('http://test.12thdoor.com/12thDoorEntry/index.html#/signin');
  };

  console.log("in exploredocument");
  $scope.disableButton = function() {
    $scope.isDisabled = true;
  }

  // $scope.isDisabled;
  //$scope.isDisabled = false;
  $scope.showShippingInDetailsView=false;

  var loadEstimateData = function() {
    console.log('running !');
    console.log($stateParams);
    $http({
      url: "/services/duosoftware.estimate.service/estimate/getJWTEstimateByGUID?estimateGUID="+$stateParams.guEst,
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
      $rootScope.estimateDataMy = $scope.estimateDataMy;
      $scope.ObjCusAddress = AddressService.setAddress($scope.estimateDataMy.profileName,$scope.estimateDataMy.billingAddress.street,$scope.estimateDataMy.billingAddress.city,$scope.estimateDataMy.billingAddress.state,$scope.estimateDataMy.billingAddress.zip,$scope.estimateDataMy.billingAddress.country,$scope.estimateDataMy.contactNo,$scope.estimateDataMy.mobileNo,$scope.estimateDataMy.fax,$scope.estimateDataMy.email,$scope.estimateDataMy.website);
      $scope.profileID = response.data.profileID;
      console.log(response.data);
      $scope.estimateDataMy.notes = $scope.estimateDataMy.notes.replace(/(?:\r\n|\r|\n)/g, '</br>');
                

      if($scope.estimateDataMy.shippingAddress.s_street == "" && $scope.estimateDataMy.shippingAddress.s_city == ""
        && $scope.estimateDataMy.shippingAddress.s_state == "" && $scope.estimateDataMy.shippingAddress.s_zip == "" && $scope.estimateDataMy.shippingAddress.s_country == "")
      { 
        debugger;
        $scope.showShippingInDetailsView = false;
      }
      else if ($scope.displayShipToAddressEstimate == true) {
        debugger;
          $scope.showShippingInDetailsView = true;
       
      }

      


    }, function(response) {
      // $mdDialog.show(
      //   $mdDialog.alert()
      //   .parent(angular.element(document.body))
      //   .content('Error loading estimate data.')
      //   .ariaLabel('Alert Dialog Demo')
      //   .ok('OK')
      //   .targetEvent()
      // );
      console.log("Error loading estimate data.");
    })
  };

  loadEstimateData();

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
        "preference": "invoicePref,estimatePref"
      }
    }).then(function(response) {
      console.log(response);
      $scope.companyData = response.data[0].profile;
      $scope.ObjCompanyAddress = AddressService.setAddress($scope.companyData.companyName,$scope.companyData.street,$scope.companyData.city,$scope.companyData.state,$scope.companyData.zip,$scope.companyData.country,$scope.companyData.phoneNo,"",$scope.companyData.fax,$scope.companyData.companyEmail,$scope.companyData.website);
      $scope.companyLogo = response.data[0].profile.companyLogo.imageUrl;
      console.log(response.data[0].profile.companyLogo.imageUrl);
      $scope.invoicePrefData = response.data[0].preference.invoicePref;
      $scope.offlinePayments = $scope.invoicePrefData.offlinePayments;
      console.log($scope.invoicePrefData.offlinePayments);
      $scope.offlinePayments = $scope.offlinePayments.replace(/(?:\r\n|\r|\n)/g, '</br>');
      console.log($scope.offlinePayments);
      $scope.estimatePref=response.data[0].preference.estimatePref;
      $scope.displayShipToAddressEstimate = $scope.estimatePref.displayShipToAddressEstimate;

    }, function(response) {
      console.log("error loading setting")
    })
  }

  $scope.loadSettingData();

  $scope.print = function(){
    console.log($rootScope.estimateDataMy);
    var estimateNo = $rootScope.estimateDataMy.estimateNo;
    debugger;
     pdfReq().then(function(response) {
          b64toBlob(response.data.result,function(blob){

            printData(estimateNo+".pdf",blob);
          })
    });
  }

  $scope.download = function(){
    
    console.log($rootScope.estimateDataMy);
    var estimateNo = $rootScope.estimateDataMy.estimateNo;
    debugger;
     pdfReq().then(function(response) {
          b64toBlob(response.data.result,function(blob){

            downloadData(estimateNo+".pdf",blob);
          })
    });

  }

    function b64toBlob(b64Data,callback) {
        var contentType = 'application/pdf';
        var sliceSize = 512;
        b64Data = b64Data.replace(/^[^,]+,/, '');
        b64Data = b64Data.replace(/\s/g, '');
        var byteCharacters = window.atob(b64Data);
        var byteArrays = [];

        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            var slice = byteCharacters.slice(offset, offset + sliceSize);

            var byteNumbers = new Array(slice.length);
            for (var i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            var byteArray = new Uint8Array(byteNumbers);

            byteArrays.push(byteArray);
        }

        blob = new Blob(byteArrays, {type: contentType});
        callback(blob)
    }

    function printData(fileName,blob){
      var fileURL = URL.createObjectURL(blob);
      var print = window.open(fileURL,'','width=1200,height=900');
      print.focus();
      print.print(); 
    }

    function downloadData(fileName, blob){
          var a = document.createElement("a");
        var url = window.URL.createObjectURL(blob);

          document.body.appendChild(a);
          a.style = "display: none";
            a.href = url;
            a.download = fileName;
            a.click();
            window.URL.revokeObjectURL(url);
    }

    function pdfReq(){
      return $http({
        url: "/services/duosoftware.process.service/process/generatePDF?uniqueID="+$rootScope.estimateDataMy.estimateNo+"&cls=estimate",
        method: "POST",
        headers: {
          securityToken: $stateParams.securityToken
        }
      })
    }

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
        $scope.estimateData.viewed=true;
        console.log($scope.estimateData.estimateNo);
        var Estimate = {"estimate" : $scope.estimateData, "image" :$scope.estimateData.uploadImages, "permissionType" : "edit", "appName":"Estimates" };
        var jsonString = JSON.stringify(Estimate);
              $http({
                method : "POST",
                url : "/services/duosoftware.process.service/process/updateEstimateUsingJWT",
                headers: {
                  securityToken: $stateParams.securityToken,
                  jwt: $stateParams.jwt
                },
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

p_estimate_portal_module.directive('msAddressComponent', msAddressComponent);
    /** @ngInject */
function msAddressComponent()
    {
        var addressComponentDirective = {
            restrict: 'E',
            scope   : {
                addressData: '=',
                entType : '='
            },
            template:[
                '<div class="addressCompHolder">',
                '<div class="title">{{addressData.name}}</div>',
                '<div class="address">{{addressData.street}} </div>',
                '<div class="address">{{addressData.city}} {{addressData.state}}</div>',
                '<div class="address">{{addressData.zip}} {{addressData.country}}</div>',
                '<div class="phone">',
                '<span ng-if="addressData.phoneNo">t. {{addressData.phoneNo}}</span>',
                '<span ng-show="cusInfo" ng-if="addressData.mobile">, {{addressData.mobile}}</span>',
                '<span ng-show="bizInfo" ng-if="addressData.fax"> f. {{addressData.fax}}</span>',
                '</div>',
                '<div ng-if="addressData.email" class="email">{{addressData.email}}</div>',
                '<div ng-show="bizInfo" class="website">{{addressData.website}}</div>',
                '</div>'
            ].join(''),
            link: function(scope, attrs, elem){

                scope.cusInfo = false;
                scope.bizInfo = false;

                scope.$watch('addressData', function(newVal){
                    if(newVal){
                        scope.addressData = newVal;
                    };
                }, true);

                if(scope.entType === 'company'){
                    scope.bizInfo = true;
                }else{
                   // scope.cuzInfo = true;
                   scope.cusInfo = true;
                }

            }
        };

        return addressComponentDirective;
    }

p_estimate_portal_module.factory('AddressService', Address);
Address.$inject = [];

    function Address()
    {
      var addresses={
        setAddress:setAddress
      };
      return addresses;
      
      function setAddress(name,street,city,state,zip,country,phoneNo,mobile,fax,email,website)
      {
        //console.log(name+street);
        var MyAddress={name:name,
        street:street,
        city:city,
        state:state,
        zip:zip,
        country:country,
        phoneNo:phoneNo,
        mobile:mobile,
        fax:fax,
        email:email,
        website:website
        };
        return MyAddress;
      }  
    }
