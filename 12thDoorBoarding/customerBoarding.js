// 'use strict';
var p_boarding_module = angular.module("platformBoardingModule", ["ui.router", "ngAnimate", "uiMicrokernel", "ngMaterial", "ngMessages", "ccPackage"]);
//Platform entry theme resgister
p_boarding_module.config(function ($mdThemingProvider) {
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
        'contrastDarkColors': ['50', '100'
        , '200', '300', '400', 'A100'],
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
        'contrastDarkColors': ['50', '100'
        , '200', '300', '400', 'A100'],
        'contrastLightColors': '7c7c7c'
    });
    $mdThemingProvider.theme('default').primaryPalette('12thDoorPrimary').accentPalette('12thDoorAccent').warnPalette('red');
    $mdThemingProvider.alwaysWatchTheme(true);
});
//Platform entry view route configuration - Start
p_boarding_module.config(['$stateProvider', '$urlRouterProvider', function ($sp, $urp) {
    $urp.otherwise('/main');
    $sp.state('main', {
        url: '/main',
        templateUrl: 'main-partial.php',
        controller: 'boarding-main-ctrl'
    }).state('createcompany', {
        url: '/createcompany',
        templateUrl: 'createcompany-partial.php',
        controller: 'boarding-createcompany-ctrl'
    }).state('joincompany', {
        url: '/joincompany',
        templateUrl: 'joincompany-partial.php',
        controller: 'boarding-joincompany-ctrl'
    });
}]);
//Platform entry view route configuration - End
p_boarding_module.controller("boarding-parent-ctrl", ["$scope", "$state", "$location", function ($scope, $state, $location) {
    $scope.navigateJoinCompanyProcess = function () {
        $state.go('joincompany');
    };
    $scope.navigateCreateCompanyProcess = function () {
        $state.go('createcompany');
    };
    $scope.navigateCustomerBoardingProcess = function () {
        $state.go('main');
    };
}]);
//Platform boarding view main controller - start
p_boarding_module.controller("boarding-main-ctrl", ["$scope", function ($scope) {}]);
//Create company view Controller - Start
p_boarding_module.controller("boarding-createcompany-ctrl", ["$window", "$scope", "$http", "$state", "$location", "$mdDialog", "$helpers", "ccPackageService", function ($window, $scope, $http, $state, $location, $mdDialog, $helpers, ccPackageService) {
    
    $scope.createCompanySuccess = false;
    
    $scope.hostedDomain = $window.location.host;
    
    $scope.businessType = [];
    
    $scope.companyLocation = [];
    
    $scope.createCompanyDetails = {
        "TenantID": "",
        "TenantType": "default",
        "Name": "",
        "Shell": "shell/index.html#/duoworld-framework/dock",
        "Statistic": {
            "DataDown": "1GB",
            "DataUp": "1GB",
            "NumberOfUsers": "1"
        },
        "Private": true,
        "OtherData": {
            "CompanyType": "",
            "CompanyLocation": "",
            "LocationCode": "",
            "Currency": ""
        }
    };
    
    var defaultPlanConfiguration = {
            "tenantId": "",
            "planCode": "12_pkg_personal"
        };

    $scope.loadBusinessType = function () {
        console.log(defaultPlanConfiguration);
        $http.get('data/business.json').
        success(function (data, status, headers, config) {
            $scope.businessType = data;
        }).
        error(function (data, status, headers, config) {
            console.log('cant load business types !');
        });
    };

    $scope.loadLocations = function () {
        var domain = window.location.host;
        $http.get('http://' + domain + '/apis/utility/country/list').
        success(function (data, status, headers, config) {
            console.log(data);
            $scope.companyLocation = data.data;
        }).
        error(function (data, status, headers, config) {
            console.log('cant load countries !');
        });
    };

    $scope.loadLocations();

    $scope.getCurrencyFor = function (code) {
        var domain = window.location.host;
        $http.get('http://' + domain + '/apis/utility/currency/' + code).
        success(function (data, status, headers, config) {
            console.log(data);
            $scope.createCompanyDetails.OtherData.Currency = data.data.currency_code;
            $scope.createCompanyDetails.OtherData.LocationCode = code;
        }).
        error(function (data, status, headers, config) {
            console.log('cant load currencies !');
        });
    }

    $scope.loadCurrencies = function () {
        var domain = window.location.host;
        $http.get('http://' + domain + '/apis/utility/currency/list').
        success(function (data, status, headers, config) {
            console.log(data);
            $scope.currencies = data.data;
        }).
        error(function (data, status, headers, config) {
            console.log('cant load countries !');
        });
    };

    $scope.loadCurrencies();

    $scope.submitCreateCompanyDetails = function (createCompanyDetails) {

        defaultPlanConfiguration.tenantId = $scope.createCompanyDetails.TenantID+"."+$window.location.host;
        console.log(defaultPlanConfiguration.tenantId);

        var payload = angular.toJson(createCompanyDetails);
        console.log(payload);

        displaycreateCompanyDetailsSubmissionProgress();
        $http({
            method: 'POST',
            url: '/apis/usertenant/tenant/',
            headers: {
                'Content-Type': 'application/json'
            },
            data: payload
        }).success(function (data, status, headers, config) {
            $mdDialog.hide();
            console.log(data);
            if (data.Success === true) {
                displaycreateCompanyDetailsSubmissionSuccess(data.Message);
                ccPackageService.setSubscriptionPlan(defaultPlanConfiguration)
                    .then(function(response){
                        console.log(response);
                        $mdDialog.hide();
                        redirectionSuccess(data);
                        // resetFormPrestine();   
                    },function(data){
                        console.log(data);
                        $mdDialog.hide();
                    });
            } else {
                displaycreateCompanyDetailsSubmissionError(data.Message);
                // resetFormPrestine();   
            }
        }).error(function (data) {
            $mdDialog.hide();
            displaycreateCompanyDetailsSubmissionError('Sorry, we are having problems creating your company at this moment. Please try again later.');
            resetFormPrestine();
        });
    };


    var redirectionSuccess = function (tennantInfo) {
        var tennantDomain = tennantInfo.Data.TenantID;
        var platformRedirectLink = $window.location.protocol + "//" + tennantDomain;
        location.replace(platformRedirectLink);
        console.log(tennantRedirectLinkConstruct);
    };
    var resetFormPrestine = function () {
        $scope.createCompanyDetails = {};
        // $scope.joinCompanyForm.$setPristine();
    };
    var defaultDataInjection = function (data) {
        data.TenantID = data.TenantID;
        return data;
    };
    var displaycreateCompanyDetailsSubmissionError = function (message) {
        $mdDialog.show($mdDialog.alert().parent(angular.element(document.body)).clickOutsideToClose(true).title('Failed to create company !').textContent('' + message + '').ariaLabel('Failed to create company.').ok('Got it!'));
    };
    var displaycreateCompanyDetailsSubmissionSuccess = function (message) {
        $mdDialog.show($mdDialog.alert().parent(angular.element(document.body)).clickOutsideToClose(true).title('Company created successfully !').textContent('' + message + '').ariaLabel('Company created successfully !').ok('Got it!'));
    };
    var displaycreateCompanyDetailsSubmissionProgress = function () {
        $mdDialog.show({
            template: '<md-dialog ng-cloak>' + '   <md-dialog-content>' + '       <div style="height:auto; width:auto; padding:10px;" class="loadInidcatorContainer" layout="row" layout-align="start center">' + '           <md-progress-circular class="md-primary" md-mode="indeterminate" md-diameter="40"></md-progress-circular>' + '           <span>Submitting your company details, please wait...</span>' + '       </div>' + '   </md-dialog-content>' + '</md-dialog>',
            parent: angular.element(document.body),
            clickOutsideToClose: false
        });
    };
    // $scope.switchEntryView = function(stateinchange){
    // 	$state.go(''+stateinchange+'');
    // };
}]);
//Create company view Controller - End
//Join company view Controller - Start
p_boarding_module.controller("boarding-joincompany-ctrl", ["$window", "$scope", "$compile", "$http", "$state", "$location", "$mdDialog", "$mdMedia", function ($window, $scope, $compile, $http, $state, $location, $mdDialog, $mdMedia) {
    $scope.joinCompanySuccess = false;
    $scope.joinCompanyDetails = {};
    $scope.submitJoinCompanyDetails = function (joinCompanyDetails) {
        console.log(joinCompanyDetails);
        // var payload = angular.toJson(joinCompanyDetails);
        displayjoinRequestSubmissionProgress();
        $http({
            method: 'GET',
            url: '/apis/usertenant/tenant/subscribe/'+joinCompanyDetails.CompanyDomain+''
            // headers: {
            //     'Content-Type': 'application/json'
            // },
            // data: payload
        }).success(function (data, status, headers, config) {
            $mdDialog.hide();
            console.log(data);
            if (data.Success === false) {
                displayjoinRequestSubmissionError('Sorry, we are having problems processing your request. Please try again later.');
                resetFormPrestine();
            } else {
                displayJoinCompanySuccess('Request successfully sent');
                $scope.joinCompanySuccess = true;
                resetFormPrestine();
            }
        }).error(function (data) {
            $mdDialog.hide();
            displayjoinRequestSubmissionError('Sorry, we are having problems processing your request. Please try again later.');
            resetFormPrestine();
        });
    };
    var resetFormPrestine = function () {
        $scope.joinCompanyDetails = {};
        console.log($scope.joinCompanyDetails);
        // $scope.joinCompanyForm.$setPristine();
    };

    var displayJoinCompanySuccess = function (message) {
        $mdDialog.show($mdDialog.alert().parent(angular.element(document.body)).clickOutsideToClose(true).title('Join Company !').textContent('' + message + '').ariaLabel('Company created successfully !').ok('Got it!'));
    };

    var displayjoinRequestSubmissionError = function (message) {
        $mdDialog.show($mdDialog.alert().parent(angular.element(document.body)).clickOutsideToClose(true).title('Failed to process your request !').textContent('' + message + '').ariaLabel('Request process error.').ok('Got it!'));
    };
    var displayjoinRequestSubmissionProgress = function () {
        $mdDialog.show({
            template: '<md-dialog ng-cloak>' + '	<md-dialog-content>' + '		<div style="height:auto; width:auto; padding:10px;" class="loadInidcatorContainer" layout="row" layout-align="start center">' + '			<md-progress-circular class="md-primary" md-mode="indeterminate" md-diameter="40"></md-progress-circular>' + '			<span>Submitting your request for an invite, please wait...</span>' + '		</div>' + '	</md-dialog-content>' + '</md-dialog>',
            parent: angular.element(document.body),
            clickOutsideToClose: false
        });
    };
}]);
//Join company view Controller - End