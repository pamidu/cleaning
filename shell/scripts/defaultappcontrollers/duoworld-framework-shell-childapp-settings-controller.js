//duoworld-framework-shell-launcher-settings-ctrl

(function () {

    var duoworldFrameworkShellLauncherSettingsControl = function ($rootScope, $scope, $state, $objectstore, $http, $rootScope, ngDialog, $timeout, $mdToast, $mdDialog, $uploader, $auth) {

        /*Dont touch This*/
        $scope.childApplicationClose = function () {
            $state.go('dock');
        };

        $scope.childApplicationMinimise = function () {
            $state.go('dock');
        };

        /*Do what you want !*/

        $scope.defaultThemes = [
            {
                primarypaletteName: 'red',
                primarypalette: '#F44336',
                accentpalette: '#FFC107'
            },
            {
                primarypaletteName: 'pink',
                primarypalette: '#E91E63',
                accentpalette: '#CDDC39'
            },
            {
                primarypaletteName: 'puple',
                primarypalette: '#9C27B0',
                accentpalette: '#00BCD4'
            },
            {
                primarypaletteName: 'deep-purple',
                primarypalette: '#673AB7',
                accentpalette: '#FF5722'
            },
            {
                primarypaletteName: 'indigo',
                primarypalette: '#3F51B5',
                accentpalette: '#FF4081'
            },
            {
                primarypaletteName: 'blue',
                primarypalette: '#2196F3',
                accentpalette: '#607D8B'
            },
            {
                primarypaletteName: 'light-blue',
                primarypalette: '#03A9F4',
                accentpalette: '#FF5252'
            },
            {
                primarypaletteName: 'cyan',
                primarypalette: '#00BCD4',
                accentpalette: '#FFC107'
            },
            {
                primarypaletteName: 'teal',
                primarypalette: '#009688',
                accentpalette: '#FF9800'
            },
            {
                primarypaletteName: 'green',
                primarypalette: '#4CAF50',
                accentpalette: '#7C4DFF'
            },
            {
                primarypaletteName: 'light-green',
                primarypalette: '#8BC34A',
                accentpalette: '#607D8B'
            },
            {
                primarypaletteName: 'lime',
                primarypalette: '#CDDC39',
                accentpalette: '#00BCD4'
            },
            {
                primarypaletteName: 'yellow',
                primarypalette: '#FFEB3B',
                accentpalette: '#536DFE'
            },
            {
                primarypaletteName: 'amber',
                primarypalette: '#FFC107',
                accentpalette: '#03A9F4'
            },
            {
                primarypaletteName: 'orange',
                primarypalette: '#FF9800',
                accentpalette: '#009688'
            },
            {
                primarypaletteName: 'deep-orange',
                primarypalette: '#FF5722',
                accentpalette: '#CDDC39'
            },
            {
                primarypaletteName: 'brown',
                primarypalette: '#795548',
                accentpalette: '#CDDC39'
            },
            {
                primarypaletteName: 'grey',
                primarypalette: '#9E9E9E',
                accentpalette: '#00BCD4'
            },
            {
                primarypaletteName: 'blue-grey',
                primarypalette: '#607D8B',
                accentpalette: '#FFC107'
            }
		];

        $scope.defaultWallPapers = [
            {
                imgUrl: './images/shellassets/background/blur-background01.jpg'
            },
            {
                imgUrl: './images/shellassets/background/blur-background02.jpg'
            },
            {
                imgUrl: './images/shellassets/background/blur-background03.jpg'
            },
            {
                imgUrl: './images/shellassets/background/blur-background04.jpg'
            },
            {
                imgUrl: './images/shellassets/background/blur-background05.jpg'
            },
            {
                imgUrl: './images/shellassets/background/blur-background06.jpg'
            },
            {
                imgUrl: './images/shellassets/background/blur-background07.jpg'
            },
            {
                imgUrl: './images/shellassets/background/blur-background08.jpg'
            },
            {
                imgUrl: './images/shellassets/background/blur-background09.jpg'
            },
            {
                imgUrl: './images/shellassets/background/blur-background10.jpg'
            },
            {
                imgUrl: './images/shellassets/background/blur-background11.jpg'
            },
            {
                imgUrl: './images/shellassets/background/blur-background12.jpg'
            },
            {
                imgUrl: './images/shellassets/background/blur-background13.jpg'
            },
            {
                imgUrl: './images/shellassets/background/blur-background14.jpg'
            },
            {
                imgUrl: './images/shellassets/background/blur-background15.jpg'
            },
            {
                imgUrl: './images/shellassets/background/blur-background16.jpg'
            },
            {
                imgUrl: './images/shellassets/background/blur-background17.jpg'
            },
            {
                imgUrl: './images/shellassets/background/blur-background18.jpg'
            },
            {
                imgUrl: './images/shellassets/background/blur-background124.jpg'
            }
		];

        $scope.changeTheme = function (selectedTheme) {
            console.log(selectedTheme);
            $rootScope.shellConfig.themeconfiguration.palettename = selectedTheme.primarypaletteName;
            $rootScope.shellConfig.themeconfiguration.primarypalette = selectedTheme.primarypalette;
            $rootScope.shellConfig.themeconfiguration.accentpalette = selectedTheme.accentpalette;
        };

        $scope.changeWallPaper = function (wallPaper) {
            $mdDialog.hide();
            $rootScope.shellConfig.backgroundconfiguration[2].backgroundimageconfig.imageurl = wallPaper.imgUrl;
        };

        $scope.saveGlobalSettings = function () {
            console.log($rootScope.shellConfig);
            $rootScope.shellConfig.username = $auth.getUserName();
            var client = $objectstore.getClient("shellconfig");
            client.onComplete(function (data) {
                console.log(data);
                $mdToast.show(
                    $mdToast.simple()
                    .content('Changes have been saved !')
                    .hideDelay(3000)
                );
            });
            client.onError(function (data) {
                console.log(data);
                $mdToast.show(
                    $mdToast.simple()
                    .content('Something went wrong!')
                    .hideDelay(3000)
                );
            });
            client.insert($rootScope.shellConfig, {
                KeyProperty: "username"
            });

        };

        $scope.hideProgress = true;
        $scope.getMyWallpapers = function () {
            console.log("getting my wallpapers");
            var client = $objectstore.getClient("duosoftware.com", "shellConfigWallpapers", true);
            client.onGetMany(function (data, status, headers, config) {
                console.log(data);
                $scope.hideProgress = false;
            });
            client.onError(function (data, status, headers, config) {
                console.log(data, status);
            });

            client.getByKey($auth.getUserName());
        };

        $scope.showDefaultWallpapers = function (ev) {
            $mdDialog.show({
                    controller: 'duoworld-framework-shell-launcher-settings-ctrl',
                    templateUrl: 'partials/modal-templates/partials.modal-templates.defaultwallpapers.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true
                })
                .then(function (answer) {

                }, function () {

                });
        };

        $scope.showMyWallpapers = function (ev) {
            $scope.getMyWallpapers();
            $mdDialog.show({
                    controller: 'duoworld-framework-shell-launcher-settings-ctrl',
                    templateUrl: 'partials/modal-templates/partials.modal-templates.mywallpapers.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true
                })
                .then(function (answer) {

                }, function () {

                });
        };
        $scope.uploadingWallpaper = false;
        $scope.uploadNewWallpaper = function () {
            $mdDialog.hide();
            document.getElementById("selectPicture").click();
        };

        $scope.file_changed = function (element) {
            $scope.uploadingWallpaper = true;
            var photofile = element.files[0];
            console.log(photofile, $auth.getUserName());
            $uploader.upload("duosoftware.com", "shellConfigWallpapers", photofile, $auth.getUserName(), true);
            $uploader.onSuccess(function (e, data) {
                $mdToast.show(
                    $mdToast.simple()
                    .content('Successfully uploaded wallpaper!')
                    .hideDelay(3000)
                );
                $scope.uploadingWallpaper = false;
                $scope.changeWallPaper(photofile);
            });

            $uploader.onError(function (e, data) {
                $mdToast.show(
                    $mdToast.simple()
                    .content('SOmething went wrong !')
                    .hideDelay(3000)
                );
                $scope.uploadingWallpaper = false;
            });

        };

        $scope.showAddNewPanel = function (ev) {
            $mdDialog.show({
                    controller: 'duoworld-framework-shell-launcher-settings-ctrl',
                    templateUrl: 'partials/modal-templates/partials.modal-templates.addnewpanel.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true
                })
                .then(function (answer) {

                }, function () {

                });
        };

        $scope.addNewPanel = function () {
            $mdDialog.hide();
            console.log($scope.newPanelTitle);
            var obj = {
                "shellRelationship": "DuoWorld Alpha Shell v 1.0",
                "panelDescription": "Framework shell applications panel",
                "panelTitle": $scope.newPanelTitle,
                "pannnelDirectiveContentTemplate": "partials/panel-templates/collections-pannel.html",
                "panelArrangement": $rootScope.shellConfig.docklayoutconfiguration.pannelcollection.length,
                "pannelContentCollectionType": "application-component"
            };
            $rootScope.shellConfig.docklayoutconfiguration.pannelcollection.push(obj);
            $mdToast.show(
                $mdToast.simple()
                .content('Successfully added panel!')
                .hideDelay(3000)
            );
        };

        $scope.close = function () {
            $mdDialog.cancel();
        };

    };

    duoworldFrameworkShellLauncherSettingsControl.$inject = ['$rootScope', '$scope', '$state', '$objectstore', '$http', '$rootScope', 'ngDialog', '$timeout', '$mdToast', '$mdDialog', '$uploader', '$auth'];

    mambatiFrameworkShell.controller('duoworld-framework-shell-launcher-settings-ctrl', duoworldFrameworkShellLauncherSettingsControl);
})();
