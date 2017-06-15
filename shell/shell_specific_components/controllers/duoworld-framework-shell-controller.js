// duoworld-framework-shell-ctrl.js

(function () {

    var duoWorldFrameworkShellCtrl = function ($rootScope, $scope, $state, $http, $location, $window, $mdMedia, $mdSidenav, $mdDialog, $mdToast, $presence, $auth, $apps, $v6urls, $helpers, $objectstore, ccPackageService, tenantContextService, $timeout) {

        /*Framework Shell Initialization Components Block - Start*/
        //Define Initialization Variables block start
        $rootScope.shellConfig = {}; //framework configuration
        var isLoggedIn = false; //framework logged in default status
        var dwLoadingFrameIndicator = angular.element('.dw-loadingFrame');
        $scope.selectedTennantID = document.domain; //framework tennant ID
        $rootScope.frameworkShellSecurityToken = ""; //framwork shell security token
        $rootScope.dwFrameworkActiveApps = []; //framework active apps
        $rootScope.recivedTennantCollection = []; // framework recived tennant collection
        $scope.allApps = [];
        $rootScope.frameworkFavoriteApplication = [];
        $rootScope.currenttenantsessioninfo = [];
        $rootScope.defaultTenant;
        $rootScope.shellUserProfileSection = [];
        $rootScope.v6urls = $v6urls;
        $rootScope.opendAppIconUrl = "";
        $scope.searchBarRevealed = false;
        $scope.userWidgetContextToggle = true;
        $scope.joinCompanyToggle = true;
        $scope.userRestricted = false;
        $rootScope.currentPlanDetails;

        //stripe default configuration.

        var cc_package_checker = function(){
            ccPackageService.getSubscriptionPlan()
	        	.then(function(response){
                    console.log(response);
	            	$rootScope.currentPlanDetails = response.data.data;
                    console.log($rootScope.currentPlanDetails);    
	            });
        };

        cc_package_checker();

        /*utility function - start*/
        function isEmpty(obj) {
            for (var i in obj) {
                if (obj.hasOwnProperty(i)) {
                    return false;
                }
            }
            return true;
        };
        /*utility function - end*/

        //Define Initialization Functions block start
        var frameworkSessionCheck = function () {
            if ($auth.checkSession()) {
                isLoggedIn = true;
            } else {
                isLoggedIn = false;
            }
        };

        frameworkSessionCheck();

        var frameworkSessionLog = function () {
            if (isLoggedIn === true) {
                $state.go('dock');
                $rootScope.frameworkShellSecurityToken = $auth.getSecurityToken()
            } else {
                $state.go('unrecognized');
            }
        };

        frameworkSessionLog();

        var getFrameworkSessionInfo = function () {
            $rootScope.currenttenantsessioninfo = $auth.getSession();
            console.log($rootScope.currenttenantsessioninfo);
        };

        getFrameworkSessionInfo();

        var checkUserRestriction = function(){
            $http.get('/apis/permission/getrole/'+$rootScope.currenttenantsessioninfo.Email+'').
            success(function (data, status, headers, config) {
                if(data.roleName != "Super admin"){$scope.userRestricted = true;}else{$scope.userRestricted = false;}
            }).
            error(function (data, status, headers, config) {
                console.log('error in retriving permission !');
            });
        };

        checkUserRestriction();

        var retriveUserProfile = function () {
            // var userProfileInfo = $auth.getSession();

            // var client = $objectstore.getClient("duosoftware.com", "profile", true);

            // client.onGetOne(function (userProfileInfo) {
            //     console.log("user profile details");
            //     console.log(userProfileInfo);
            //     if (userProfileInfo) {
            //         $rootScope.shellUserProfileSection = userProfileInfo;
            //         console.log(userProfileInfo);
            //         $scope.getProfilePicture();
            //         bannerDecider();

            //     } else {

            //     }
            // });

            // client.onError(function (data) {
            //     // alert ("Error occured");
            // });

            // client.getByKey($auth.getUserName());

            
                //console.log(data);
                
            $http.get("http://" + window.location.hostname + "/apis/profile/userprofile/" + $rootScope.currenttenantsessioninfo.Email).success(function (data) {
                //console.log(data);
                $scope.content = data;
                $rootScope.content = data;
                //console.log(userData);
            }).error(function (data) {
                //console.log("error");
                //console.log(data);
                $rootScope.content = data;
                //console.log(userData);
            });
            $rootScope.profilePicture = "http://" + window.location.hostname + "/apis/media/profilepic/get/" + $rootScope.currenttenantsessioninfo.Email;
            console.log($rootScope.profilePicture);
             //$rootScope.profilePicture = "/apis/media/user/profilepictures/profile.jpg";
        };

        retriveUserProfile();

        var getDefaultShellConfig = function () {
            
            $http.get('shell_specific_components/local_data/shellconfiguration.json').
                success(function (data, status, headers, config) {
                    $rootScope.shellConfig = data;
                }).
                error(function (data, status, headers, config) {
                    console.log('error in retriving default shell configuration !');
                });
        };  

        getDefaultShellConfig();

        var saveShellConfiguratation = function () {
            $rootScope.shellConfig.username = $auth.getUserName();
            var client = $objectstore.getClient("shellconfig");
            client.onComplete(function (data) {
                console.log(data);
            });
            client.onError(function (data) {
                console.log(data);
            });
            client.insert($rootScope.shellConfig, {
                KeyProperty: "username"
            });

            console.log($rootScope.shellConfig);
        };

        var globalAppInfoPush = function () {
            for (var i = 0; i < $scope.allApps.length; i++) {
                var appTempRef = $scope.allApps[i];
                $rootScope.frameworkApplications.push({
                    applicationID: appTempRef.ApplicationID,
                    applicationTitle: appTempRef.Name,
                    applicationUri: "/duoworld-framework/launcher/customapps/" + appTempRef.ApplicationID + "/" + appTempRef.Name,
                    applicationIcoUri: "/images/appIcons/" + appTempRef.ImageId,
                    applicationDesription: appTempRef.Description
                });
            }
            console.log($rootScope.frameworkApplications);
        };

        $scope.revealSearchBar = function () {
            $scope.searchBarRevealed = !$scope.searchBarRevealed;
            var serachBoxInput = angular.element.find('.serachBox input');
        };

        $scope.getProfilePicture = function () {

            var client = $objectstore.getClient('duoworld.duoweb.info', "profilepictures", true);
            client.onGetOne(function (data) {
                if (data){
                    console.log(data);
                }
                //made the profile picture a rootscope variable, so it could be accessible from anywhere without another service call
                $rootScope.profilePicture = data.Body;
            });
            client.onError(function (data) {
                Toast("Error occured while fetching profile picture");
            });
            client.getByKey($auth.getUserName());
        };

        $scope.getBannerPicture = function () {
            var client = $objectstore.getClient('duoworld.duoweb.info', "coverPictures", true);
            client.onGetOne(function (data) {
                if (data){
                    $rootScope.banner = data.Body;
                }
                //console.log(data);
                //made the banner a rootscope  variable, so it could be accessible from anywhere without another service call
                if (data.Body == undefined) {
                    $rootScope.banner = "images/userassets/contactcoverimg/cover1.jpg";
                    $rootScope.hideObjectstoreBanner = true;
                };
            });
            client.onError(function (data) {
                Toast("Error occured while fetching Banner");
            });
            client.getByKey($auth.getUserName());
        };

        //$scope.getProfilePicture();

        function bannerDecider() {
            if ($rootScope.shellUserProfileSection.bannerPicture == undefined) {
                $rootScope.shellUserProfileSection.bannerPicture = "fromObjectStore";
            };

            if ($rootScope.shellUserProfileSection.bannerPicture == "fromObjectStore") {
                console.log($rootScope.shellUserProfileSection.bannerPicture);
                $scope.getBannerPicture();
                $rootScope.hideObjectstoreBanner = false;
            } else {
                $rootScope.hideObjectstoreBanner = true;
                $rootScope.banner = $rootScope.shellUserProfileSection.bannerPicture;
                console.log($rootScope.banner);
            };
        };


        $scope.globalTenantRetrivel = function () {

            $http.get($rootScope.v6urls.auth + '/tenant/GetTenants/' + $rootScope.frameworkShellSecurityToken + '').
            success(function (data, status, headers, config) {
                $rootScope.recivedTennantCollection = data;
                // console.log($rootScope.recivedTennantCollection);
            }).
            error(function (data, status, headers, config) {
                console.log(data);
            });

            tenantContextService.getDefaultTenant($rootScope.v6urls.auth, $rootScope.currenttenantsessioninfo.UserID)
                .then(function(response){
                    $rootScope.defaultTenant = response.data.TenantID;
                });

            var key;

            for(key in $rootScope.recivedTennantCollection){
                if($rootScope.recivedTennantCollection.hasOwnProperty(key)){
                    if($rootScope.defaultTenant === $rootScope.recivedTennantCollection[key].TenantID){
                        $rootScope.recivedTennantCollection[key].default = true;
                    }else{
                        $rootScope.recivedTennantCollection[key].default = false;
                    }
                }
            }
        }

        $scope.globalTenantRetrivel(); //framework tenant retrival

        // getDefaulTenant = function(){
        //     $http.get($rootScope.v6urls.auth + '/tenant/GetDefaultTenant/' + $rootScope.currenttenantsessioninfo.UserID).
        //     success(function(){

        //     })
        // };

        //start of tennant switcher
        $scope.makeSwitchTennant = function (tennantDomain, ev) {
            var switchConfirm = $mdDialog.confirm()
            .title('Tennant switch confirm.')
            .content('Are you sure you want to switch to "' + tennantDomain + '" ?')
            .ariaLabel('Switch Tennant')
            .ok('Yes go ahead !')
            .cancel('Dont do it')
            .targetEvent(ev);
            $mdDialog.show(switchConfirm).then(function () {
                window.open('http://' + tennantDomain, '_blank');
                // location.replace('http://'+tennantDomain);
            }, function () {

            });
        };

        //start of manage companies 

        $scope.manageCompanies = function(ev){
            $mdDialog.show({
                controller: manageCompanyCtrl,
                templateUrl: 'partials/modal-templates/managecompanyprocess/managecompany.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: false
            });
        };

        function manageCompanyCtrl($rootScope, $scope, $mdDialog, $timeout, tenantContextService){
            $scope.compManagerViewStatus = true;
            $scope.defaultCompany = $rootScope.defaultTenant;
            $scope.companyList = $rootScope.recivedTennantCollection;

            $scope.ceaseDialog = function(){
                $mdDialog.hide();
            };

            containsTxt = function(specimen,sampler){
                if(specimen.indexOf(sampler) != -1){
                    return true;
                }else{
                    return false;
                }
            };

            $scope.changeDefaultCompany = function(){
                $scope.compManagerViewStatus = false;
                tenantContextService.setDefaultTenant($rootScope.v6urls.auth, $rootScope.currenttenantsessioninfo.UserID, $scope.defaultCompany)
                .then(function(response){
                    console.log(response);
                    if(containsTxt(response.data,"true") === true){
                        console.log('hit');
                        $rootScope.defaultTenant = $scope.defaultCompany;
                        $timeout(function(){
                            $scope.compManagerViewStatus = true;
                        },1500);
                    }else{
                        console.log('not hit');
                        $scope.defaultCompany = $rootScope.defaultTenant;
                        $timeout(function(){
                            $scope.compManagerViewStatus = true;
                        },1500);
                    }
                });
            };
            // console.log($scope.companyList);
        };

        $scope.globalAppRetrivel = function () {
            $apps.onAppsRetrieved(function (e, data) {
                for (appIndex in data.apps) {
                    var iconUrl = data.apps[appIndex].iconUrl;
                    if (iconUrl) {
                        if (iconUrl.indexOf('http') === 0) {
                            data.apps[appIndex].iconUrl = iconUrl;
                        } else {
                            data.apps[appIndex].iconUrl = 'http://duoworld.com' + iconUrl;
                        }
                    } else {
                        data.apps[appIndex].iconUrl = "/unavailableappicon.png";
                    }
                }
                $scope.allApps = data.apps;
            });

            $apps.getAppsForUser();
            //globalAppInfoPush();
            // console.log($scope.allApps);
        }

        //Define Initialization Functions block end

        /*Framework Shell Initialization Components Block - End*/

        /*dw framework session check (uimicrokernal) */

        //framework specific functions

        /*dialog controler*/
        function tennantSelectionModalCtrl($scope, $mdDialog) {
            $scope.switchTennantSelection = function (switchedSelection) {
                $mdDialog.hide();
            };
        };

        /*toggle left menu*/
        $scope.toggleLeftMenu = function () {
            $mdSidenav('left').toggle();
        };

        /*toggle right menu*/
        // $scope.toggleRightMenu = function () {
        //     $mdSidenav('right').toggle();
        // };

        /*to return home*/
        $scope.returnHome = function () {
            $scope.toggleLeftMenu();
            $location.path('/');
        }

        $scope.quickLaunchAppAccess = function (appdetail) {
            $scope.toggleLeftMenu();
            var quickLaunchUri = "launcher/customapp/" + appdetail.ApplicationID + "/" + appdetail.Name;
            $location.path(quickLaunchUri);
            $rootScope.opendAppIconUrl = appdetail.iconUrl;
        };

        $scope.switchUserWidgetContext = function(){
            $scope.userWidgetContextToggle = !$scope.userWidgetContextToggle; 
        };

        $scope.dwSwitchTennant = function (ev, tennantDomain) {
            $scope.toggleRightMenu();

            var switchConfirm = $mdDialog.confirm()
            .title('Tennant switch confirm.')
            .content('Are you sure you want to switch to "' + tennantDomain + '" ?')
            .ariaLabel('Switch Tennant')
            .ok('Yes go ahead !')
            .cancel('Dont do it')
            .targetEvent(ev);
            $mdDialog.show(switchConfirm).then(function () {
                location.replace('http://' + tennantDomain);
            }, function () {

            });
        };

        /*dwFrameworkNavigationScript*/

        $scope.dwFrameworkBuiltinAppNavigation = function (appName) {
            switch (appName) {
                case "user profile":
                $state.go('launcher.userprofile');
                break;
                case "tennant explorer":
                $state.go('launcher.tennantexplorer');
                break;
                case "company":
                $state.go('launcher.companymanager');
                break;
                default:
                console.log('wrong selection !');
            }
        };

        $scope.appUninstall = function (appObject) {
            $objectstore.getClient("application")
            .onComplete(function (data) {
                console.log(data);
            })
            .onError(function (data) {
                console.log(data);
            })
            .delete(appObject, {
                "KeyProperty": "ApplicationID"
            });
        };

        var stripWildcard = function(rawDomain){
          rawDomain = rawDomain.substring(rawDomain.indexOf('.') + 1);
          return rawDomain;
        };

      var defaultDomain = stripWildcard($window.location.host);
      console.log(defaultDomain);

      $scope.quitApplication = function (ev) {
        var confirm = $mdDialog.confirm()
        .title('Quit Application')
        .content('Are you sure you want to quit the application, all unsaved data will be lost.')
        .ok('Yes')
        .cancel('No')
        .targetEvent(ev);
        $mdDialog.show(confirm).then(function () {
            $helpers.getMainDomain(function (domain) {
                    location.replace('http://' + defaultDomain + '/logout.php'); //logout location change
                });

        }, function () {

        });
    };


    /*Twelth door specific functions*/

    /*Plan Explorer - start*/

    $scope.displayPlans = function (ev) {
        $scope.toggleLeftMenu();
        $mdDialog.show({
            templateUrl: 'partials/modal-templates/plansprocess/plans.html',
            controller: PlanController,
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true
        })
        .then(function (answer) {}, function () {});
    };

    function PlanController($window, $rootScope, $scope, $mdDialog, ccPackageService) {

        $scope.planActiveTemplate = [{"templateName":"explore","templateActiveStat":true},{"templateName":"upgraded","templateActiveStat":false}]

        $scope.planViewStatus = 'load';
        $scope.currentPlanDetails;
        // $scope.planViewStatus = 'load';
        // $scope.planViewStatus = 'plans';
        // $scope.planViewStatus = 'summary';
        // $scope.planViewStatus = 'confirmation';

        ccPackageService.getSubscriptionPlan()
            .then(function(response){
                $scope.currentPlanDetails = response.data.data;
                if($scope.currentPlanDetails.codename !== '12_pkg_personal'){
                    $scope.planViewStatus = 'summary';
                }else{
                    $scope.planViewStatus = 'plans';
                }
            });

        $scope.purchasePlan = function(){
            $scope.planViewStatus = 'confirmation';
        };

        $scope.billingCycleToggled = true;

        var slctdBillingCycle = "month";

        var injectableCodes = {"injPlanCode":"","injAlacartCode":""};

        var currDate = new Date();

        $scope.nxtMonthBillDate = new Date(new Date(currDate).setMonth(currDate.getMonth()+1));

        $scope.nxtYearBillDate = new Date(new Date(currDate).setFullYear(currDate.getFullYear()+1));

        // $scope.monthlyDeadline = currentDate+

        $scope.toggleBillingCycle = function(){
            console.log('toggled !');
            $scope.billingCycleToggled = !$scope.billingCycleToggled;            
        };

        $scope.injectPlanCode = function(slctdArg){
            if(slctdArg === "month"){
                injectableCodes.injPlanCode = "12_pkg_business_perM",
                injectableCodes.injAlacartCode = "12_alacart_user_perM";
            }else{
                injectableCodes.injPlanCode = "12_pkg_business_perY",
                injectableCodes.injAlacartCode = "12_alacart_user_perY";
            };
        };

        $scope.config = {
            publishKey: 'pk_test_RVbf1rRmq4fv8rbGNt3QMXnV',
            title: '12thDoor',
            description: "Invoicing made simple.",
            logo: 'images/shellassets/12thdoorpaymentcygil.png',
            label: 'Upgrade',
        }; 

        $scope.$on('stripe-token-received', function(event, args) {
            var packageStack = {
                "token": ""+args.id+"",
                "tenantId": ""+$window.location.host+"",
                "planCode": injectableCodes.injPlanCode,
                "alacarts":[
                    {"acode": injectableCodes.injAlacartCode, "quantity":3}
                ]
            };

            // console.log(packageStack);

            if(args.id){
                ccPackageService.upgradeSubscriptionPlan(packageStack)
                    .then(function(response){
                        console.log(response);
                        $scope.planViewStatus = "summary";
                    });
            }
        });
    };

    var addCPH = function(){
        $mdDialog.show({
            templateUrl: 'partials/modal-templates/companyprocess/addcompany.html',
            controller: addCPC,
            parent: angular.element(document.body),
            clickOutsideToClose: false
        })  
        .then(function(answer){},function(){});
    };

    var joinCPH = function(){
        $mdDialog.show({
            templateUrl: 'partials/modal-templates/companyprocess/joincompany.html',
            controller: joinCPC,
            parent: angular.element(document.body),
            clickOutsideToClose: false
        })  
        .then(function(answer){},function(){});
    };

    var displayCompanyCreateJoinDetailsSubmissionMsg = function(header, message){
        $mdDialog.show(
          $mdDialog.alert()
          .parent(angular.element(document.body))
          .clickOutsideToClose(true)
          .title(''+header+'')
          .textContent(''+message+'')
          .ariaLabel(''+header+'')
          .ok('Got it!')
          );
    };

    var displayCompanyCreateJoinDetailsSubmissionProgress = function(submissionMessage){
        $mdDialog.show({
          template: 
          '<md-dialog ng-cloak>'+
          '   <md-dialog-content>'+
          '       <div style="height:auto; width:auto; padding:10px;" class="loadInidcatorContainer" layout="row" layout-align="start center">'+
          '           <md-progress-circular class="md-primary" md-mode="indeterminate" md-diameter="40"></md-progress-circular>'+
          '           <span>'+submissionMessage+'</span>'+
          '       </div>'+
          '   </md-dialog-content>'+
          '</md-dialog>',
          parent: angular.element(document.body),
          clickOutsideToClose:false
      });
    };            

    function addCPC($window, $scope, $mdDialog, $http){

        $scope.ceaseDialog = function(){
            $mdDialog.hide();
        };  

        var stripWildcard = function(rawDomain){
            rawDomain = rawDomain.substring(rawDomain.indexOf('.') + 1);
            return rawDomain;
        };

        $scope.hostedDomain = stripWildcard($window.location.host);

        $scope.businessType = [];

        $scope.companyLocation = [];

        $scope.createCompanyDetails = {
            "TenantID": "",
            "TenantType": "default",
            "Name": "",
            "Statistic": {
                 "Invoices":"60",
                 "Users":"1"
            },
            "Private": true,
            "OtherData": {
                "CompanyType": "",
                "CompanyLocation": "",
                "LocationCode": "",
                "Currency": ""
            }
        };

        $scope.loadBusinessType = function(){
            $http.get('data/business.json').
            success(function(data, status, headers, config){
                $scope.businessType = data;
            }).
            error(function(data, status, headers, config){
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
        };

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

        var defaultPlanConfiguration = {
            "tenantId": "",
            "planCode": "12_pkg_personal"
        };

        $scope.submitCreateCompanyDetails = function(createCompanyDetails){

         var payload = angular.toJson(createCompanyDetails);

         console.log(payload);

         $http({
             method: 'POST',
             url: '/apis/usertenant/tenant/',
             headers: {'Content-Type':'application/json'},
             data: payload
         })
         .success(function(data, status, headers, config){
             $mdDialog.hide();
             console.log(data);
                if(data.Success === true){
                        displayCompanyCreateJoinDetailsSubmissionMsg('Success',data.Message);
                        defaultPlanConfiguration.tenantId = data.Data.TenantID;
                        ccPackageService.setSubscriptionPlan(defaultPlanConfiguration)
                            .then(function(response){
                                console.log(response);
                                $mdDialog.hide();
                                // redirectionSuccess(data);
                                // resetFormPrestine();   
                            },function(data){
                                console.log(data);
                                $mdDialog.hide();
                            });
                        // resetFormPrestine();   
                    }else{  
                        displayCompanyCreateJoinDetailsSubmissionMsg('Error','Sorry, we are having problems creating your company at this moment. Please try again later.');
                        // resetFormPrestine();
                    }

                })
         .error(function(data){
             $mdDialog.hide();
             displayCompanyCreateJoinDetailsSubmissionMsg('Error','Sorry, we are having problems creating your company at this moment. Please try again later.');
             resetFormPrestine();
         });

        };

        var resetFormPrestine = function(){
            $scope.createCompanyDetails = {};
                    // $scope.joinCompanyForm.$setPristine();
        };

        var defaultDataInjection = function(data){
                 data.TenantID = data.TenantID+"."+$scope.hostedDomain;
                 return data;
        };

    };

    function joinCPC($window, $scope, $mdDialog, $http){

        $scope.ceaseDialog = function(){
            $mdDialog.hide();
        };  

        $scope.hostedDomain = $window.location.host;

        $scope.submitJoinCompanyDetails = function(joinCompanyDetails){

            displayCompanyCreateJoinDetailsSubmissionProgress('Your request is being processed please wait...');

            $http({
                method:'GET',
                url:'/apis/usertenant/tenant/subscribe/'+joinCompanyDetails.TenantID+''
            })
            .success(function(data, status, headers, config){
                $mdDialog.hide();
                console.log(data);
                if(data.Success === true){
                    displayCompanyCreateJoinDetailsSubmissionMsg('Join Company', 'You have successfully requested for an invite to join the company, check your email for further instructions.');
                    // resetFormPrestine();   
                }else{
                    displayCompanyCreateJoinDetailsSubmissionMsg('Join Company', 'Sorry, we are having problems creating your company at this moment. Please try again later.');
                    // resetFormPrestine();
                }

            })
            .error(function(data){
                $mdDialog.hide();
                displayCompanyCreateJoinDetailsSubmissionMsg('Join Company', 'Sorry, we are having problems processing your request at this moment. Please try again later.');
                // resetFormPrestine();
            });
        };

            // var resetFormPrestine = function(){
            //     $scope.joinCompanyDetails = {};
            // $scope.joinCompanyForm.$setPristine();
            // };

        var defaultDataInjection = function(data){
            data.TenantID = data.TenantID+"."+$scope.hostedDomain;
            return data;
        };

        var displayCompanyCreateJoinDetailsSubmissionMsg = function(header, message){
            $mdDialog.show(
              $mdDialog.alert()
              .parent(angular.element(document.body))
              .clickOutsideToClose(true)
              .title(''+header+'')
              .textContent(''+message+'')
              .ariaLabel(''+header+'')
              .ok('Got it!')
              );
        };

        var displayCompanyCreateJoinDetailsSubmissionProgress = function(submissionMessage){
            $mdDialog.show({
              template: 
              '<md-dialog ng-cloak>'+
              '   <md-dialog-content>'+
              '       <div style="height:auto; width:auto; padding:10px;" class="loadInidcatorContainer" layout="row" layout-align="start center">'+
              '           <md-progress-circular class="md-primary" md-mode="indeterminate" md-diameter="40"></md-progress-circular>'+
              '           <span>'+submissionMessage+'</span>'+
              '       </div>'+
              '   </md-dialog-content>'+
              '</md-dialog>',
              parent: angular.element(document.body),
              clickOutsideToClose:false
          });
        };

    };

    $scope.revealCompanyProcess = function(processName){if(processName === "addcompany"){addCPH();}else{joinCPH();}};

        /*Plan Explorer - End*/
    };

    duoWorldFrameworkShellCtrl.$inject = ['$rootScope', '$scope', '$state', '$http', '$location', '$window','$mdMedia', '$mdSidenav', '$mdDialog', '$mdToast', '$presence', '$auth', '$apps', '$v6urls', '$helpers', '$objectstore', 'ccPackageService', 'tenantContextService', '$timeout'];

    mambatiFrameworkShell.controller('duoworld-framework-shell-ctrl', duoWorldFrameworkShellCtrl);

}());
