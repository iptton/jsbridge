(function(){
	var calls = {};
	var lastsn = 0;
	var iframe = document.createElement("iframe");
	iframe.style.cssText = "display:block;position:absolute;width:100px;height:100px;z-index:99999";
	var jb = {
		'call':_c,
		'callback':_cb
	};
	function _cb(){
	    console.error("_cb"+arguments.length);
		var args = Array.prototype.slice.call(arguments,0);
		var sn = args.shift();
		var cb = calls[''+sn];
		if(cb){
			if(!cb.call && 
				!window[cb] && 
				!(
					(cb = window[cb])
					 &&
					 cb.call)
				){
				console.error("no cb");
				return;
			}
			//alert(args.length);
			//setTimeout(function(){
			    cb.apply(window,args);
			//},0);
			console.info("_cb success"+args.length);
			delete calls[''+sn];
		}else{
		    console.error("no cb");
		}
	}
	function _c(name,args,cb){
		var args = Array.prototype.slice.call(arguments,0);
		if(args.length < 2)return false;
		var host = args.shift();
		var callback = args.pop();
		//console.info(obj,callback,method);
		calls[''+lastsn++] = callback;
		args.unshift(lastsn-1+"");
		var url = "jsbridge://"+host+"/?"+args.join("&");
		//window.location = url;

		document.body.appendChild(iframe);
		setTimeout(function(){
		iframe.onload = function(){
			var cb = calls[lastsn-1];
			if(cb){
				cb("error");
			}
			console.error("error..");
		}

		iframe.src = url;
		},0);
	}
	window.JsBridge = jb;
	window.iframe = iframe;
})();