// 'use strict';

var p_entry_module = angular.module("platformEntryModule", ["ui.router", "ngAnimate", "uiMicrokernel", "ngMaterial", "ngMessages"]);

// p_entry_module.config(['$httpProvider', function ($httpProvider){
//  $httpProvider.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
//  $httpProvider.defaults.transformRequest.unshift(function (data, headersGetter) {
//      var key, result = [];

//      if (typeof data === "string")
//        return data;

//      for (key in data) {
//        if (data.hasOwnProperty(key))
//          result.push(encodeURIComponent(key) + "=" + encodeURIComponent(data[key]));
//      }
//      return result.join("&");
//  });
// }]);

//Platform entry theme resgister
p_entry_module.config(function ($mdThemingProvider) {

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
p_entry_module.config(['$stateProvider', '$urlRouterProvider', function ($sp, $urp) {
    $urp.otherwise('/signin');
    $sp
    .state('signin', {
        url: '/signin?activated',
        templateUrl: 'signin-partial.html',
        controller: 'platformEntry-signin-ctrl'
    })
    .state('signup', {
        url: '/signup?email&code',
        templateUrl: 'signup-partial.html',
        controller: 'platformEntry-signup-ctrl'
    })
    .state('signup-verify', {
        url: '/verify',
        templateUrl:'signup-verify-partial.html',
        controller: 'platformEntry-signup-verify-ctrl'
    })
    .state('forgotpassword', {
        url: '/forgotpassword',
        templateUrl: 'forgotpassword-partial.html',
        controller: 'platformEntry-forgotpassword-ctrl'
    })
    .state('resetpassword',{
        url: '/resetpassword/?token',
        templateUrl: 'resetpassword-partial.html',
        controller: 'platformEntry-resetpassword-ctrl'
    });
}]);
//Platform entry view route configuration - End


//Platform entry view main controller - start
p_entry_module.controller("platformEntry-main-ctrl", ["$scope", function ($scope) {
    console.log('12thDoor Entry Module : v1.0.5');
}]);

//Sign in view Controller - Start
p_entry_module.controller("platformEntry-signin-ctrl", ["$window", "$scope", "$http", "$state", "$location", "$mdDialog", "$stateParams", function ($window, $scope, $http, $state, $location, $mdDialog, $stateParams) {

    if ($stateParams.activated) {
        //console.log($stateParams.activated);
        $scope.activated = $stateParams.activated;
    } else {
        $scope.activated = false;
    }

    $scope.signindetails = {};

    var platformRedirectLink = $window.location.protocol + "//" + $window.location.host + "/";

    var authorizationSuccessFull = function () {
        location.replace(platformRedirectLink);
    };

    var clearSigninDetails = function () {
        $scope.signindetails = {};
    };

    var displaySigninCredentialsError = function () {
        $mdDialog.show(
            $mdDialog.alert()
            .parent(angular.element(document.body))
            .clickOutsideToClose(true)
            .title('Incorrect username or password !')
            .textContent('seems like your credentials are incorrect, please try again.')
            .ariaLabel('Signin error.')
            .ok('Got it!')
            );
    };

    var displaySigninSubmissionProgression = function () {
        $mdDialog.show({
            template: '<md-dialog ng-cloak>' +
            '   <md-dialog-content>' +
            '       <div style="height:auto; width:auto; padding:10px;" class="loadInidcatorContainer" layout="row" layout-align="start center">' +
            '           <md-progress-circular class="md-primary" md-mode="indeterminate" md-diameter="60"></md-progress-circular>' +
            '           <span>Authenticating, please wait...</span>' +
            '       </div>' +
            '   </md-dialog-content>' +
            '</md-dialog>',
            parent: angular.element(document.body),
            clickOutsideToClose: false
        });
    };

    $scope.submitSigninDetails = function () {
        var payload = angular.toJson($scope.signindetails);

        console.log(payload);

        displaySigninSubmissionProgression();

        $http({
            method: 'POST',
            
            url: '/apis/authorization/userauthorization/login',
            headers: {
                'Content-Type': 'application/json'
            },
            data: payload
        })
        .success(function (data) {
            $mdDialog.hide();
            if (data.Success === false) {
                displaySigninCredentialsError();
                clearSigninDetails();
            } else {
                authorizationSuccessFull();
            }
            console.log(data);
        })
        .error(function (data) {
            console.log(data);
            $mdDialog.hide();
        });
    };

    $scope.socialSignin = function(socialLink){ 

        switch(socialLink){
            case 'facebook':
                location.replace(platformRedirectLink+'/signup/facebookRegister');
                break;
            case 'twitter':
                location.replace(platformRedirectLink+'/signup/twitterRegister/?connect=twitter');
                break;
            case 'google':
                location.replace(platformRedirectLink+'/signup/googlePlusRegister');
                break;
        }
    };

    $scope.switchEntryView = function (stateinchange) {
        $state.go('' + stateinchange + '');
    };

}]);
//Sign in view Controller - End

//Sign up view Controller - Start
p_entry_module.controller("platformEntry-signup-ctrl", ["$rootScope","$window", "$scope", "$http", "$state", "$location", "$mdDialog", "$mdMedia", "$stateParams", function ($rootScope, $window, $scope, $http, $state, $location, $mdDialog, $mdMedia, $stateParams) {

    $scope.signupdetails = {};

    $scope.signupsuccess = false;

    var platformRedirectLink = $window.location.protocol + "//" + $window.location.host + "/";

    var getUserEmailDomain = function () {
        var val = $scope.signupdetails.EmailAddress;
        return val.substr(val.indexOf("@") + 1);
    };

    if($stateParams.email && $stateParams.code) {
        $scope.isinvited = true;
        $scope.signupdetails.EmailAddress = $stateParams.email;
    }

    // $scope.locateUserEmail = function(){
    //  location.replace("http://www."+getUserEmailDomain());
    // };

    var displaySignupDetailsError = function (message) {
        $mdDialog.show(
            $mdDialog.alert()
            .parent(angular.element(document.body))
            .clickOutsideToClose(true)
            .title('Incorrect registration details !')
            .textContent('' + message + '')
            .ariaLabel('Signup error.')
            .ok('Got it!')
            );
    };

    var displaySignupSubmissionProgression = function () {
        $mdDialog.show({
            template: '<md-dialog ng-cloak>' +
            '   <md-dialog-content>' +
            '       <div style="height:auto; width:auto; padding:10px;" class="loadInidcatorContainer" layout="row" layout-align="start center">' +
            '           <md-progress-circular class="md-primary" md-mode="indeterminate" md-diameter="40"></md-progress-circular>' +
            '           <span>Submitting your details, please wait...</span>' +
            '       </div>' +
            '   </md-dialog-content>' +
            '</md-dialog>',
            parent: angular.element(document.body),
            clickOutsideToClose: false
        });
    };

    var displaySignupDetailsSuccess = function (message) {
        $mdDialog.show(
            $mdDialog.alert()
            .parent(angular.element(document.body))
            .clickOutsideToClose(true)
            .title('Registration details !')
            .textContent('' + message + '')
            .ariaLabel('Signup success.')
            .ok('Got it!')
            );
    };


    var registerUser = function(payload) {
        return $http({
            method: 'POST',
            url: '/apis/authorization/userauthorization/userregistration',
            headers: {'Content-Type':'application/json'},
            data: payload
        });
    } 

    var joinToTenant = function(email, token) {
        return $http({
            method: 'GET',
            url: '/apis/usertenant/tenant/request/accept/' + email + '/' + token,
            headers: {'Content-Type':'application/json'},
        });
    }

    var addConfirmPasswordString = function () {
        $scope.signupdetails['ConfirmPassword'] = $scope.signupdetails.Password;
    };

    $scope.submitSignupDetails = function () {

        console.log(getUserEmailDomain());

        addConfirmPasswordString();

        var payload = angular.toJson($scope.signupdetails);

        console.log(payload);

        displaySignupSubmissionProgression();

        /*
            $http({
                method: 'POST',
                url: '/apis/authorization/userauthorization/userregistration',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: payload
            })
            .success(function (data) {
                $mdDialog.hide();
                console.log(data);
                if (data.Success === false) {
                    displaySignupDetailsError(data.Message);
                } else {
                    displaySignupDetailsSuccess(data.Message);
                    $rootScope.signupemail = $scope.signupdetails.EmailAddress;
                    $state.go('signup-verify');
                }

            })
            .error(function (data) {
                $mdDialog.hide();
                console.log(data);
                $scope.signupsuccess = true;
            });
        */

        registerUser(payload).success(function(response) { // register a user
            if(response.Success) { // user registration success
                if($scope.isinvited) { //user invited for a tenant
                    joinToTenant(payload.EmailAddress, $stateParams.code).success(function(response) { // bind user to the invited tennt
                        $mdDialog.hide();
                        if(response.Success) {// invitation accepted
                            //displaySignupDetailsSuccess(response.Message);
                            $rootScope.signupemail = $scope.signupdetails.EmailAddress;
                            $state.go('signup-verify');
                        }
                        else
                            displaySignupDetailsError(response.Message); // display signup error
                    }).error(function(error) {
                        console.log(error);
                    });
                } else {
                    $mdDialog.hide();
                    //displaySignupDetailsSuccess(response.Message);
                    $rootScope.signupemail = $scope.signupdetails.EmailAddress;
                    $state.go('signup-verify');
                }
            } else {
                $mdDialog.hide();
                displaySignupDetailsError(response.Message);
            }
        }).error(function(error) {
            console.log(error);
        });

    };

    $scope.socialSignup = function(socialLink){ 

        switch(socialLink){
            case 'facebook':
                location.replace(platformRedirectLink+'/signup/facebookRegister');
                break;
            case 'twitter':
                location.replace(platformRedirectLink+'/signup/twitterRegister/?connect=twitter');
                break;
            case 'google':
                location.replace(platformRedirectLink+'/signup/googlePlusRegister');
                break;
        }
    };

    $scope.switchEntryView = function (stateinchange) {
        $state.go('' + stateinchange + '');
    };
}]);
//Sign up view Controller - End

//Sign up verify Controller - Start
p_entry_module.controller("platformEntry-signup-verify-ctrl",["$window", "$scope", "$state", function (){

}]);
//Sign up verify Controller - End

//Forgot Password View Controller - Start
p_entry_module.controller("platformEntry-forgotpassword-ctrl", ["$window", "$scope", "$http", "$state", "$location", "$mdDialog", "$mdMedia", function ($window, $scope, $http, $state, $location, $mdDialog, $mdMedia) {

    $scope.forgotpassworddetails = {};

    $scope.forgotPasswordSucess = false;

    var displayForgetPasswordError = function (message) {
        $mdDialog.show(
            $mdDialog.alert()
            .parent(angular.element(document.body))
            .clickOutsideToClose(true)
            .title('Error')
            .textContent('' + message + '')
            .ariaLabel('forget password error.')
            .ok('Got it!')
            );
    };

    var displayForgetPasswordSubmissionProgression = function () {
        $mdDialog.show({
            template: '<md-dialog ng-cloak>' +
            '   <md-dialog-content>' +
            '       <div style="height:auto; width:auto; padding:10px;" class="loadInidcatorContainer" layout="row" layout-align="start center">' +
            '           <md-progress-circular class="md-primary" md-mode="indeterminate" md-diameter="40"></md-progress-circular>' +
            '           <span>Submitting your request, please wait...</span>' +
            '       </div>' +
            '   </md-dialog-content>' +
            '</md-dialog>',
            parent: angular.element(document.body),
            clickOutsideToClose: false
        });
    };

    var displayForgetPasswordSuccess = function (message) {
        $mdDialog.show(
            $mdDialog.alert()
            .parent(angular.element(document.body))
            .clickOutsideToClose(true)
            .title('Success')
            .textContent('' + message + '')
            .ariaLabel('forget password success.')
            .ok('Got it!')
            );
    };

    $scope.submitForgotPasswordDetails = function(){

        domainHost = $window.location.protocol + "//" + $window.location.host;

        displayForgetPasswordSubmissionProgression();

        console.log(domainHost);

        $http.get(domainHost+"/auth/RequestResetPassword/"+$scope.forgotpassworddetails.email)
            .success(function(data,status){
                console.log(data, status);
                $mdDialog.hide();
                $scope.forgotPasswordSucess = true;
                displayForgetPasswordSuccess('Your request to reset your password was successfull. await an email with instructions.');
            })
            .error(function(data,status){
                $mdDialog.hide();
                if(data){
                    if(data.Status === false){
                        displayForgetPasswordError(data.Message);
                    }
                }else{
                    displayForgetPasswordError('Unable to process request to reset your password, please try again later.');
                }
            });
    };

}]);
//Forgot Password View Controller - End

//Reset Password View Controller - Start
p_entry_module.controller("platformEntry-resetpassword-ctrl", ["$window", "$scope", "$http", "$state", "$stateParams", "$location", "$mdDialog", "$mdMedia", function ($window, $scope, $http, $state, $stateParams, $location, $mdDialog, $mdMedia) {

    $scope.resetpassworddetails = {};

    $scope.resetPasswordSucess = false;

    console.log($stateParams);

    var displayResetPasswordError = function (message) {
        $mdDialog.show(
            $mdDialog.alert()
            .parent(angular.element(document.body))
            .clickOutsideToClose(true)
            .title('Error')
            .textContent('' + message + '')
            .ariaLabel('reset password error.')
            .ok('Got it!')
            );
    };

    var displayResetPasswordSubmissionProgression = function () {
        $mdDialog.show({
            template: '<md-dialog ng-cloak>' +
            '   <md-dialog-content>' +
            '       <div style="height:auto; width:auto; padding:10px;" class="loadInidcatorContainer" layout="row" layout-align="start center">' +
            '           <md-progress-circular class="md-primary" md-mode="indeterminate" md-diameter="40"></md-progress-circular>' +
            '           <span>Submitting your request, please wait...</span>' +
            '       </div>' +
            '   </md-dialog-content>' +
            '</md-dialog>',
            parent: angular.element(document.body),
            clickOutsideToClose: false
        });
    };

    var displayResetPasswordSuccess = function (message) {
        $mdDialog.show(
            $mdDialog.alert()
            .parent(angular.element(document.body))
            .clickOutsideToClose(true)
            .title('Success')
            .textContent('' + message + '')
            .ariaLabel('reset password success.')
            .ok('Got it!')
            );
    };

    $scope.switchEntryView = function (stateinchange) {
        $state.go('' + stateinchange + '');
    };

    $scope.submitResetPasswordDetails = function(){

        displayResetPasswordSubmissionProgression();

        domainHost = $window.location.protocol + "//" + $window.location.host;
        refToken = $stateParams.token;

        $http.get(domainHost+"/auth/ResetPassword/"+$scope.resetpassworddetails.Password+"/"+refToken)
            .success(function(data,status){
                $mdDialog.hide();
                if(data.Status === false && data.Message === "Error : No such Token exists"){
                    displayResetPasswordError('Seems like we had some trouble processing your request to reset your password, please send us a another request.');
                    $state.go('forgotpassword');
                }else{
                    $scope.resetPasswordSucess = !$scope.resetPasswordSucess;
                    displayResetPasswordSuccess('You have successfully reset your password, you can now access 12thDoor with your new password.');
                }
            })
            .error(function(data,status){
                $mdDialog.hide();
                displayResetPasswordError('Unable to process request to reset your password, please try again later.');
            });
    };
}]);
//Reset Password View Controller - End

//Password Strength Directive - Start
p_entry_module.directive('passwordStrengthIndicator', passwordStrengthIndicator);

function passwordStrengthIndicator() {
    return {
        restrict: 'A',
        require: 'ngModel',
        scope: {
            ngModel: '='
        },
        link: function (scope, element, attrs, ngModel) {

        scope.strengthText = "";

        var strength = {
            measureStrength: function (p) {
                var _passedMatches = 0;
                var _regex = /[$@&+#-/:-?{-~!^_`\[\]]/g;
                    if (/[a-z]+/.test(p)) {
                        _passedMatches++;
                    }
                    if (/[A-Z]+/.test(p)) {
                        _passedMatches++;
                    }
                    if (_regex.test(p)) {
                        _passedMatches++;
                    }
                    return _passedMatches;
                }
            };

            var indicator = element.children();
            var dots = Array.prototype.slice.call(indicator.children());
            var weakest = dots.slice(-1)[0];
            var weak = dots.slice(-2);
            var strong = dots.slice(-3);
            var strongest = dots.slice(-4);

            element.after(indicator);

            var listener = scope.$watch('ngModel', function (newValue) {
                angular.forEach(dots, function (el) {
                    el.style.backgroundColor = '#EDF0F3';
                });
                if (ngModel.$modelValue) {
                    var c = strength.measureStrength(ngModel.$modelValue);
                    if (ngModel.$modelValue.length > 7 && c > 2) {
                        angular.forEach(strongest, function (el) {
                            el.style.backgroundColor = '#039FD3';
                            scope.strengthText = "is very strong";
                        });

                    } else if (ngModel.$modelValue.length > 5 && c > 1) {
                        angular.forEach(strong, function (el) {
                            el.style.backgroundColor = '#72B209';
                            scope.strengthText = "is strong";
                        });
                    } else if (ngModel.$modelValue.length > 3 && c > 0) {
                        angular.forEach(weak, function (el) {
                            el.style.backgroundColor = '#E09015';
                            scope.strengthText = "is weak";
                        });
                    } else {
                        weakest.style.backgroundColor = '#D81414';
                        scope.strengthText = "is very weak";
                    }
                }
            });

            scope.$on('$destroy', function () {
                return listener();
            });
        },
        template: '<span id="password-strength-indicator"><span></span><span></span><span></span><span></span><md-tooltip>password strength {{strengthText}}</md-tooltip></span>'
    };
}
//Password Strength Directive - End
