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
    url: '/exploredocument?guInv&securityToken&jwt',//
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
            url : "/services/duosoftware.invoice.service/invoice/getCusPortalByGUID?invoiceGUID="+$stateParams.guInv,
            method :"POST",
            headers : {
                securityToken : $stateParams.securityToken,
                jwt : $stateParams.jwt
            }
        }).then(function(response){
        	console.log(response);
          $scope.paymentTerm=response.data.invoiceBreakdown.peymentTerm;
          $scope.invoiceBreakdown=response.data.invoiceBreakdown;
          // if (response.data.invoiceBreakdown.peymentTerm =='multipleDueDates') {
          //   for (var i = 0; i < $scope.paymentTerm.length; i++) {
          //     $scope.paymentTerm[i].;
          //   }
           // invoiceBreakdown.netAmount-invoiceBreakdown

          // }else{

          // }


        	$scope.invoiceDataMy=[];
        	$scope.invoiceDataMy=response.data;
          $invoiceNav.setObject(response.data)

        	$scope.profileID=response.data.invoiceSummary.profileID;
          $scope.paymentMethod=response.data.invoiceSummary.paymentMethod;

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
        $scope.payObj.payment.profileName = $scope.profileData.profileName
        $scope.payObj.payment.profileEmail=$scope.profileData.email;
        $scope.payObj.payment.invoiceNo=$scope.invoiceDataMy.invoiceID;
        $scope.payObj.payment.paymentMethod=$scope.paymentMethod;
        $scope.payObj.payment.paymentLog.description="payment added by"+$scope.profileData.createUser;

        //$scope.createUser=$scope.profileData.createUser;

        


        // if ($scope.profileData.baseCurrency) {
        //   $scope.payObj.payment.baseCurrency=$scope.profileData.baseCurrency;
        // }else{
        //   $scope.payObj.payment.baseCurrency = "USD"
        // }


      	console.log($scope.profileData);
      	
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
    $scope.payObj.payment.pattern = response.data[0].preference.paymentPref.paymentPrefix + response.data[0].preference.paymentPref.paymentSequence;
    
  	// $scope.offlinePayments=response.data[0].preference.paymentPref.paymentMethods;
  	$scope.companyData=response.data[0].profile;
  	console.log($scope.companyData);
  	var partialPaymentsAllowed=response.data[0].preference.invoicePref.allowPartialPayments;
  	$scope.invoicePrefData=response.data[0].preference.invoicePref;
    $scope.paymentPrefData=response.data[0].preference.paymentPref;

    $scope.payObj.payment.baseCurrency=$scope.companyData.baseCurrency;

    $scope.activePayments=response.data[0].payments;

  	},function(response){
    console.log("error loading setting")
  })
}

$scope.loadSettingData();
 
    $scope.switchportalViews = function(switchedState){
        $state.go(switchedState);
    };

