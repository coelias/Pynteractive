//function MyClone(obj){
//    if(obj == null || typeof(obj) != 'object')
//        return obj;
//
//    var temp = {};
//    for(var key in obj)
//        temp[key] = MyClone(obj[key]);
//    return temp;
//}
//
//ErrorHandler= new function ErrHandler()
//{
//	this.report = function(type,msg)
//	{
//		alert (type+" : "+msg);
//	}
//}

var PYCON={
	websocket:null,
	connect: function(url)
	{
		this.websocket=new WebSocket(url);
		this.websocket.onopen =  this.onOpen;
		this.websocket.onclose =  this.onClose;
		this.websocket.onmessage = this.onMessage;
		this.websocket.onerror = this.onError;
	},
	onOpen: function(evt){PYCON.send("attach",{"name": DATAID});},
	onClose: function(evt){close();},
	onMessage: function(evt){
		jsonObj=JSON.parse(evt.data);
		fname=jsonObj[0];
		args=[].slice.call(jsonObj).splice(1);
		window["UIC"][fname].apply(this,args);

		},
	onError: function(evt){},
	send: function(funcname,params)
	{
		this.websocket.send(JSON.stringify([funcname,params]));
	}
}

