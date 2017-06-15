	/*
	- Stripe Payemnt Tool -
		Version 1.0.1
*/

(function(spt) {

	spt.directive('stripePayment', ['$window', function ($window) {
		return {
			restrict: 'A',
			scope: {
				config: '=stripePayment'
			},
			controller: ['$scope', '$rootScope', function ($scope, $rootScope) {

				// var config = $scope.config;

				var handler = (function() {

					

					var open = function(ev) {

						var handler = StripeCheckout.configure({
							key: $scope.config.publishKey,
							image: $scope.config.logo,
							panelLabel: $scope.config.label,
							token: function(token) {
								$rootScope.$broadcast('stripe-token-received', token);
							}
						});
						handler.open({
							name: $scope.config.title,
							description: $scope.config.description
						});

						ev.preventDefault();
					}

					var close = function() {
						handler.close();
					}

					return {
						open: open,
						close: close
					}

				})();

				$scope.open = handler.open;
				$scope.close = handler.close;

			}],
			link: function (scope, element, attrs,rootScope) {
				// element.bind('click', function(ev) {
				// 	scope.open(ev);
				// });

				angular.element($window).on('popstate', function() {
					scope.close();
				});


				scope.$on('call_stripe',function(ev,config){
					// scope.config = config;
					scope.open(ev);
				})

			}
		};

	}])

})(angular.module('stripe-payment-tools', []));

/* 
	How to use
	----------
	
	first include these dependencies to your script.
		-	angular.min.js 
				<script type="text/javascript" src="angular.min.js"></script>
		- 	checkout.js
				<script src="https://checkout.stripe.com/checkout.js"></script>

	secondly link stripe.payment.tool.js to your script.
		<script src="stripe.payment.tool.js"></script>

	use stripe payment directive in your html page
		<button stripe-payment>New Card</button>

	inject 'stripe-payment-tools' module to your angular module.
		angular.module('stripe-app', ['stripe-payment-tools'])

	you can change configurations of payment tool. just bind config object to directive
		<button stripe-payment="config">New Card</button>

		declare config object in you controller
			$scope.config = {
				title: 'Duoworld',
				description: "for connected business",
				logo: 'img/small-logo.png',
				label: 'New Card',
			}
	
	catch token that genarated by stripe as below.
		$scope.$on('stripe-token-received', function(event, args) {
			console.log(args);
		});

**	feel free to change the directive.

*/
