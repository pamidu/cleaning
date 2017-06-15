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

				var config = $scope.config;
				if(!config.hasOwnProperty('publishKey')){
					console.error("Stripe api key not provided."); return;
				}

				var handler = (function() {

					var handler = StripeCheckout.configure({
						key: config.publishKey,
						image: config.logo,
						panelLabel: config.label,
						token: function(token) {
							$rootScope.$broadcast('stripe-token-received', token);
						}
					});

					var open = function(ev) {
						handler.open({
							name: config.title,
							description: config.description
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
			link: function (scope, element, attrs) {
				element.bind('click', function(ev) {
					scope.open(ev);
				});

				angular.element($window).on('popstate', function() {
					scope.close();
				});

			}
		};

	}]);
	
	spt.factory('paymentGateway', [function () {
		
		var stripeHandler = function() {
			var config, handler, callback;

			function init() {
				handler = StripeCheckout.configure({
					key: config.publishKey,
					image: config.logo,
					panelLabel: config.label,
					token: function(token, args) {
						callback(token, args)
					} 
				});
			}

			function open(ev, fn) {	
				
				if(!handler) return;
				callback = fn;

				handler.open({
					name: config.title,
					description: config.description
				});

				ev.preventDefault();
			}

			window.addEventListener('popstate', function() {
	  			handler.close();
			});
	
			return {
				configure: function(c) { config = c; init(); return this;},
				open: open,
				close: close
			};

		}

		var paypalHandler = function() {
			// paypal payment gateway handling goes here. 
		}

		function setup(pgn) {
			var paygateway; 
			pgn = pgn.toLowerCase();
			switch(pgn) {
				case 'stripe':
					paygateway = new stripeHandler(); break;
				case 'paypal':
					paygateway = new paypalHandler(); break;
			}

			return paygateway;

		}
	
		return {
			setup: setup
		};

	}]);

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
