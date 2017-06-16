var p_payment_portal_module = angular.module("platformPaymentPortal", ["ui.router", "ngAnimate", "uiMicrokernel", "ngMaterial", "ngMessages", "ngSanitize" , "stripe-payment-tools"]);

//Platform entry theme resgister
p_payment_portal_module.config(function($mdThemingProvider) {

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
p_payment_portal_module.config(['$stateProvider', '$urlRouterProvider', function($sp, $urp) {
    $urp.otherwise('/exploredocument');
    $sp
        .state('exploredocument', {
            //url: '/exploredocument/:guInv/:securityToken',
            url: '/exploredocument?guInv&securityToken&jwt', //
            templateUrl: 'exploredocument-partialNew.html',
            controller: 'portal-exploredocument-ctrl'
        })
        .state('interactdocument', {
            url: '/interactdocumentN',
            templateUrl: 'interactdocument-partialNew.html',
            controller: 'portalInteractdocumentCtrl'
        });
}]);
// p_payment_portal_module.factory("$invoiceNav", [function() {
//   var invoiceObj = {}
//   return {
//     setObject: function(obj) {
//       invoiceObj = obj;
//     },
//     getObject: function() {
//       return invoiceObj;
//     }
//   }

// }]);

// p_payment_portal_module.controller("main-ctrl", ["$scope", "$location", function($scope, $location) {
   
// }]);

p_payment_portal_module.controller("portal-exploredocument-ctrl", ["$scope", "$rootScope", "$http", "$timeout", "$state", "$location", "$stateParams", "$mdDialog", "$mdToast", "currencyFilter","AddressService", "the2checkoutService", "$window", function($scope, $rootScope, $http, $timeout, $state, $location, $stateParams, $mdDialog, $mdToast, currencyFilter, AddressService, the2checkoutService, $window) {

    $scope.accessindex = function() {
        location.replace('http://test.12thdoor.com/12thDoorEntry/index.html#/signin');
    };

    $scope.disableButton = function() {
        $scope.isDisabled = true;
    }

    // $scope.isDisabled;
    //$scope.isDisabled = false;
    $scope.showShippingInDetailsView = false;
    $scope.currencyValidate = false; 

    var loadInvoiceData = function() {
        console.log('running !');
        console.log($stateParams);
        $http({
            url: "/services/duosoftware.invoice.service/invoice/getJWTInvoiceByGUID?invoiceGUID=" + $stateParams.guInv,
            method: "POST",
            headers: {
                securityToken: $stateParams.securityToken,
                jwt: $stateParams.jwt
            }
        }).then(function(response) {
            console.log(response);
            
            $scope.invoiceBreakdown = response.data;
            $scope.paymentType = response.data.paymentType;
            $scope.exchangeRate = response.data.exchangeRate;
            $scope.invoiceNo = response.data.invoiceNo;

            $scope.invoiceDataMy = [];
            $scope.invoiceDataMy = response.data;
            // $invoiceNav.setObject(response.data)
            $rootScope.invoiceDataMy = $scope.invoiceDataMy;

            $scope.profileID = response.data.profileID;
            $scope.paymentMethod = response.data.paymentMethod;
            $scope.peymentTerm = response.data.peymentTerm;

            $scope.invoiceDataMy.notes = $scope.invoiceDataMy.notes.replace(/(?:\r\n|\r|\n)/g, '</br>');

            response.data.subTotal = parseFloat(response.data.subTotal);
            response.data.netAmount = parseFloat(response.data.netAmount);
            response.data.shipping = parseFloat(response.data.shipping);

            if($scope.invoiceDataMy.shippingAddress.s_street == "" && $scope.invoiceDataMy.shippingAddress.s_city == ""
            && $scope.invoiceDataMy.shippingAddress.s_state == "" && $scope.invoiceDataMy.shippingAddress.s_zip == "" && $scope.invoiceDataMy.shippingAddress.s_country == "")
          { 
           
            $scope.showShippingInDetailsView = false;
          }
          else if ($scope.displayShipAddress == true) {
         
              $scope.showShippingInDetailsView = true;
           
          }


            console.log(response.data);

            var calculateDis = 0;
            var totalDiscount = 0;
            var subT = 0
            var itemPrice = 0;

            var products = [];
            products = angular.copy(response.data.invoiceLines);
            for (var i = products.length - 1; i >= 0; i--) {

                products[i].price = parseFloat(products[i].price).toFixed(2);

                subT += parseFloat(products[i].price * products[i].quantity);
                response.data.subTotal = parseFloat(subT).toFixed(2);
                products[i].amount = parseFloat(products[i].price * products[i].quantity).toFixed(2);
                totalDiscount += parseFloat(subT * products[i].discount / 100);
                response.data.discountAmount = parseFloat(totalDiscount).toFixed(2);

                if (response.data.taxAmounts.length >= 1) {
                    for (var i = response.data.taxAmounts.length - 1; i >= 0; i--) {
                        response.data.taxAmounts[i].salesTax = parseFloat(response.data.taxAmounts[i].salesTax )
                    }
                }

                var tot = 0;
                var paid = 0;
                var paidAmount = 0;
                var getsin = 0;
                for (var x = 0; x <= response.data.multiDueDates.length - 1; x++) {
                    getsin = parseFloat(response.data.multiDueDates[x].balance);
                    var singlebalance = parseFloat(response.data.netAmount - getsin).toFixed(2);

                    if (response.data.peymentTerm != 'multipleDueDates') {

                        //$scope.paidAmount = response.data.multiDueDates[x].paidAmount;
                        $scope.paidAmount = parseFloat(response.data.multiDueDates[x].dueDatePrice - response.data.multiDueDates[x].balance);

                        // paidAmount += parseFloat(response.data.multiDueDates[x].dueDatePrice - response.data.multiDueDates[x].balance);
                        //               paid = parseFloat(paidAmount).toFixed(2);
                        //               var calBalance = parseFloat(tot).toFixed(2);

                        //               $scope.paidAmount = paid;

                        var balanceDue = parseFloat(response.data.multiDueDates[x].balance).toFixed(2);
                        $scope.balanceDuePayOnline = balanceDue;
                        $scope.balanceDue = balanceDue;

                    } else {

                        console.log(response.data.multiDueDates[x].balance);

                        tot += parseFloat(response.data.multiDueDates[x].balance);
                        paidAmount += parseFloat(response.data.multiDueDates[x].dueDatePrice - response.data.multiDueDates[x].balance);
                        paid = parseFloat(paidAmount).toFixed(2);
                        var calBalance = parseFloat(tot).toFixed(2);
                        $scope.paidAmount = paid;
                        $scope.balanceDue = calBalance;

                    }

                }
            }

            function loadCustomFields() {
                $http({
                    url: "/services/duosoftware.process.service/process/getInvoiceByKey?uniqueID=" + $scope.invoiceNo,
                    method: "POST",
                    headers: {
                        securityToken: $stateParams.securityToken,
                        jwt: $stateParams.jwt
                    }
                }).then(function(response) {

                    $scope.cusFielData = [];
                    $scope.cusFielData = response.data.customFields;
                    console.log($scope.cusFielData);

                }, function(response) {

                })

            }

            loadCustomFields();

            $http({
                url: "/services/duosoftware.profile.service/profile/getProfileByKey?uniqueID=" + $scope.profileID,
                method: "POST",
                headers: {
                    securityToken: $stateParams.securityToken,
                    jwt: $stateParams.jwt
                }
            }).then(function(response) {
                console.log(response);
                $scope.profileData = response.data;
                console.log($scope.profileData);

                $scope.ObjCusAddress = AddressService.setAddress($scope.profileData.profileName,$scope.profileData.billingAddress.street,$scope.profileData.billingAddress.city,$scope.profileData.billingAddress.state,$scope.profileData.billingAddress.zip,$scope.profileData.billingAddress.country,$scope.profileData.phone,$scope.profileData.mobile,$scope.profileData.fax,$scope.profileData.email,$scope.profileData.website);

                $scope.payObj.payment.profileName = $scope.profileData.profileName
                $scope.payObj.payment.profileEmail = $scope.profileData.email;
                $scope.payObj.payment.invoiceNo = $scope.invoiceNo;
                $scope.payObj.payment.paymentMethod = $scope.paymentMethod;
                $scope.payObj.payment.paymentLog.description = "payment added by" + $scope.profileData.createUser;


                console.log($scope.profileData);

            }, function(response) {
                console.log("error loading profile");

            })

            $scope.payObj.payment.changedCurrency = response.data.changedCurrency;

        }, function(response) {
            // $mdDialog.show(
            //     $mdDialog.alert()
            //     .parent(angular.element(document.body))
            //     .content('Error loading invoice data.')
            //     .ariaLabel('Alert Dialog Demo')
            //     .ok('OK')
            //     .targetEvent()
            // );
            console.log("Error loading invoice data.");
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
            $scope.payObj.payment.pattern = response.data[0].preference.paymentPref.paymentPrefix + response.data[0].preference.paymentPref.paymentSequence;

            // $scope.offlinePayments=response.data[0].preference.paymentPref.paymentMethods;
            $scope.companyData = response.data[0].profile;

            $scope.ObjCompanyAddress = AddressService.setAddress($scope.companyData.companyName,$scope.companyData.street,$scope.companyData.city,$scope.companyData.state,$scope.companyData.zip,$scope.companyData.country,$scope.companyData.phoneNo,"",$scope.companyData.fax,$scope.companyData.companyEmail,$scope.companyData.website);

            $scope.companyLogo = response.data[0].profile.companyLogo.imageUrl;

            console.log(response.data[0].profile.companyLogo.imageUrl);
            $scope.partialPaymentsAllowed = response.data[0].preference.invoicePref.allowPartialPayments;
            $scope.invoicePrefData = response.data[0].preference.invoicePref;
            $scope.paymentPrefData = response.data[0].preference.paymentPref;

            $scope.showShippingInDetailsView= $scope.invoicePrefData.displayShipAddress;

            $scope.payObj.payment.baseCurrency = $scope.companyData.baseCurrency;

            $scope.activePayments = response.data[0].payments;

            $scope.offlinePayments = response.data[0].preference.invoicePref.offlinePayments;
            $scope.offlinePayments = $scope.offlinePayments.replace(/(?:\r\n|\r|\n)/g, '</br>');
            $scope.checkedOfflinePayments = response.data[0].preference.invoicePref.checkedOfflinePayments;

            if($scope.checkedOfflinePayments){
                if($scope.offlinePayments!=0){
                    $scope.checkedOffline=true;
                }
                else{
                    $scope.checkedOffline=false;
                }
               
            }
            else{
                 $scope.checkedOffline=false;
            }

        }, function(response) {
            console.log("error loading setting")
        })
    }

    $scope.loadSettingData();

    $scope.print = function(){
    console.log($rootScope.invoiceDataMy);
    var invoiceDataMy = $rootScope.invoiceDataMy.invoiceNo;
    debugger;
     pdfReq().then(function(response) {
          b64toBlob(response.data.result,function(blob){

            printData(invoiceDataMy+".pdf",blob);
          })
    });
  }

  $scope.download = function(){
    
    console.log($rootScope.invoiceDataMy);
    var invoiceDataMy = $rootScope.invoiceDataMy.invoiceNo;
    debugger;
     pdfReq().then(function(response) {
          b64toBlob(response.data.result,function(blob){

            downloadData(invoiceDataMy+".pdf",blob);
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
        url: "/services/duosoftware.process.service/process/generatePDF?uniqueID="+$rootScope.invoiceDataMy.invoiceNo+"&cls=invoice",
        method: "POST",
        headers: {
          securityToken: $stateParams.securityToken
        }
      })
    }



    $scope.switchportalViews = function(switchedState) {
        $state.go(switchedState);
    };

    $scope.payObj = {

        "payment": {
            "lastTranDate": new Date(),
            "netAmount": "",
            "uAmount": "",
            "aAmount": "",
            "invoiceNo": "",
            "paymentComment": "",
            "paymentRef": "",
            "paymentMethod": "",
            "recievedAmount": "",
            "bankCharges": "",
            "favoriteStar": false,
            "favouriteStarNo": 1,
            "fullAmount": "",
            "receiptID": "",
            "paymentStatus": "active",
            "profileID": "1",
            "profileAddress": {
                "city": "",
                "state": "",
                "street": "",
                "zip": ""
            },
            "profileEmail": "",
            "profileName": "",
            "uploadImage": [],
            "customField": [],
            "pattern": "",
            "baseCurrency": "",
            "createDate": new Date(),
            "token": "",
            "paymentLog": {
                "userName": "",
                "lastTranDate": new Date(),
                "createDate": new Date(),
                "modifyDate": "",
                "createUser": "",
                "modifyUser": "",
                "UIHeight": "30px;",
                "type": "activity",
                "description": "payment added by",
                "status": "Active",
                "logID": ""
            }
        },
        "permissionType": "add",
        "appName": "Payments"

    }

    $scope.showPaymentPortalDialog = function(paymentMethod, ev) {
        

        hasBackdrop = false;

        if ($scope.paymentType == "Offline" && $scope.offlinePayments == "") {

            $mdDialog.show(
                $mdDialog.alert()
                .parent(angular.element(document.body))
                .title('This invoice only supports offline payments. Please change from settings Application. Thank You!')
                .content()
                .ariaLabel('Alert Dialog Demo')
                .ok('OK')
                .targetEvent()
                .hasBackdrop(false)
            );

        } else if ($scope.paymentType == "Offline" && $scope.offlinePayments !== null) {
            $mdDialog.show(
                $mdDialog.alert()
                .parent(angular.element(document.body))
                .title($scope.offlinePayments)
                .content()
                .ariaLabel('Alert Dialog Demo')
                .ok('OK')
                .targetEvent()
                .hasBackdrop(false)
            );
        } else {
            
            $mdDialog.show({
                    controller: DialogControllerOnlinePayment,
                    templateUrl: 'interactDialog.html',
                    targetEvent: ev,
                    clickOutsideToClose: true,
                    fullscreen: $scope.customFullscreen, // Only for -xs, -sm breakpoints.
                    locals: {
                        paymentMethod: paymentMethod,
                        payObj: $scope.payObj,
                        partialPaymentsAllowed: $scope.partialPaymentsAllowed,
                        exchangeRate: $scope.exchangeRate
                    }
                })
                .then(function() {
                    loadInvoiceData()
                }, function() {

                });

        }

    };

    function DialogControllerOnlinePayment($scope, $stateParams, $rootScope, $mdDialog, paymentMethod, payObj, $mdToast, partialPaymentsAllowed, exchangeRate) {
        console.log(payObj);
        console.log(exchangeRate);
        $scope.changecurrency = payObj.payment.changedCurrency;
        console.log($scope.changecurrency);
        $scope.paymentMethod = function(name) {

            if(name === 'stripe' || name === '2checkout'){
                $http({
                    url: "/services/duosoftware.process.service/process/validateCurrency?currency="+$scope.changecurrency+"&paymentMethod="+name,
                    method: "GET",
                    headers: {
                        securityToken: $stateParams.securityToken,
                    }
                }).then(function(response) {
                    console.log(response);
                    console.log(response.message);
                    debugger;
                    if (!response.data.data.availability) {
                        $scope.activePayment = ""; 
                        $scope.currencyValMsg = response.data.message;
                        $scope.currencyValidate = true; 
                        return false;
                    }
                    else{
                        $scope.currencyValidate = false; 
                    }


                }, function(response) {
                    debugger;
                    $scope.activePayment = "";
                    $scope.currencyValMsg = 'Seems like there is a problem in the payment gateway service.please try again later';
                    $scope.currencyValidate = true; 
                    return false
                })

            }

            $scope.config = {
                publishKey: "pk_test_8FepS5OSLnghnaPfVED8Ixkx",
                title: '12thdoor',
                description: "for connected business",
                logo: 'img/small-logo.png',
                label: 'New Card',
            }
            if (name == 'stripe') {
                $http({
                    url: "/services/duosoftware.setting.service/setting/getPaymentKeys?appName=" + name,
                    method: "GET",
                    headers: {
                        securityToken: $stateParams.securityToken,
                        jwt: $stateParams.jwt
                    }
                }).then(function(response) {
                    var data = response.data;
                    if (data)
                        $scope.publishKey = data.publishable_key.replace('\\u000', '')
                    $scope.config = {
                        publishKey: $scope.publishKey,
                        title: '12thdoor',
                        description: "for connected business",
                        logo: 'img/small-logo.png',
                        label: 'New Card',
                    }
                }, function(response) {

                })
            }

        }

        function activeStripePayment(ev){
            
            $rootScope.$broadcast("call_stripe", ev, $scope.config, function() {

            })
            $scope.$on('stripe-token-received', function(event, response) {
                console.log(response);
                console.log(response.id)
                console.log(payObj);
                payObj.payment.token = response.id;
                
                savePayment(payObj);
            });
        }

        function active2checkoutPayment(payObj){
            debugger;
            console.log(payObj);

              $http({
                    url: "/services/duosoftware.setting.service/setting/connectedGateways",
                    method: "GET",
                    headers: {
                        securityToken: $stateParams.securityToken
                    }
                }).then(function(response) {
                    console.log(response);
                    var gatways = [];
                    var gatways = response.data.data;



                    for (var i = gatways.length - 1; i >= 0; i--) {
                        if(gatways[i].gateway == "2checkout"){
                            debugger;
                          var dataObj = {
                                "sid": gatways[i].accessKey,
                                customtokens:{jwt:$stateParams.jwt},
                                "url": "/services/duosoftware.process.service/process/singlePaymentUsingJWT",
                                sectrityToken:  $stateParams.securityToken,
                                currency_code: payObj.payment.changedCurrency,
                                return_url: "http://" + window.location.hostname + "/12thDoorPaymentPortal/#/exploredocument?guInv=" + $stateParams.guInv + "&securityToken=" + $stateParams.securityToken + "&jwt=" + $stateParams.jwt,
                                li_0_price: payObj.payment.recievedAmount,
                                domain: window.location.hostname,
                                orderId: $rootScope.invoiceDataMy.invoiceNo,
                                custompara: payObj
                            };
                            the2checkoutService.do2checkoutPayment(dataObj);

                        }   
                    };
                   
                }, function(response) {

                })

          
        }

        $scope.isDisabled = false;
        $scope.submit = function() {
            console.log(exchangeRate);

            $scope.isDisabled = true;
            payObj.payment.recievedAmount = parseFloat($scope.partialAmount);

            var balanceDuePay = parseFloat($scope.balanceDuePayment);
            payObj.payment.paymentMethod = $scope.activePayment;
            
            console.log(payObj);
            
            debugger;
            if(!$scope.partialAmount){
                
                $scope.checkpartialAmountNull="add Payment Amount";
            }
            else{
                debugger;

                if(partialPaymentsAllowed){
                debugger;
                if(payObj.payment.recievedAmount == 0.00){
                    var toast = $mdToast.simple()
                        .content('Payment Amount cannot equal or less than 0!')
                        .action('OK')
                        .highlightAction(false)
                        .position("top right");
                        $mdToast.show(toast).then(function() {

                    });
                }
                else{

                    if(payObj.payment.recievedAmount <= balanceDuePay){
                    debugger;
                    if ($scope.activePayment == "stripe") {
                         
                        activeStripePayment();
                    }
                    
                    if($scope.activePayment == "2checkout"){
                        active2checkoutPayment(payObj);

                    }
                    // else{
                    //     savePayment(payObj)
                    // }

                }
                else{
                    var toast = $mdToast.simple()
                        .content('Payment Amount less than or equal to Balance Due !')
                        .action('OK')
                        .highlightAction(false)
                        .position("top right");
                        $mdToast.show(toast).then(function() {

                    });
                }

                }

                
            }
            else{
                if(payObj.payment.recievedAmount == balanceDuePay){
                    if ($scope.activePayment == "stripe") {
                        
                        activeStripePayment();
                    }
                    debugger;
                    if($scope.activePayment == "2checkout"){
                        active2checkoutPayment(payObj);

                    }
                }
                else{
                    var toast = $mdToast.simple()
                        .content('Only Full Payments are allowed in this invoice!')
                        .action('OK')
                        .highlightAction(false)
                        .position("top right");
                        $mdToast.show(toast).then(function() {

                    });
                }
            }

            } 
        }

        function savePayment(payObj) {
            console.log(payObj);

            $http({
                // url: "/services/duosoftware.process.service/process/singlePayment",
                url: "/services/duosoftware.process.service/process/singlePaymentUsingJWT",
                method: "POST",
                data: payObj,
                headers: {
                    securityToken: $stateParams.securityToken,
                    jwt: $stateParams.jwt
                }
            }).then(function(response) {
                console.log(response)
                $scope.isDisabled = false;
                $mdDialog.hide();

                if (!response.data.status) {
                    if (response.data.isSuccess) {
                        var toast = $mdToast.simple()
                            .content('Thank you for your payment of ' + payObj.payment.changedCurrency + ' ' + payObj.payment.recievedAmount / exchangeRate + ' via stripe')
                            .action('OK')
                            .highlightAction(false)
                            .position("top right");
                        $mdToast.show(toast).then(function() {

                        });

                    } else {
                        $mdDialog.show($mdDialog.alert().parent(angular.element(document.body)).title('error occure ').content('error occure while connecting to stipe. please try again later').ariaLabel('').ok('OK').targetEvent());

                    }
                } else {
                    var toast = $mdToast.simple()
                        .content('Thank you for your payment of ' + payObj.payment.changedCurrency + ' ' + payObj.payment.recievedAmount / exchangeRate+ ' via stripe')
                        .action('OK')
                        .highlightAction(false)
                        .position("top right");
                    $mdToast.show(toast).then(function() {

                    });

                }

            }, function(response) {
                console.log(response)
                $scope.isDisabled = false;
                var toast = $mdToast.simple()
                    .content('Your payment was unsuccessful. Please try again!')
                    .action('OK')
                    .highlightAction(false)
                    .position("top right");
                $mdToast.show(toast).then(function() {

                });

            })
        }

        $scope.hide = function() {
            $mdDialog.hide();
        };

        $scope.cancel = function() {
            $mdDialog.cancel();
        };

        var loadSettingDataDialog = function() {

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
                $scope.activePayments = [];
                for (var i = 0; i < response.data[0].payments.length; i++) {
                    if (response.data[0].payments[i].activate == true) {
                        $scope.activePayments.push(response.data[0].payments[i]);

                    }
                }

                console.log($scope.activePayments);
                debugger;
                if($scope.activePayments.length == 0 ){
                            $scope.checkPayment = true;
                        }
                        else{
                            $scope.checkPayment = false;
                }
                // $scope.activePayments=response.data[0].payments;

            }, function(response) {
                console.log("error loading setting");
            })
        }

        loadSettingDataDialog();

        var loadInvoiceDataDialog = function() {

            $http({
                url: "/services/duosoftware.invoice.service/invoice/getJWTInvoiceByGUID?invoiceGUID=" + $stateParams.guInv,
                method: "GET",
                headers: {
                    securityToken: $stateParams.securityToken,
                    jwt: $stateParams.jwt
                }
            }).then(function(response) {
                console.log(response);

                response.data.subTotal = parseFloat(response.data.subTotal );
                response.data.netAmount = parseFloat(response.data.netAmount);
                response.data.shipping = parseFloat(response.data.shipping);
                $scope.exchangeRate = response.data.exchangeRate;

                console.log(response.data);

                var calculateDis = 0;
                var totalDiscount = 0;
                var subT = 0
                var itemPrice = 0;

                var products = [];
                products = angular.copy(response.data.invoiceLines)
                for (var i = products.length - 1; i >= 0; i--) {

                    products[i].price = parseFloat(products[i].price * response.data.exchangeRate).toFixed(2);

                    subT += parseFloat(products[i].price * products[i].quantity);
                    response.data.subTotal = parseFloat(subT).toFixed(2);
                    products[i].amount = parseFloat(products[i].price * products[i].quantity).toFixed(2);
                    totalDiscount += parseFloat(subT * products[i].discount / 100);
                    response.data.discountAmount = parseFloat(totalDiscount).toFixed(2);

                    if (response.data.taxAmounts.length >= 1) {
                        for (var i = response.data.taxAmounts.length - 1; i >= 0; i--) {
                            response.data.taxAmounts[i].salesTax = parseFloat(response.data.taxAmounts[i].salesTax * response.data.exchangeRate)
                        }
                    }

                    var tot = 0;
                    var paid = 0;
                    var paidAmount;
                    var getsin = 0;
                    for (var x = 0; x <= response.data.multiDueDates.length - 1; x++) {
                        getsin = parseFloat(response.data.multiDueDates[x].balance);
                        var singlebalance = parseFloat(response.data.netAmount - getsin).toFixed(2);
                        //$scope.balanceDuePayOnline=singlebalance;

                        if (response.data.peymentTerm != 'multipleDueDates') {

                            var balanceDue = parseFloat(response.data.multiDueDates[x].balance).toFixed(2);
                            $scope.balanceDuePayOnline = balanceDue ;
                            $scope.balanceDuePayment = parseFloat($scope.balanceDuePayOnline / response.data.exchangeRate).toFixed(2);
                            $scope.balanceDue = balanceDue;

                            //$scope.paidAmount = response.data.multiDueDates[x].paidAmount;
                            $scope.paidAmount += parseFloat(response.data.multiDueDates[x].dueDatePrice - response.data.multiDueDates[x].balance);
                        } else {

                            tot += parseFloat(response.data.multiDueDates[x].balance);

                            paidAmount += parseFloat(response.data.multiDueDates[x].dueDatePrice - response.data.multiDueDates[x].balance);
                            paid = parseFloat(paidAmount).toFixed(2);
                            var calBalance = parseFloat(tot).toFixed(2);

                            $scope.paidAmount = paid;
                            $scope.balanceDue = calBalance;
                            $scope.balanceDuePayOnline = calBalance;
                            $scope.balanceDuePayment = parseFloat($scope.balanceDuePayOnline / response.data.exchangeRate).toFixed(2);

                        }

                        if($scope.balanceDue == "0.00" ){
                            $scope.checkPayment = true;
                        }
                        else{
                            $scope.checkPayment = false;
                        }
                    }
                }
                // }

                //$scope.balanceDuePayOnline =singlebalance;

                // $scope.balanceDuePayOnline=(response.data.netAmount-response.data.multiDueDates.);
                $scope.defaultPaymentMethod = response.data.paymentMethod;

            }, function(response) {

            })

        }

        loadInvoiceDataDialog();

    }

}]);

p_payment_portal_module.filter('datetime', function($filter) {
    return function(input) {
        if (input == null) {
            return "";
        }

        var _date = $filter('date')(new Date(input), 'yyyy/MM/dd');
        return _date.toUpperCase();

    };
});

p_payment_portal_module.filter('toDateObject', toDateObject);

function toDateObject($filter) {
    return function(value) {
      var datenow = moment(value);

      if(datenow.isValid){
        var tempDate = new Date(datenow);
        return $filter('date')(tempDate, 'MMM d, y');
      }
    };
}

p_payment_portal_module.directive('msAddressComponent', msAddressComponent);
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

p_payment_portal_module.factory('AddressService', Address);
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

p_payment_portal_module.directive('rasmNumonly', rasmNumonly);

    function rasmNumonly(){
        var directive = {
            require: 'ngModel',
            link : linkFunc
        }

        return directive;

        function linkFunc(scope, element, attr, ngModelCtrl){
            function fromUser(text) {
                var transformedInput = text.replace(/[^0-9.]/g, ''); 
                    if(transformedInput !== text) {
                        ngModelCtrl.$setViewValue(transformedInput);
                        ngModelCtrl.$render();
                    }
                    return transformedInput;  // or return Number(transformedInput)
                }
            ngModelCtrl.$parsers.push(fromUser);
        }
    }

p_payment_portal_module.directive('format', format);

    function format($filter){
        return {
            require: '?ngModel',
            restrict : 'A',
            scope : {
            format : '='
            },
            link: function (scope, elem, attrs, ctrl) {
                if (!ctrl) return;
                setVal();
                function setVal(){
                ctrl.$formatters.unshift(function (a) {
                    if(scope.format == undefined)
                    {
                        return ( scope.format + ctrl.$modelValue)
                    }
                    else
                    {
                        return ( scope.format +" "+ ctrl.$modelValue)
                    }
                
                });
                elem.bind('blur', function(event) {
                var plainNumber = elem.val().replace(/[^\d|\-+|\.+]/g, '');
                elem.val (scope.format + plainNumber);
                });
                }
            }
        };
    }

   p_payment_portal_module.factory('the2checkoutService', the2checkoutService);

  function the2checkoutService($rootScope)
    {
        //.module('app.invoices')
        //url:data.domain+"/services/duosoftware.process.service/process/singlePayment",
        return { 
            do2checkoutPayment: function(data) { 
                var jsonstringpara = JSON.stringify(data.custompara);
                jsonstringpara = jsonstringpara.replace(/"/g, '<&#39;>');

                var jsonstringcus_tokens = JSON.stringify(data.customtokens);
                jsonstringcus_tokens = jsonstringcus_tokens.replace(/"/g, '<&#39;>');

                //
                var data = {
                    url:data.domain+data.url,
                    sid: data.sid,
                    mode: "2CO",
                    currency_code: data.currency_code,
                    lang: 'en',
                    demo: "Y",
                    customtokens:jsonstringcus_tokens,
                    returncustom_url:data.return_url,
                    li_0_name:data.orderId,
                    custompara:jsonstringpara,
                    li_0_token:data.sectrityToken,
                    li_0_price:""+data.li_0_price,
                    li_0_quantity:'1',
                    li_0_tangible:'N',
                    domain:data.domain.replace("http://", ""),
                    merchant:"12thdor.com",
                    quTranId:"12345",
                    paypal_direct:"N",
                    x_receipt_link_url:"http://" + window.location.hostname + "/services/duosoftware.ipn.service/2checkout_ipn.php",
                    orderId:data.orderId};

                    var form = $('<form/></form>');
                    form.attr("action", "https://sandbox.2checkout.com/checkout/purchase");
                    form.attr("method", "POST");
                    form.attr("target", "tco_lightbox_iframe");
                    form.attr("style", "display:none;");
                    
                    $.each(data, function (name, value) {
                            if (value != null) {
                                var input = $("<input></input>").attr("type", "hidden").attr("name", name).val(value);
                                form.append(input);
                            }
                        });

                    $("body").append(form);
                    $('.tco_lightbox').remove();

                    $.getScript( "https://www.2checkout.com/static/checkout/javascript/direct.min.js", function( data, textStatus, jqxhr ) {
                        setTimeout(function() {
                            form.submit();
                            form.remove();
                        }, 1000);
                    });
                return
            }

        }
    }    




