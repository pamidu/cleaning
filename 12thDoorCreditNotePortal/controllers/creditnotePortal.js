var p_creditNote_portal_module = angular.module("platformPaymentPortal", ["ui.router","ngAnimate","uiMicrokernel","ngMaterial","ngMessages", "ngSanitize","stripe-payment-tools"]);

//Platform entry theme resgister
p_creditNote_portal_module.config(function($mdThemingProvider){

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
p_creditNote_portal_module.config(['$stateProvider','$urlRouterProvider', function($sp, $urp){
	$urp.otherwise('/exploredocument');
	$sp
	.state('exploredocument', {
		//url: '/exploredocument/:guInv/:securityToken',
    url: '/exploredocument?guCreditN&securityToken&jwt',//
		templateUrl: 'exploredocument-partialNew.html',
		controller: 'portal-exploredocument-ctrl'
	})
	// .state('interactdocument', {
	// 	url: '/interactdocumentN',
	// 	templateUrl: 'interactdocument-partialNew.html',
	// 	controller: 'portalInteractdocumentCtrl'
	// });
}]);
p_creditNote_portal_module.factory("$invoiceNav",[function(){
  var invoiceObj = {}
  return {
    setObject : function(obj){
      invoiceObj = obj;
    },
    getObject : function(){
      return invoiceObj;
    }
  }

}]);

// p_creditNote_portal_module.controller("main-ctrl", ["$scope","$location",function($scope,$location){
//     $scope.accessindex = function(){
//         location.replace('http://test.12thdoor.com/12thDoorEntry/index.html#/signin');
//     };
// }]);

p_creditNote_portal_module.controller("portal-exploredocument-ctrl", ["$scope", "$rootScope","$http","$timeout","$state","$location","$stateParams","$invoiceNav","$mdDialog","$mdToast","AddressService",function ($scope, $rootScope, $http, $timeout, $state, $location, $stateParams,$invoiceNav,$mdDialog,$mdToast,AddressService){
  
  $scope.accessindex = function(){
        location.replace('http://test.12thdoor.com/12thDoorEntry/index.html#/signin');
    };

  console.log("in exploredocument");
  $scope.disableButton = function() {
        $scope.isDisabled = true;
    }

   // $scope.isDisabled;
    //$scope.isDisabled = false;

var loadInvoiceData = function(){
  console.log('running !');
  console.log($stateParams);
	         $http({
            url : "/services/duosoftware.creditNote.service/creditNote/getJWTCreditNoteByGUID?creditNoteGUID="+$stateParams.guCreditN,
            method :"POST",
            headers : {
                securityToken : $stateParams.securityToken,
                jwt : $stateParams.jwt
            }
        }).then(function(response){
        	console.log(response);
          $scope.paymentTerm=response.data.peymentTerm;
          $scope.invoiceBreakdown=response.data.invoiceBreakdown;
        	$scope.creditNoteData=[];
        	$scope.creditNoteData=response.data;
          $rootScope.creditNoteData=$scope.creditNoteData;
          console.log($scope.creditNoteData);

          $scope.creditNoteData.notes = $scope.creditNoteData.notes.replace(/(?:\r\n|\r|\n)/g, '</br>');

          $scope.exchangeRate = response.data.exchangeRate;
          $invoiceNav.setObject(response.data)
        	$scope.profileID=response.data.profileID;
          $scope.paymentMethod=response.data.paymentMethod;

    $http({
      url : "/services/duosoftware.profile.service/profile/getProfileByKey?uniqueID=" + $scope.profileID,
      method : "POST",
      headers : {
                securityToken : $stateParams.securityToken,
                jwt : $stateParams.jwt
            }
      }).then(function(response){
      	console.log(response);
      	$scope.profileData=response.data;
        console.log($scope.profileData);
        $scope.ObjCusAddress = AddressService.setAddress($scope.profileData.profileName,$scope.profileData.billingAddress.street,$scope.profileData.billingAddress.city,$scope.profileData.billingAddress.state,$scope.profileData.billingAddress.zip,$scope.profileData.billingAddress.country,$scope.profileData.phone,$scope.profileData.mobile,$scope.profileData.fax,$scope.profileData.email,$scope.profileData.website);
      	},function(response){
        console.log("error loading profile");
      })

  },function(response){
            // $mdDialog.show(
            //   $mdDialog.alert()
            //   .parent(angular.element(document.body))
            //   .content('Error loading creditNote data.')
            //   .ariaLabel('Alert Dialog Demo')
            //   .ok('OK')
            //   .targetEvent()
            // );
          console.log("Error loading creditNote data.");
  })
};

loadInvoiceData();
$scope.loadSettingData=function(){
	$http({
      url : "/services/duosoftware.setting.service/setting/getAllByQuery",
      method : "POST",
      headers : {
                securityToken : $stateParams.securityToken,
                jwt : $stateParams.jwt
            },
      data:{
        "setting":"profile,payments","preference":"invoicePref,paymentPref"
      }
  }).then(function(response){
  	console.log(response);
   
  	$scope.companyData=response.data[0].profile;
  	console.log($scope.companyData);
  	var partialPaymentsAllowed=response.data[0].preference.invoicePref.allowPartialPayments;
  	$scope.invoicePrefData=response.data[0].preference.invoicePref;
    $scope.paymentPrefData=response.data[0].preference.paymentPref;
    $scope.companyLogo = response.data[0].profile.companyLogo.imageUrl;

    $scope.ObjCompanyAddress = AddressService.setAddress($scope.companyData.companyName,$scope.companyData.street,$scope.companyData.city,$scope.companyData.state,$scope.companyData.zip,$scope.companyData.country,$scope.companyData.phoneNo,"",$scope.companyData.fax,$scope.companyData.companyEmail,$scope.companyData.website);
    //$scope.payObj.payment.baseCurrency=$scope.companyData.baseCurrency;

    $scope.activePayments=response.data[0].payments;

  	},function(response){
    console.log("error loading setting")
  })
}

$scope.loadSettingData();

 $scope.print = function(){
    console.log($rootScope.creditNoteData);
    var creditNoteNo = $rootScope.creditNoteData.creditNoteNo;
    debugger;
     pdfReq().then(function(response) {
          b64toBlob(response.data.result,function(blob){

            printData(creditNoteNo+".pdf",blob);
          })
    });
  }

  $scope.download = function(){
    
    console.log($rootScope.creditNoteData);
    var creditNoteNo = $rootScope.creditNoteData.creditNoteNo;
    debugger;
     pdfReq().then(function(response) {
          b64toBlob(response.data.result,function(blob){

            downloadData(creditNoteNo+".pdf",blob);
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
        url: "/services/duosoftware.process.service/process/generatePDF?uniqueID="+$rootScope.creditNoteData.creditNoteNo+"&cls=creditNote",
        method: "POST",
        headers: {
          securityToken: $stateParams.securityToken
        }
      })
    }
 
    $scope.switchportalViews = function(switchedState){
        $state.go(switchedState);
    };

//   $scope.payObj = {  
//    "payment":{  
//       "lastTranDate":new Date(),
//       "uAmount":"",
//       "aAmount":"",
//       "token":"",
//       "invoiceNo":"", 
//       "paymentComment":"",
//       "paymentRef":"",
//       "paymentMethod":"",
//       "recievedAmount":"",
//       "bankCharges":"",
//       "favoriteStar":false,
//       "favouriteStarNo":1,
//       "fullAmount":"",
//       "receiptID":"",
//       "paymentStatus":"active",
//       "profileID":"1",
//       "profileAddress":{  
//          "city":"",
//          "country":"",
//          "state":"",
//          "street":"",
//          "zip":""
//       },
//       "profileEmail":"",
//       "profileName":"",
//       "uploadImage":[  

//       ],
//       "customField":[  

//       ],
//       "pattern":"",
//       "baseCurrency":"",
//       "createDate":new Date(),
//       "paymentLog":{  
//          "userName":"",
//          "lastTranDate":new Date(),
//          "createDate":new Date(),
//          "modifyDate":"",
//          "createUser":"",
//          "modifyUser":"",
//          "UIHeight":"30px;",
//          "type":"activity",
//          "description":"",
//          "status":"Active",
//          "logID":""
//       }
//    },
//    "permissionType":"add",
//    "appName":"Payments"
// }

	}]);

 p_creditNote_portal_module.filter('datetime', function($filter){
    return function(input){
      if(input == null){ return ""; } 
     
      var _date = $filter('date')(new Date(input),'yyyy/MM/dd');         
      return _date.toUpperCase();

    };
});

p_creditNote_portal_module.filter('toDateObject', toDateObject);

function toDateObject($filter) {
    return function(value) {
      var datenow = moment(value);

      if(datenow.isValid){
        var tempDate = new Date(datenow);
        return $filter('date')(tempDate, 'MMM d, y');
      }
    };
}

p_creditNote_portal_module.directive('msAddressComponent', msAddressComponent);
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

p_creditNote_portal_module.factory('AddressService', Address);
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

