function MyClone(obj){
    if(obj == null || typeof(obj) != 'object')
        return obj;

    var temp = {};
    for(var key in obj)
        temp[key] = MyClone(obj[key]);
    return temp;
}

ErrorHandler= new function ErrHandler()
{
	this.report = function(type,msg)
	{
		alert (type+" : "+msg);
	}
}



SC= new function ServerConnector()
{
	this.send = function(funcname,objOrig,ReqCallBack)
	{
		obj=MyClone(objOrig);
		B64_Object_encoder(obj);

		xmlhttp = new XMLHttpRequest();
		xmlhttp.onreadystatechange = function() {
			if (xmlhttp.readyState == 4 ) {
				SC.callback(funcname,xmlhttp.status,xmlhttp.responseText,ReqCallBack)
			}
			}

		xmlhttp.open("POST", "wfcom", true);
		xmlhttp.send("fname="+funcname+"&data="+JSON.stringify(obj));
	}

	this.callback = function (funcname,succ,response,ReqCallBack){
				objstr="{";
				for (var i in obj)
				{objstr+=i+": "+obj[i]+", ";}
				objstr+="}";

				if (succ!=200) { ErrorHandler.report("Communication error",response.statusText+"-"+funcname+"-"+objstr); }
				else
				{
					obj=JSON.parse(response);
					B64_Object_decoder(obj);
					if (!("success" in obj)) { ErrorHandler.report("Core error",response.responseText);  }
					else 
					{
						if (obj.success)
						{
							ReqCallBack(obj.result);
						}
						else { ErrorHandler.report("Application error",obj.error);}
					}
				}
			}
}
