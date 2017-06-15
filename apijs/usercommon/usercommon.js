(function(ps){
	var $h;
	var $o;
	var s_e, s_b, s_i;
	var ct;

	function gh(b){
	    var h = window.location.hostname;
	    if (h.indexOf("localhost") !=-1 || h.indexOf("127.0.0.1") !=-1)
	    	h="localhost:81";

	    return h + (b ? b :"/apis/usercommon");
	}

	function BP(){
		var sfn,ffn, u, b,l,fd,par;
		function call(){
			if (sfn && ffn){
				if (s_b) s_b();
				if (u){
					var hd;
					if (ct != "-"){
						ct = ct ? ct : "application/json";
					 	hd = {'Content-Type': ct};
					} else hd = {};
					var reqObj = {method: b ? "POST" : "GET" ,url: "http://" + gh() + u, headers: hd};
					if (b) reqObj.data = b;
					if (ct == "-") reqObj.transformResponse= undefined;
					if (fd){
						var frd = new FormData();
        				frd.append('file', fd);
        				reqObj.data = frd;
					}

					$h(reqObj).
					  success(function(data, status, headers, config) {
					  	if (s_i) s_i();
						if (status == 200){
							if (par && angular.isString(data))
								data = JSON.parse(data);

							sfn(data);
						} 			  
						else ffn(data);
					  }).
					  error(function(data, status, headers, config) {
					  	if (s_i) s_i();
				  		ffn(data);
				  		if (s_e) s_e();
					  });
				}else{
					l(sfn,ffn);
					if (s_i) s_i();
				}
			}
		}
		return {
			success: function(f){sfn=f;call();return this;},
			error: function(f){ffn=f;call();return this;},
			p: function(ur){u=ur;return this;},
			b: function(j){b =j;return this;},
			l: function(lo){l=lo},
			ct: function(c){ct=c},
			fd: function(d){fd=d},
			parse: function(){par=true;}
		}
	}

	ps.factory('$user', function($http, $objectstore){
		$h = $http;
		$o = $objectstore;
		return {
			tenant: function(){ return new ContactProxy();},
		}	
	});


	function StateProxy(){
		var p = BP();
		p.busy = function(f){s_b = f; return p;}
		p.idle = function(f){s_i = f; return p;}
		p.error = function(f){s_e = f; return p;}
		p.setBusy = function(){if (s_b) s_b();};
		p.setIdle = function(){if (s_i) s_i();};
		return p;
	}

	function ContactProxy(){
		var p = BP();
		p.all = function(){p.p("/tenant/users").parse(); return p;}
		return p;
	}

})(angular.module("duoworldUserCommon", ["uiMicrokernel"]));