(function(cc) {
	var $h;

	function gh() {
		var h = window.location.hostname;
		if(h.indexOf("localhost") != -1 || h.indexOf("127.0.0.1") != -1) {
			h = "downduocom.space.duoworld.duoweb.info";
		}
		return h + "/payapi";
	}

	function Request() {
		var u, p, sfn, ffn;

		function call() {
			if(sfn && ffn){

				var req = {
					method: p ? "POST" : "GET" ,
					url: "http://" + gh() + u,
					headers: {'Content-Type': 'application/json'}
				}
				if(p) req.data = p;
				$h(req)
					.success(function(data, status, headers, config) {
						if(status === 200) sfn(data);
						else ffn(data);
					}).
					error(function(data, status, headers, config) {
						ffn(data);
					})
			}
		}

		return {
			r : function(ur) { u=ur; return this; },
			d : function(dt) { p=dt; return this; },
			success : function(fn) { sfn=fn; call(); return this; },
			error : function(fn) { ffn=fn; call(); return this; }
		}
	}

    function PaymentProxy() {
        var r = new Request();
        return {
            getAccounts : function() { r.r('/account/get'); return r; },
            newCard : function(b) { r.r('/account/false').d(b); return r;},
            pay : function(b) { r.r('/transaction/paystrip').d(b); return r; },
            getTransactions : function(a) { r.r('/transaction/get/' + a); return r; }
        }
    }

	cc.factory('$charge', ['$http', function ($http) {
		$h = $http;
		return {
            payment : PaymentProxy
		};
	}])

})(angular.module("cloudcharge", []))


