    (function () {
      var duoworldFrameworkShellLauncherUserprofileCtrl = function ($rootScope, $scope, $state, $http, $timeout, $objectstore, $uploader, $mdToast, $window, $auth, $mdDialog, $mdMedia, $charge, notifications) {

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

      $auth.checkSession();
      $scope.authObject = {};
      $scope.account = {};
      $scope.ledger = [];

      $scope.profilePicture = "images/contacts.png";
      $scope.showMore = false;
      $scope.showEdit = true;

      $scope.content = $rootScope.content;
      var contentBeforeEdit = {};
      contentBeforeEdit = angular.copy($rootScope.content);

      $charge.payment().getAccounts().success(function (data) {

        $scope.account = data[0];
        getAllTransctions(data[0].AccountId);
                //console.log($scope.account);

                for (i = 0, len = $scope.account.AccountCards.length; i < len; ++i) {

                  if ($scope.account.AccountCards[i].CardType == "Master" || $scope.account.AccountCards[i].CardType == "Master Card") {
                    $scope.account.AccountCards[i].cardImage = "img/master_s.png";
                  } else if ($scope.account.AccountCards[i].CardType == "Visa") {
                    $scope.account.AccountCards[i].cardImage = "img/visa_s.png";
                  } else if ($scope.account.AccountCards[i].CardType == "Amex" || $scope.account.AccountCards[i].CardType == "American Express") {
                    $scope.account.AccountCards[i].cardImage = "img/amex_s.png";
                  }
                }


              }).error(function (data) {
                console.log(data);
              })

              function getAllTransctions(accountId) {
                $charge.payment().getTransactions(accountId).success(function (data) {
                  $scope.ledger = data;
                }).error(function (data) {
                  console.log(data);
                })
              }

            /*$scope.fileChanged = function (element) {
                $scope.progressCircle = true;
                var tempProfilePic = $rootScope.profilePicture;
                var file = element.files[0];
                var reader = new FileReader();
                reader.onload = function () {
                    $rootScope.profilePicture = reader.result;
                }
                reader.readAsDataURL(file);

                if (file) {
                    $uploader.onSuccess(function (data) {
                        $scope.progressCircle = false;
                        console.log(data);
                        notifications.toast("Profile picture updated", "success");
                    });
                    $uploader.onError(function () {
                        $scope.progressCircle = false;
                        notifications.toast("Error occured, Profile picture was not updated", "error");
                        $rootScope.profilePicture = tempProfilePic;
                    });
                    $uploader.uploadMedia("profilepictures", file, "profile.jpg");
                }
              }*/

              $scope.editProfile = function () {
                $scope.showEdit = false;
              }

              $scope.cancelChanges = function () {
                $scope.content = angular.copy(contentBeforeEdit);
                $scope.showEdit = true;
              }

              $scope.saveProfile = function () {
                //console.log($scope.editForm);
                $rootScope.showGlobalProgress = true;
                if ($scope.editForm.$valid === true) {
                  $scope.showEdit = true;
                  console.log($scope.content);

                  var req = {
                    method: "POST",
                    url: "/apis/profile/userprofile",
                    headers: {
                      "Content-Type": "application/json"
                                //"SecurityKey" : $auth.getSecurityToken()
                              },
                              data: $scope.content
                            };
                            $http(req).then(function (data) {
                              console.log(data);
                              $rootScope.showGlobalProgress = false;
                              if (data.data.IsSuccess === true) {
                                notifications.toast("Profile Updated", "success");
                                $scope.showEdit = '/img/ic_mode_edit_24px.svg';
                                $rootScope.content = $scope.content;
                                contentBeforeEdit = angular.copy($scope.content);
                                $rootScope.sendShellNotification('Profile details updated');
                              } else {
                                notifications.toast(data.data.Message, "error", 3000);
                              }
                            },
                            function (data) {
                              $rootScope.showGlobalProgress = false;
                              notifications.toast("Error occurred while saving", "error", 3000);
                            });

                            $scope.showEdit = '/img/ic_mode_edit_24px.svg';
                          } else {
                            $rootScope.showGlobalProgress = false;
                            notifications.toast("Please enter valid data and fill all required feilds", "error");
                          }


                        };

                        $scope.editProfilePic = function (ev) {

                          $rootScope.profilePicture = "img/bx_loader.gif";

                          $mdDialog.show({
                            controller: 'uploadPictureCtrl',
                            templateUrl: 'partials/frameworktemplates/uploadPicture.html',
                            parent: angular.element(document.body),
                            targetEvent: ev,
                            clickOutsideToClose: true
                          })
                          .then(function (answer) {
                        //$scope.progressCircle = true;
                        //if (answer == "success") {
                          $rootScope.profilePicture = "/apis/media/profilepic/get/" + $scope.content.Email;
                         //$rootScope.profilePicture = "/apis/media/user/profilepictures/profile.jpg";
                        //}
                      })
                        };

                        $scope.toggleShowMore = function () {
                          $scope.showMore = !$scope.showMore;
                        }

                        $scope.changePassword = function (ev) {
                          $mdDialog.show({
                            controller: 'changePasswordCtrl',
                            templateUrl: 'partials/frameworktemplates/changePassword.html',
                            parent: angular.element(document.body),
                            targetEvent: ev,
                            clickOutsideToClose: true
                          })
                          .then(function (answer) {
                            if (answer) {
                              console.log(answer);
                            }
                          })
                        }

                        $scope.editCard = function (ev, card) {
                          $mdDialog.show({
                            controller: 'addCardCtrl',
                            templateUrl: 'partials/frameworktemplates/newCard.html',
                            parent: angular.element(document.body),
                            targetEvent: ev,
                            clickOutsideToClose: true,
                            locals: {
                              cardObject: card,
                              account: $scope.account,
                              userObject: $scope.content
                            }
                          })
                          .then(function (answer) {
                            if (answer) {
                              $scope.account = answer;
                            }
                          })
                        }

                        $scope.deleteCard = function (ev, card) {
                // Appending dialog to document.body to cover sidenav in docs app
                var confirm = $mdDialog.confirm()
                .title('Delete Card')
                .textContent('Are you sure you want to delete the card with the name of ' + card.Name + '?')
                .ariaLabel('Delete Card')
                .targetEvent(ev)
                .ok('Delete Card')
                .cancel('Cancel');
                $mdDialog.show(confirm).then(function () {
                  $rootScope.showGlobalProgress = true;
                  var account = angular.copy($scope.account);
                  var replaceThis = "";
                  for (i = 0, len = account.AccountCards.length; i < len; ++i) {
                    if (account.AccountCards[i].guid == card.guid) {
                      replaceThis = i;
                        } else { //console.log(i,'new card');
                      }
                    }

                    if (replaceThis || replaceThis === 0) {
                      account.AccountCards.splice(replaceThis, 1);
                      console.log(replaceThis, 'replace this card');
                    }

                    $charge.payment().newCard(account).success(function (data) {
                      $scope.account = account;
                      $rootScope.showGlobalProgress = false;
                      notifications.toast("Card Successfully Deleted", "success", 3000);
                      $mdDialog.hide(data);
                    }).error(function (data) {
                      $rootScope.showGlobalProgress = false;
                      notifications.alertDialog("Error", "Failed to delete card");
                    })
                  });
              }

              $scope.makeDefault = function (ev, card) {

                for (i = 0, len = $scope.account.AccountCards.length; i < len; ++i) {
                  $scope.account.AccountCards[i].default = false;
                }
                card.default = true;

                //console.log($scope.account);
                $rootScope.showGlobalProgress = true;
                $charge.payment().newCard($scope.account).success(function (data) {
                  $rootScope.showGlobalProgress = false;
                  notifications.toast("Default card changed", "success", 3000);
                  $mdDialog.hide(data);
                }).error(function (data) {
                  $rootScope.showGlobalProgress = false;
                  notifications.alertDialog("Error", "Could not set Default card due to error");
                })

              }

              $scope.newCard = function (ev) {

                $mdDialog.hide();
                if ($scope.content.BillingAddress && $scope.content.PhoneNumber) {
                  $mdDialog.show({
                    controller: 'addCardCtrl',
                    templateUrl: 'partials/frameworktemplates/newCard.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true,
                    locals: {
                      cardObject: "",
                      account: $scope.account,
                      userObject: $scope.content
                    }
                  })
                  .then(function (answer) {
                    if (answer) {
                      $scope.account = answer;
                    }
                  })
                } else {
                  notifications.alertDialog("Complete Profile", "Please add your Phone Number and Billing Address before adding cards");
                }
              }

            };

            duoworldFrameworkShellLauncherUserprofileCtrl.$inject = ['$rootScope', '$scope', '$state', '$http', '$timeout', '$objectstore', '$uploader', '$mdToast', '$window', '$auth', '$mdDialog', '$mdMedia','$charge'];

            mambatiFrameworkShell.controller('duoworld-framework-shell-launcher-userprofile-ctrl', duoworldFrameworkShellLauncherUserprofileCtrl);
          })();

    //_____________________________________________________________________________________________profileCtrl start

    //_____________________________________________________________________________________________addCardCtrl start

    (function () {
      var addCardCtrl = function ($scope, $rootScope, $mdDialog, notifications, account, cardObject, userObject, $charge) {

        $scope.account = {};
        $scope.card = {};
        $scope.newCard = true;
        $scope.disableaddBtn = false;

        var today = new Date();
        var dd = today.getDate();
            var mm = today.getMonth() + 1; //January is 0!
            var yyyy = today.getFullYear();

            var startYear = yyyy;
            $scope.years = [];
            for (i = 0, len = 30; i < len; ++i) {
              $scope.years.push(yyyy.toString());
              yyyy = yyyy + 1;
            }

            var monthName = "";
            $scope.months = [];

            $scope.yearChanged = function (selectedYear) {
              $scope.months = [];
              if (parseInt(selectedYear) == startYear) {
                for (i = 1, len = 13; i < len; ++i) {
                  monthName = i;
                  if (monthName >= mm) {
                    if (monthName.toString().length == 1) {
                      monthName = "0" + i;
                    }
                    $scope.months.push(monthName.toString());
                  }
                }
              } else {
                for (i = 1, len = 13; i < len; ++i) {
                  monthName = i;
                  if (monthName.toString().length == 1) {
                    monthName = "0" + i;
                  }
                  $scope.months.push(monthName);
                }
              }
            }

            if (cardObject) {
              $scope.yearChanged(cardObject.ExpiryYear);
              $scope.card = angular.copy(cardObject);
              $scope.newCard = false;
            }

            $scope.card.CardType = "";

            $scope.cardTypes = [{
              type: "Visa",
              validPatterns: ['41', '42', '43', '44', '45', '46', '47', '48', '49'],
              imageUrl: "img/visa_s.png",
              regExPattern: /^4[0-9]{12}(?:[0-9]{3})?$/
            },
            {
              type: "Master Card",
              validPatterns: ['51', '52', '53', '54', '55'],
              imageUrl: "img/master_s.png",
              regExPattern: /^5[1-5][0-9]{14}$/
            },
            {
              type: "American Express",
              validPatterns: ['37', '34'],
              imageUrl: "img/amex_s.png",
              regExPattern: /^3[47][0-9]{13}$/
            }
            ];

            $rootScope.$watch('cardTypeRoot', function () {
              $scope.card.CardType = $rootScope.cardTypeRoot;
            })


            $scope.cancel = function () {
              $mdDialog.hide();
            }

            $scope.submit = function () {

              var validExpiry = false;
              var validCardNo = false;
              var validCVS = false;
                    //var validPhoneNumber = false;

                    if ($scope.card.ExpiryYear == null || $scope.card.ExpiryMonth == null) {
                      notifications.toast("Please select the expiry date", "error");
                    } else {
                      validExpiry = true;
                    }
                    try {
                      if ($scope.card.CardType.regExPattern.test($scope.card.CardNo) == false) {
                            notifications.toast("You card no. is invalid", "error"); //card type chosen but still invalid
                          } else {
                            validCardNo = true;
                          }
                        } catch (exception) {
                        notifications.toast("You card no. is invalid", "error"); //card type doesn't even exist
                      }


                      if (!$scope.card.CSV) {
                        notifications.toast("Invalid CVV Number", "error");
                      } else {
                        //
                        if ($scope.card.CardType.type === "Visa" || $scope.card.CardType.type === "Master Card") {

                          if ($scope.card.CSV.length === 3) {
                            validCVS = true;
                          } else {
                            notifications.toast("CVV Number for " + $scope.card.CardType.type + " cards should contain 3 digits", "error", 4000);
                          }
                        } else if ($scope.card.CardType.type === "American Express") {
                          if ($scope.card.CSV.length === 4) {
                            validCVS = true;
                          } else {
                            notifications.toast("CVV Number for American Express cards should contain 4 digits", "error", 4000);
                          }
                        }

                      }

                    /*if(!$scope.account.PhoneNumber)
                    {
                        notifications.toast("Enter a valid phone number with 9 digits", "error", 4000);
                    }else{
                        validPhoneNumber = true;
                      }*/

                      if (validCardNo === true && validExpiry === true && validCVS === true) {
                        $scope.disableaddBtn = true;
                        $rootScope.showGlobalProgress = true;

                        var addCardObj = angular.copy($scope.card);
                        addCardObj.CardType = addCardObj.CardType.type;

                        if (account == null) {

                          account = {};
                          account.DeliveyAddress = userObject.BillingAddress,
                          account.BillingAddress = userObject.BillingAddress,
                          account.PhoneNumber = userObject.PhoneNumber,
                          account.AccountBalance = 0,
                          account.AccountCards = []

                        }

                        var replaceThis = "";
                        for (i = 0, len = account.AccountCards.length; i < len; ++i) {
                          if (account.AccountCards[i].guid == addCardObj.guid) {
                            replaceThis = i;
                            } else { //console.log(i,'new card');
                          }
                        }

                        if (replaceThis || replaceThis === 0) {
                          account.AccountCards.splice(replaceThis, 1);
                          console.log(replaceThis, 'replace this card');
                        }

                        if (addCardObj.CardType == "Master" || addCardObj.CardType == "Master Card") {
                          addCardObj.cardImage = "img/master_s.png";
                        } else if (addCardObj.CardType == "Visa") {
                          addCardObj.cardImage = "img/visa_s.png";
                        } else if (addCardObj.CardType == "Amex" || addCardObj.CardType == "American Express") {
                          addCardObj.cardImage = "img/amex_s.png";
                        }

                        account.AccountCards.push(addCardObj);

                        var addedOrEdited = "Added";
                        if ($scope.newCard === false) {
                          addedOrEdited = "Edited";
                        }

                        $charge.payment().newCard(account).success(function (data) {
                          $scope.disableaddBtn = false;
                          $rootScope.showGlobalProgress = false;
                          notifications.toast("Card Successfully " + addedOrEdited, "success", 3000);
                          $mdDialog.hide(data);
                        }).error(function (data) {
                          $scope.disableaddBtn = false;
                          $rootScope.showGlobalProgress = false;
                          console.log(data);
                          notifications.alertDialog("Error", "Failed to add card");
                        })

                    } // END OF VALIDATED SUBMIT

                } // END OF SUBMIT
              };

              addCardCtrl.$inject = ['$scope', '$rootScope', '$mdDialog', 'notifications', 'account', 'cardObject', 'userObject', '$charge'];

              mambatiFrameworkShell.controller('addCardCtrl', addCardCtrl);
            })();

    //_____________________________________________________________________________________________addCardCtrl end

    //_____________________________________________________________________________________________changePasswordCtrl start


    (function () {
      var changePasswordCtrl = function ($scope, $rootScope, $mdDialog, $http, notifications) {
        $scope.disableChangePasswordBtn = false;

        $scope.cancel = function () {
          $mdDialog.hide();
        }

        $scope.submit = function () {
          $rootScope.showGlobalProgress = true;
          if ($scope.newPassword === $scope.confirmNewPassword) {
            $scope.disableChangePasswordBtn = true;
            $rootScope.showGlobalProgress = true;

            var encodedOldPass = angular.copy(encodeURIComponent($scope.oldPassword));
            var encodedNewPass = angular.copy(encodeURIComponent($scope.newPassword));

            console.log(window.location.host + '/auth/ChangePassword/' + encodedOldPass + '/' + encodedNewPass);
            $http.get('/auth/ChangePassword/' + encodedOldPass + '/' + encodedNewPass)
            .success(function (data) {

              var checkTrue = function(data){

               if(data.indexOf('true') >= -0){
                return true;
              }else{
                return false;
              }
            }

            $rootScope.showGlobalProgress = false;
            if(checkTrue(data) == true){
             notifications.toast("Passoword Successfully Changed", "success");
             $mdDialog.hide();
           }
           else{
             notifications.toast(data, "error");
           }

           $scope.disableChangePasswordBtn = false;
           $rootScope.showGlobalProgress = false;

         }).error(function () {
          $rootScope.showGlobalProgress = false;
          $scope.disableChangePasswordBtn = false;
          $rootScope.showGlobalProgress = false;
          notifications.toast("Error occurred while changing the password", "error", 3000);
        });

       } else {
        notifications.toast("New Password Confirmation invalid", "error", 4000);
      }
    }

  };

  changePasswordCtrl.$inject = ['$scope', '$rootScope', '$mdDialog', '$http', 'notifications'];

  mambatiFrameworkShell.controller('changePasswordCtrl', changePasswordCtrl);
})();

    //_____________________________________________________________________________________________changePasswordCtrl end

    //_____________________________________________________________________________________________components start

    mambatiFrameworkShell.directive('customOnChange', customOnChangeFunc);

    function customOnChangeFunc() {
      return {
        restrict: 'A',
        link: function (scope, element, attrs) {
          var onChangeFunc = scope.$eval(attrs.customOnChange);
          element.bind('change', onChangeFunc);
        }
      };
    };



    function filterByPatternFunc($rootScope) {
      return function (cardTypes, CardNo) {
        if (!CardNo) {
          CardNo = "";
          return cardTypes;
        }
        for (i = 0, len = cardTypes.length; i < len; ++i) {

          for (j = 0, len = cardTypes[i].validPatterns.length; j < len; ++j) {
            var contains = cardTypes[i].validPatterns[j].startsWith(CardNo.substring(0, 2));
            if (contains === true) {
              $rootScope.cardTypeRoot = cardTypes[i];
              return [cardTypes[i]];
            }
          }
        }
      }
    };
    mambatiFrameworkShell.filter("filterByPattern", filterByPatternFunc);

    filterByPatternFunc.$inject = ['$rootScope'];

    mambatiFrameworkShell.directive('angularMask', angularMaskFunc);

    function angularMaskFunc() {
      return {
        restrict: 'A',
        require: 'ngModel',
        link: function ($scope, el, attrs, model) {
          var format = attrs.angularMask,
          arrFormat = format.split('|');

          if (arrFormat.length > 1) {
            arrFormat.sort(function (a, b) {
              return a.length - b.length;
            });
          }

          model.$formatters.push(function (value) {
            return value === null ? '' : mask(String(value).replace(/\D/g, ''));
          });

          model.$parsers.push(function (value) {
            model.$viewValue = mask(value);
            var modelValue = String(value).replace(/\D/g, '');
            el.val(model.$viewValue);
            return modelValue;
          });

          function mask(val) {
            if (val === null) {
              return '';
            }
            var value = String(val).replace(/\D/g, '');
            if (arrFormat.length > 1) {
              for (var a in arrFormat) {
                if (value.replace(/\D/g, '').length <= arrFormat[a].replace(/\D/g, '').length) {
                  format = arrFormat[a];
                  break;
                }
              }
            }
            var newValue = '';
            for (var nmI = 0, mI = 0; mI < format.length;) {
              if (format[mI].match(/\D/)) {
                newValue += format[mI];
              } else {
                if (value[nmI] != undefined) {
                  newValue += value[nmI];
                  nmI++;
                } else {
                  break;
                }
              }
              mI++;
            }
            return newValue;
          }
        }
      };
    };

    //Password Strength Directive - Start
    mambatiFrameworkShell.directive('passwordStrengthIndicator', passwordStrengthIndicator);

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
    //Hide the Account Numbers in show all Accounts
    mambatiFrameworkShell.filter('hideNumbers', hideNumbersFunc);

    function hideNumbersFunc() {
      return function (input) {
        return input.replace(/.(?=.{4})/g, 'x');
      };
    };

    //_____________________________________________________________________________________________components end

    //---------------------------------------------------------------------------------------------uploadPictureCtrl start


    (function () {
      var uploadPictureCtrl = function ($scope, $rootScope, $mdDialog, notifications, $uploader) {

        $scope.cancel = function () {
          $mdDialog.hide();
        }

        $scope.doubleWrap = "{{outputImage}}"

        $scope.fileChanged = function (evt) {
          console.log("upload hit");

          if (!evt) evt = window.event;
                // var x = e.target||e.srcElement;

                var file = evt.target.files[0];
                // var file = evt.currentTarget.files[0];
                var reader = new FileReader();
                reader.onload = function (evt) {
                  $scope.$apply(function ($scope) {
                    $scope.theImage1 = evt.target.result;
                  });
                };
                reader.readAsDataURL(file);
              }

              $scope.onUpdate = function (data) {
                //console.log(data)
              }



              $scope.submit = function () {
                var noImage = true;
                try {
                  var youtubeimgsrc = document.getElementById("youtubeimg").src;
                  noImage = false;
                } catch (exception) {
                  noImage = true;
                }

                // console.log(noImage == false);
                if (noImage === false) {
                  $rootScope.showGlobalProgress = true;
                  var myblob = dataURItoBlob(youtubeimgsrc);
                  var file = blobToFile(myblob, "profilepicture");

                  $uploader.onSuccess(function () {
                    notifications.toast("Profile picture updated", "success");
                    //$rootScope.sendShellNotification('Profile picture updated');
                    $rootScope.showGlobalProgress = false;
                    $mdDialog.hide("success");
                        //$scope.profilePicture = tempProfilePic;
                      });
                  $uploader.onError(function () {
                    $rootScope.showGlobalProgress = false;
                    notifications.toast("Error occured, Profile picture was not updated", "error");
                  });
                  $uploader.uploadUserMedia("profilepictures", file, "profile.jpg");
                } else {
                  notifications.toast("Please select a picture", "error");
                };

              }

              function blobToFile(theBlob, fileName) {
                //A Blob() is almost a File() - it's just missing the two properties below which we will add
                theBlob.lastModifiedDate = new Date();
                theBlob.name = fileName;
                return theBlob;
              }

              function dataURItoBlob(dataURI) {
                // convert base64/URLEncoded data component to raw binary data held in a string
                var byteString;
                if (dataURI.split(',')[0].indexOf('base64') >= 0)
                  byteString = atob(dataURI.split(',')[1]);
                else
                  byteString = unescape(dataURI.split(',')[1]);

                // separate out the mime component
                var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

                // write the bytes of the string to a typed array
                var ia = new Uint8Array(byteString.length);
                for (var i = 0; i < byteString.length; i++) {
                  ia[i] = byteString.charCodeAt(i);
                }

                return new File([ia], {
                  type: 'mimeString'
                });
              }
            };

            uploadPictureCtrl.$inject = ['$scope', '$rootScope', '$mdDialog', 'notifications', '$uploader'];

            mambatiFrameworkShell.controller('uploadPictureCtrl', uploadPictureCtrl);
          })();
    //--------------------------------------------------------------------------------------------------------uploadPictureCtrl end
