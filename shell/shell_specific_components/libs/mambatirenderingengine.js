angular.module('mambatiRenderingEngine',[])

.directive('proxy', ['$parse', '$injector', '$compile', function ($parse, $injector, $compile) {
    return {
        replace: true,
        link: function (scope, element, attrs) {
            var nameGetter = $parse(attrs.proxy);
            var name = nameGetter(scope);
            var value = undefined;
            if (attrs.proxyValue) {
              var valueGetter = $parse(attrs.proxyValue);
              value = valueGetter(scope);
            }
    
            var directive = $injector.get(name.component + 'Directive')[0];
            if (value !== undefined) {
                attrs[name.component] = value;
            }
            var a = $compile(directive.template)(scope);
            element.replaceWith(a);
        }
    }
}]);