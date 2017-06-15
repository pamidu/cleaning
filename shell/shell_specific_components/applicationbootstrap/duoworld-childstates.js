/*DuoWorld Child State Configuration*/

mambatiFrameworkShell.config(function($stateProvider, $urlRouterProvider){

	$stateProvider
		//---------------------- authentication states ------------------------------------------
		.state('duoworld-frameworkentry.login',{
			url:'/login',
			templateUrl:'partials/frameworktemplates/duoworld-frameworkentry.login.html'
		})
		.state('duoworld-frameworkentry.register',{
			url:'/register',
			templateUrl: 'partials/frameworktemplates/duoworld-frameworkentry.register.html'
		})
		//---------------------- dock state -----------------------------------------------------
		.state('duoworld-framework.dock',{
			url:'/dock',
			templateUrl:'partials/frameworktemplates/duoworld-framework.dock.html',
			controller:'duoworld-framework-shell-dock-ctrl'
		})
		//---------------------- launcher state (parent to all below states) --------------------
		.state('duoworld-framework.launcher',{
			url:'/launcher',
			templateUrl:'partials/frameworktemplates/duoworld-framework.launcher.html',
			controller:'duoworld-framework-shell-launcher-ctrl'
		})
		//---------------------- launcher default app states (child to launcher state) ----------
		.state('duoworld-framework.launcher.marketplace',{
			url:'/marketplace',
			templateUrl:'partials/frameworktemplates/duoworld-framework.launcher.marketplace.html'
			//controller:'duoworld-framework-shell-launcher-marketplace-ctrl'
		})
		.state('duoworld-framework.launcher.userprofile',{
			url:'/userprofile',
			templateUrl:'partials/frameworktemplates/duoworld-framework.launcher.userprofile.html',
			//controller:'duoworld-framework-shell-launcher-userprofile-ctrl'
		})
		.state('duoworld-framework.launcher.tennantexplorer',{
			url:'/tennantexplorer',
			templateUrl:'partials/frameworktemplates/duoworld-framework.launcher.tennantexplorer.html',
			//controller:'duoworld-framework-shell-launcher-tennantexplorer-ctrl'
		})
		.state('duoworld-framework.launcher.settings',{
			url:'/settings',
			templateUrl:'partials/frameworktemplates/duoworld-framework.launcher.settings.html',
			//controller:'duoworld-framework-shell-launcher-settings-ctrl'
		})
		.state('duoworld-framework.launcher.connect',{
			url:'/connect',
			templateUrl:'partials/frameworktemplates/duoworld-framework.launcher.connect.html',
			//controller:'duoworld-framework-shell-launcher-connect-ctrl'
		})
		//---------------------- launcher custom app state (child to launcher) -------------------
		.state('duoworld-framework.launcher.customapps',{
			url:'/customapps/:childAppID/:childAppName',
			templateUrl:'partials/frameworktemplates/duoworld-framework.launcher.customapps.html',
			controller:'duoworld-framework-shell-launcher-customapps-ctrl'
		})
		//---------------------- launcher test app state (child to launcher) ---------------------
		.state('duoworld-framework.launcher.childtestapp',{
			url:'/childtestapp',
			templateUrl:'partials/frameworktemplates/duoworld-framework.launcher.childtestapp.html',
			controller:'duoworld-framework-shell-launcher-childtestapp-ctrl'
		});
});