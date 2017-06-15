(function () {

    var duoworldFrameworksShellLauncherMultipleDueDatesProtoControl = function ($rootScope, $scope, $state, $http, $timeout, $presence, $objectstore, $uploader, $mdToast, $window, $auth, $mdDialog, $mdMedia) {

      $scope.defaultClassView = true;

      var dwChildAppHeaderController = angular.element('#dw-child-application-header-control-bar');
      var dwChildAppSplashCover = angular.element('.dw-childapp-backgroundcover');
      var dwChildAppContainer = angular.element('.customeAppContainer');
      var dwChildAppSplashLogo = angular.element('.dw-childapp-splash-logo');
      var dwChildAppSplashText = angular.element('.dw-childapp-splash-title');
      var dwChildAppSplashLoadingSpinner = angular.element('.dw-childapp-splash-loadingspinner');
      var dwChildAppSplashLoadingTextIndicator = angular.element('.dw-childapp-splash-loadingtextindicator');
      var dwChildAppHeaderInfomationTitle = angular.element('.dw-child-application-header-control-bar-left-section span');
      var dwChildAppHeaderInfomationIcon = angular.element('.dw-child-application-header-control-bar-left-section img');
      var dwChildAppSaveButton = angular.element('.dw-child-app-saveButton');

      $timeout(function () {
          dwChildAppHeaderController.css({
              'top': '0px',
              'background': $rootScope.shellConfig.themeconfiguration.accentpalette
          })
      }, 1000);

      $timeout(function () {
          dwChildAppSplashLogo.css('bottom', '0px');
      }, 1300);

      $timeout(function () {
          dwChildAppSplashText.css('top', '0px');
      }, 1500);

      $timeout(function () {
          dwChildAppSplashLoadingSpinner.css('top', '0px');
      }, 1700);

      $timeout(function () {
          dwChildAppSplashLoadingTextIndicator.css('top', '0px');
      }, 1800);


      $timeout(function () {
          dwChildAppSplashLoadingSpinner.css('top', '-400px');
          dwChildAppSplashLoadingTextIndicator.css('top', '-400px');
      }, 4500);

      $timeout(function () {
          dwChildAppSplashText.css('top', '-400px');
      }, 4800);

      $timeout(function () {
          dwChildAppSplashLogo.css('bottom', '-150px');
      }, 5000);

      $timeout(function () {
          dwChildAppSplashCover.css('height', '300px');
      }, 5200);

      $timeout(function () {
          dwChildAppHeaderInfomationTitle.css('top', '0px');
          dwChildAppHeaderInfomationIcon.css('top', '0px');
      }, 5200);

      $timeout(function () {
          dwChildAppContainer.css({
              'opacity': 1,
              'z-index': 1,
              'top': '0px'
          });
      }, 5200);

      $timeout(function () {
          dwChildAppSaveButton.css('z-index', '1');
      }, 5200);


      $scope.childApplicationClose = function () {
          $state.go('dock');
      };

      $scope.childApplicationMinimise = function () {
          $state.go('dock');
      };

      $rootScope.companies = [
        {companyName:'Fun-n-Fit tumblebus Pvt (Ltd)', companyDomain:'fun-n-fit.12thdoor.com', companyLogo:'images/tennantassets/samplecompany.png', companyOwner:'Adam Savinge', companyCreated:'30.12.2015', companyPrimary:true},
        {companyName:'Arpico Finance Pvt (Ltd)', companyDomain:'strangerdanger.12thdoor.com', companyLogo:'images/tennantassets/samplecompany.png', companyOwner:'Micheal Sherkondy', companyCreated:'02.01.2016', companyPrimary:false}
      ];

      $scope.makePrimaryCompany = function(company, ev){
        var tmpCompanyIndex = $scope.companies.indexOf(company);

        var dltConfirm = $mdDialog.confirm()
              .title('Delete')
              .content('Are you sure you want to delete this company ?')
              .ariaLabel('delete company')
              .targetEvent(ev)
              .ok('go ahead !')
              .cancel('dont do it !');
        $mdDialog.show(dltConfirm).then(function() {
          $scope.companies.splice(tmpCompanyIndex, 1);
        }, function() {
        });
      };

      $scope.addCompany = function(ev){

           $mdDialog.show({
             templateUrl: 'partials/modal-templates/partials.modal-templates.addnewcompany.html',
             controller: function submitCompanyDetails($rootScope, $scope, $mdDialog){
               $scope.newCompany;
               $scope.countries = $rootScope.countries;

               $scope.pushCompanyDetails = function(){
                  var companyDomain = $scope.newCompany.name.replace(/\s/g, '').toLowerCase();
                  $rootScope.companies.push({companyName:''+$scope.newCompany.name+'', companyDomain:''+companyDomain+'.12thdoor.com', companyLogo:'images/tennantassets/samplecompany.png', companyOwner:''+$scope.newCompany.ownername+'', companyCreated:'08.12.2015', companyPrimary:false});
                  $mdDialog.hide();
               };
             },
             parent: angular.element(document.body),
             targetEvent: ev,
             clickOutsideToClose: true
           })
           .then(function(answer) {
           }, function() {
           });
      };

      $scope.deleteCompany = function(company, ev){
        var tmpCompanyIndex = $scope.companies.indexOf(company);

        var dltConfirm = $mdDialog.confirm()
              .title('Delete')
              .content('Are you sure you want to delete this company ?')
              .ariaLabel('delete company')
              .targetEvent(ev)
              .ok('go ahead !')
              .cancel('dont do it !');
        $mdDialog.show(dltConfirm).then(function() {
          $scope.companies.splice(tmpCompanyIndex, 1);
        }, function() {
        });
      };

      $scope.duedatesstops = [{"date":"2016-02-02T18:30:00.000Z","headerinfo":"Payment 1","moreinfo":"Sample payment 1 descriptive info."},{"date":"2016-01-29T18:30:00.000Z","headerinfo":"Payment 2","moreinfo":"Sample payment 2 descriptive info."},{"date":"2016-01-28T18:30:00.000Z","headerinfo":"Payment 3","moreinfo":"Sample payment 3 descriptive info."}]

    };

    duoworldFrameworksShellLauncherMultipleDueDatesProtoControl.$inject = ['$rootScope', '$scope', '$state', '$http', '$timeout', '$presence', '$objectstore', '$uploader', '$mdToast', '$window', '$auth', '$mdDialog', '$mdMedia'];

    mambatiFrameworkShell.controller('duoworld-framework-shell-childapp-multipleduedatesproto-ctrl', duoworldFrameworksShellLauncherMultipleDueDatesProtoControl);
}());
