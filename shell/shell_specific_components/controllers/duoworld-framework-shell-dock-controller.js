//duoworld-framework-shell-dock-controller.js
(function () {
    var duoWorldFrameworkShellDockCtrl = function ($rootScope, $scope, $state, $rootScope, $presence, $auth, $apps, $helpers, $location) {
        $scope.globalAppRetrivel();
        // console.log('This is the dock controller');
        window.dwShellController = {
            refreshApps: function () {
                $rootScope.globalAppRetrivel();
            },
            openApp: function (ApplicationID, Name, JSON) {
                var quickLaunchUri = "launcher/customapp/" + ApplicationID + "/" + Name;
                $apps.setArguments(ApplicationID, JSON)
                $rootScope.$apply (function(){
                    $location.path(quickLaunchUri);                    
                });

            }
        }
        $scope.globalAppRetrivel();
        $scope.globalTenantRetrivel();
        $scope.shellDockConfig = [
            {
                "shellRelationship": "DuoWorld Alpha Shell v 1.0",
                "panelDescription": "Framework shell applications panel",
                "panelTitle": "applications",
                "pannnelDirectiveContentTemplate": "partials/panel-templates/applications-pannel.html",
                "panelArrangement": 0
			}
            , {
                "shellRelationship": "DuoWorld Alpha Shell v 1.0",
                "panelDescription": "Framework shell wiget panel",
                "panelTitle": "widgets",
                "pannnelDirectiveContentTemplate": "partials/panel-templates/widgets-pannel.html",
                "panelArrangement": 1
			}
		];
        /*
        	{
        		"shellRelationship": "DuoWorld Alpha Shell v 1.0",
        		"panelDescription": "Framework shell collections panel",
        		"panelTitle": "collections",
        		"pannnelDirectiveContentTemplate": "partials/panel-templates/collections-pannel.html",
        		"panelArrangement": 2
        	},
        */
        // $scope.gridsterOpts = {
        //     columns: 5, // the width of the grid, in columns
        //     pushing: true, // whether to push other items out of the way on move or resize
        //     floating: true, // whether to automatically float items up so they stack (you can temporarily disable if you are adding unsorted items with ng-repeat)
        //     swapping: false, // whether or not to have items of the same size switch places instead of pushing down if they are the same size
        //     width: 'auto', // can be an integer or 'auto'. 'auto' scales gridster to be the full width of its containing element
        //     colWidth: 'auto', // can be an integer or 'auto'.  'auto' uses the pixel width of the element divided by 'columns'
        //     rowHeight: 215, // can be an integer or 'match'.  Match uses the colWidth, giving you square widgets.
        //     margins: [10, 10], // the pixel distance between each widget
        //     outerMargin: true, // whether margins apply to outer edges of the grid
        //     isMobile: true, // stacks the grid items if true
        //     mobileBreakPoint: 600, // if the screen is not wider that this, remove the grid layout and stack the items
        //     mobileModeEnabled: true, // whether or not to toggle mobile mode when screen width is less than mobileBreakPoint
        //     minColumns: 1, // the minimum columns the grid must have
        //     minRows: 2, // the minimum height of the grid, in rows
        //     maxRows: 100,
        //     defaultSizeX: 1, // the default width of a gridster item, if not specifed
        //     defaultSizeY: 1, // the default height of a gridster item, if not specified
        //     minSizeX: 1, // minimum column width of an item
        //     maxSizeX: null, // maximum column width of an item
        //     minSizeY: 1, // minumum row height of an item
        //     maxSizeY: null, // maximum row height of an item
        //     resizable: {
        //        enabled: false,
        //        handles: ['n', 'e', 's', 'w', 'ne', 'se', 'sw', 'nw'],
        //        start: function(event, $element, widget) {}, // optional callback fired when resize is started,
        //        resize: function(event, $element, widget) {}, // optional callback fired when item is resized,
        //        stop: function(event, $element, widget) {} // optional callback fired when item is finished resizing
        //     },
        //     draggable: {
        //        enabled: true, // whether dragging items is supported
        //        handle: '.my-class', // optional selector for resize handle
        //        start: function(event, $element, widget) {}, // optional callback fired when drag is started,
        //        drag: function(event, $element, widget) {}, // optional callback fired when item is moved,
        //        stop: function(event, $element, widget) {} // optional callback fired when item is finished dragging
        //     }
        // };
        $scope.appGridsterOpts = {
            columns: 5,
            margins: [10, 10],
            outerMargin: true,
            rowHeight: 215,
            pushing: true,
            floating: true,
            defaultSizeX: 1,
            defaultSizeY: 1,
            draggable: {
                enabled: false
            },
            resizable: {
                enabled: false,
                handles: ['n', 'e', 's', 'w', 'se', 'sw']
            }
        };
        $scope.widgetGridsterOpts = {
            columns: 16,
            margins: [10, 10],
            swapping: true,
            outerMargin: true,
            rowHeight: 'match',
            isMobile: true,
            mobileModeEnabled: true,
            pushing: true,
            floating: true,
            defaultSizeX: 1,
            defaultSizeY: 1,
            draggable: {
                enabled: false
            },
            resizable: {
                enabled: false,
                handles: ['n', 'e', 's', 'w', 'se', 'sw']
            }
        };
    };
    duoWorldFrameworkShellDockCtrl.$inject = ['$rootScope', '$scope', '$state', '$rootScope', '$presence', '$auth', '$apps', '$helpers', '$location'];
    mambatiFrameworkShell.controller('duoworld-framework-shell-dock-ctrl', duoWorldFrameworkShellDockCtrl);
})();
