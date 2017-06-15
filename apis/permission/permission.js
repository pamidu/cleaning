(function(permmod){

    permmod.factory('$permission', function($http, $auth) {

        var permData;
        function getPermission($scope, callback){

            $scope.$permission = function(mod,typ){return true;};
            
            $http.get("/apis/permission/get/" + $auth.getUserName(), {withCredential : true})
            .then(function(data) {
                permData =  data.data;
                
                $scope.$permission = function(mod, typ){
                    for (pi in permData)
                    if (permData[pi].appName === mod) return !permData[pi][typ];
                    return true;
                } 

                if (callback) callback({success:true, premissions: data.data});
            }, function(){
                if (callback) callback({success:false});
            });
        }

        return {
            get: getPermission
        }
    });

})(angular.module ("12thdoorPermission",["uiMicrokernel"]));
