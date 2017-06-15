(function()
{
	'use strict';

angular
.module('currencyFilter',[])

.directive('format', format);
	function format($filter){
		return {
			require: '?ngModel',
			restrict : 'A',
			scope : {
			format : '='
			},
			link: function (scope, elem, attrs, ctrl) {
				if (!ctrl) return;
				setVal();
				function setVal(){
				ctrl.$formatters.unshift(function (a) {
					if(scope.format == undefined)
					{
						return ( scope.format + ctrl.$modelValue)
					}
					else
					{
						return ( scope.format +" "+ ctrl.$modelValue)
					}
				
				});
				elem.bind('blur', function(event) {
				var plainNumber = elem.val().replace(/[^\d|\-+|\.+]/g, '');
				elem.val (scope.format + plainNumber);
				});
				}
			}
		};
	}

})();