function uuid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

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
	onOpen: function(evt){
		PYCON.send("attach" ,{"name": DATAID});
		PYCON.send("refresh",{"name": DATAID});
		},
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
		var msg=JSON.stringify([funcname,params]);
		this.websocket.send(msg);
	}	
}


