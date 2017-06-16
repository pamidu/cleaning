p_payment_portal_module.controller("portalInteractdocumentCtrl", ["$scope", "$timeout","$state","$location","$invoiceNav",function ($scope, $timeout, $state, $location,$invoiceNav){
	var obj = $invoiceNav.getObject();
	console.log(obj)
    $scope.switchportalViews = function(switchedState){
        $state.go(switchedState);
    };

    $scope.userState = '';
    $scope.states = ('Stripe Paypal ').split(' ').map(function (state) { 

            	return { abbrev: state };

            	 });



}]);