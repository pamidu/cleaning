var p_payment_portal_module = angular.module("platformPaymentPortal", ["ui.router","ngAnimate","uiMicrokernel","ngMaterial","ngMessages","stripe-payment-tools"]);

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
		//url: '/exploredocument/:guInv/:securityToken',
    url: '/exploredocument?guCreditN&securityToken&jwt',//
		templateUrl: 'exploredocument-partialNew.html',
		controller: 'portal-exploredocument-ctrl'
	})
	.state('interactdocument', {
		url: '/interactdocumentN',
		templateUrl: 'interactdocument-partialNew.html',
		controller: 'portalInteractdocumentCtrl'
	});
}]);
p_payment_portal_module.factory("$invoiceNav",[function(){
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

p_payment_portal_module.controller("main-ctrl", ["$scope","$location",function($scope,$location){
    $scope.accessindex = function(){
        location.replace('http://test.12thdoor.com/12thDoorEntry/index.html#/signin');
    };
}]);

p_payment_portal_module.controller("portal-exploredocument-ctrl", ["$scope","$http","$timeout","$state","$location","$stateParams","$invoiceNav","$mdDialog","$mdToast",function ($scope, $http, $timeout, $state, $location, $stateParams,$invoiceNav,$mdDialog,$mdToast){
  console.log($invoiceNav)

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
            url : "/services/duosoftware.creditNote.service/creditNote/getCreditNoteByGUID?creditNoteGUID="+$stateParams.guCreditN,
            method :"POST",
            headers : {
                securityToken : $stateParams.securityToken,
                jwt : $stateParams.jwt
            }
        }).then(function(response){
        	console.log(response);
          $scope.paymentTerm=response.data.peymentTerm;
          $scope.invoiceBreakdown=response.data.invoiceBreakdown;
          // if (response.data.invoiceBreakdown.peymentTerm =='multipleDueDates') {
          //   for (var i = 0; i < $scope.paymentTerm.length; i++) {
          //     $scope.paymentTerm[i].;
          //   }
           // invoiceBreakdown.netAmount-invoiceBreakdown

          // }else{

          // }


        	$scope.creditNoteData=[];
        	$scope.creditNoteData=response.data;
          $invoiceNav.setObject(response.data)

        	$scope.profileID=response.data.profileID;
          $scope.paymentMethod=response.data.paymentMethod;

    $http({
      url : "/services/duosoftware.profile.service/profile/getProfileByKey?profilekey="+$scope.profileID,
      method : "POST",
      headers : {
                securityToken : $stateParams.securityToken,
                jwt : $stateParams.jwt
            }
      }).then(function(response){
      	console.log(response);
      	$scope.profileData=response.data;
       //  $scope.payObj.payment.profileName = $scope.profileData.profileName
       //  $scope.payObj.payment.profileEmail=$scope.profileData.email;
       //  $scope.payObj.payment.invoiceNo=$scope.creditNoteData.invoiceID;
       //  $scope.payObj.payment.paymentMethod=$scope.paymentMethod;
       //  $scope.payObj.payment.paymentLog.description="credit note added by"+$scope.profileData.createUser;

      	// console.log($scope.profileData);
      	
      	},function(response){
        console.log("error loading profile");

      })

  },function(response){
            $mdDialog.show(
              $mdDialog.alert()
              .parent(angular.element(document.body))
              .content('Error loading invoice data.')
              .ariaLabel('Alert Dialog Demo')
              .ok('OK')
              .targetEvent()
            );
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
    //$scope.payObj.payment.pattern = response.data[0].preference.paymentPref.paymentPrefix + response.data[0].preference.paymentPref.paymentSequence;
    
  	// $scope.offlinePayments=response.data[0].preference.paymentPref.paymentMethods;
  	$scope.companyData=response.data[0].profile;
  	console.log($scope.companyData);
  	var partialPaymentsAllowed=response.data[0].preference.invoicePref.allowPartialPayments;
  	$scope.invoicePrefData=response.data[0].preference.invoicePref;
    $scope.paymentPrefData=response.data[0].preference.paymentPref;

    //$scope.payObj.payment.baseCurrency=$scope.companyData.baseCurrency;

    $scope.activePayments=response.data[0].payments;

  	},function(response){
    console.log("error loading setting")
  })
}

$scope.loadSettingData();
 
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

 p_payment_portal_module.filter('datetime', function($filter){
    return function(input){
      if(input == null){ return ""; } 
     
      var _date = $filter('date')(new Date(input),'yyyy/MM/dd');         
      return _date.toUpperCase();

    };
});

