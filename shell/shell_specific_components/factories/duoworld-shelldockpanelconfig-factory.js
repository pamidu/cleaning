mambatiFrameworkShell.factory('dwShellPanelConfiguration', ['$http', function($http){
		retrun {
			getAllPanelConfiguration : function(){
				$http.get('local_data/dockPanelConfig.json').
					success(function(data, status ){

					}).
					error(function(){

					});
			}
		}
}]);