// console.log($scope.profileData);

  $scope.payObj = {  
   "payment":{ 
      "paidTypes" : "normal",
      "lastTranDate":new Date(),
      "uAmount":"",
      "aAmount":"",
      "token":"", // response.id
      "invoiceNo":"", 
      "paymentComment":"",
      "paymentRef":"",
      "paymentMethod":"",
      "recievedAmount":"",
      "bankCharges":"",
      "favoriteStar":false,
      "favouriteStarNo":1,
      "fullAmount":"",
      "receiptID":"",
      "paymentStatus":"active",
      "profileID":"1",
      "profileAddress":{  
         "city":"",
         "country":"",
         "state":"",
         "street":"",
         "zip":""
      },
      "profileEmail":"",
      "profileName":"",
      "uploadImage":[  

      ],
      "customField":[  

      ],
      "pattern":"",
      "baseCurrency":"",
      "createDate":new Date(),
      "paymentLog":{  
         "userName":"",
         "lastTranDate":new Date(),
         "createDate":new Date(),
         "modifyDate":"",
         "createUser":"",
         "modifyUser":"",
         "UIHeight":"30px;",
         "type":"activity",
         "description":"",
         "status":"Active",
         "logID":""
      }
   },
   "permissionType":"add",
   "appName":"Payments"
}

  $scope.showPaymentPortalDialog = function(ev,paymentMethod) {
    $mdDialog.show({
      controller: DialogControllerOnlinePayment,
      templateUrl: 'interactDialog.html',
      targetEvent: ev,
      clickOutsideToClose:true,
      fullscreen: $scope.customFullscreen, // Only for -xs, -sm breakpoints.
      locals : {
        paymentMethod : paymentMethod,
        payObj : $scope.payObj
      }
    })
    .then(function() {
      loadInvoiceData()
    }, function() {
      
    });
  };






  function DialogControllerOnlinePayment($scope, $stateParams,$rootScope,$mdDialog,$invoiceNav,paymentMethod,payObj,$mdToast) {

    $scope.paymentMethod=function(name){
      $scope.config = {
          publishKey:  "pk_test_8FepS5OSLnghnaPfVED8Ixkx",
          title: '12thdoor',
          description: "for connected business",
          logo: 'img/small-logo.png',
          label: 'New Card',
      }
      if (name=='stripe') {
        $http({
            url : "/services/duosoftware.setting.service/setting/getPaymentKeys?appName="+name,
            method : "GET",
            headers : {
                securityToken : $stateParams.securityToken,
                jwt : $stateParams.jwt
            }
        }).then(function(response){
            var data = response.data;
            if (data)
                $scope.publishKey = data.publishable_key.replace('\\u000','')
            $scope.config = {
                publishKey:  $scope.publishKey,
                title: '12thdoor',
                description: "for connected business",
                logo: 'img/small-logo.png',
                label: 'New Card',
            }
        },function(response){

        })
      }
      // else{
      //   $mdDialog.show(
      //         $mdDialog.alert()
      //         .parent(angular.element(document.body))
      //         .content('Please select stripe.')
      //         .ariaLabel('Alert Dialog Demo')
      //         .ok('OK')
      //         .targetEvent()
      //       );

      // }
    }
    $scope.isDisabled = false;
    $scope.submit = function(ev){
     $scope.isDisabled = true;
      payObj.payment.recievedAmount = $scope.partialAmount;
      payObj.payment.paymentMethod = $scope.activePayment;

      if($scope.activePayment == "stripe"){
          $rootScope.$broadcast("call_stripe",ev,$scope.config ,function(){                     
                
          })
          $scope.$on('stripe-token-received', function(event, response) {
              console.log(response); 
              console.log(response.id) 
              payObj.payment.token=response.id;
              savePayment(payObj)
          });
      }else{
         savePayment(payObj)
      } 
      
    }
    
    function savePayment(payObj){
      $http({
        url : "/services/duosoftware.process.service/process/singlePayment",
        method : "POST",
        data : payObj,
        headers : {
          securityToken : $stateParams.securityToken,
          jwt : $stateParams.jwt
        }
      }).then(function(response){
        console.log(response)
        $scope.isDisabled = false;
        $mdDialog.hide();
        var toast = $mdToast.simple()
            .content('Payment Successfully done')
            .action('OK')
            .highlightAction(false)
            .position("bottom right");
        $mdToast.show(toast).then(function() {

        });
      },function(response){
        console.log(response)
        $scope.isDisabled = false;
      })
    }
    $scope.hide = function() {
      $mdDialog.hide();
    };

    $scope.cancel = function() {
      $mdDialog.cancel();
    };

    var loadSettingDataDialog = function(){

    $http({
      url : "/services/duosoftware.setting.service/setting/getAllByQuery",
      method : "POST",
      headers : {
                securityToken : $stateParams.securityToken,
                jwt : $stateParams.jwt
            },
      //securityToken: "8242a7497e79e5d11f5080f7ce19e0e9"
      data:{
        "setting":"profile,payments","preference":"invoicePref,paymentPref"
      }
  }).then(function(response){
    console.log(response);
    $scope.activePayments=[];
    for (var i = 0; i < response.data[0].payments.length; i++) {
      if (response.data[0].payments[i].activate==true) {
        $scope.activePayments.push(response.data[0].payments[i]);
        
      }
    }

    console.log($scope.activePayments);
    // $scope.activePayments=response.data[0].payments;

    },function(response){
    console.log("error loading setting")
  })
    }

    loadSettingDataDialog();

    var loadInvoiceDataDialog = function() {
        $http({
        url : "/services/duosoftware.invoice.service/invoice/getCusPortalByGUID?invoiceGUID="+$stateParams.guInv,
        method :"GET",
        headers : {
                securityToken : $stateParams.securityToken,
                jwt : $stateParams.jwt
            }
        }).then(function(response){
              console.log(response);
              $scope.balanceDuePayOnline=response.data.invoiceSummary.valueBalance;
              $scope.defaultPaymentMethod=response.data.invoiceSummary.paymentMethod;

       },function(response){

      })
    }

    loadInvoiceDataDialog();
   
  }

	}]);

 p_payment_portal_module.filter('datetime', function($filter){
    return function(input){
      if(input == null){ return ""; } 
     
      var _date = $filter('date')(new Date(input),'yyyy/MM/dd');         
      return _date.toUpperCase();

    };
});

