// Covered by GPL V2.0
// Coded by Carlos del Ojo Elias (deepbit@gmail.com)



//////////// JSON B64treatment ////////////////
function isArray(o) {
	  return Object.prototype.toString.call(o) === '[object Array]'; 
}

function B64_Object_decoder(obj)
{
	if (typeof(obj) != "object")
		return;
	else 
	{
		if (isArray(obj))
		{
			for (var i in obj)
			{
				if (typeof(obj[i])=="object")
				{
					if (typeof(obj[i].__b64)=="string")
						obj.splice(i,1,b64decode(obj[i].__b64));
					else
						B64_Object_decoder(obj[i]);
				}
			}
		}
		else
		{
			for (var i in obj)
			{
				if (typeof(obj[i])=="object")
				{
					if (typeof(obj[i].__b64)=="string")
					{
						var cad=obj[i].__b64
						delete obj[i];
						obj[i]=b64decode(cad);
					}
					else
						B64_Object_decoder(obj[i]);
				}
			}
		}
	}
}

function B64_Object_encoder(obj)
{
	if (typeof(obj) != "object")
		return;
	else 
	{
		if (isArray(obj))
		{
			for (var i in obj)
			{
				if (typeof(obj[i])=="object")
					B64_Object_encoder(obj[i]);
				else if (typeof(obj[i])=="string")
					obj[i]={__b64: b64encode(obj[i])};
			}
		}
		else
		{
			for (var i in obj)
			{
				if (typeof(obj[i])=="object")
					B64_Object_encoder(obj[i]);
				else if (typeof(obj[i])=="string")
					obj[i]={__b64: b64encode(obj[i])};

			}
		}
		return obj;
	}
}
//////////// HTML entity encoder/decored ////////////////////////////
//

function HtmlEncode(str)
{
  return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}


function HtmlDecode(str)
{
  return str.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&apos;/g,"'");
}

///////////// MYsql Char Encoding ///////////////////////
function MysqlEncode(str)
{
	var output = Array();
	var x = 0;
	str = str.toString();
	while (x < str.length) { output.push(str.charCodeAt(x)); x++; }
	return "CHAR("+output.join(",")+")";;
}

///////////// MSSQL Char Encoding ///////////////////////
function MSSQLEncode(str)
{
	var output = Array();
	var x = 0;
	str = str.toString();
	while (x < str.length) { output.push("CHAR("+str.charCodeAt(x)+")"); x++; }
	return output.join("+");
}


///////////// Oracle Char Encoding ///////////////////////
function OracleEncode(str)
{
	var output = Array();
	var x = 0;
	str = str.toString();
	while (x < str.length) { output.push("CHR("+str.charCodeAt(x)+")"); x++; }
	return output.join("+");
}
/////////// BASE64 ENCODING ///////////////////////////////////////////////////

function _utf8_encode (cad) {
	cad = cad.replace(/\r\n/g,"\n");
	var utftext = "";

	for (var n = 0; n < cad.length; n++) {

		var c = cad.charCodeAt(n);

		if (c < 128) { utftext += String.fromCharCode(c); }
		else if((c > 127) && (c < 2048)) { utftext += String.fromCharCode((c >> 6) | 192);
			utftext += String.fromCharCode((c & 63) | 128); }
		else { utftext += String.fromCharCode((c >> 12) | 224);
			utftext += String.fromCharCode(((c >> 6) & 63) | 128);
			utftext += String.fromCharCode((c & 63) | 128); }
	}
	return utftext;
}

function _utf8_decode (utftext) {
	var string = "";
	var i = 0;
	var c = c1 = c2 = 0;

	while ( i < utftext.length ) {
		c = utftext.charCodeAt(i);
		if (c < 128) { string += String.fromCharCode(c);
			i++; }
		else if((c > 191) && (c < 224)) { c2 = utftext.charCodeAt(i+1);
			string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
			i += 2; }
		else { c2 = utftext.charCodeAt(i+1);
			c3 = utftext.charCodeAt(i+2);
			string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
			i += 3; }
	}
	return string;
}


function b64encode (input) {
	var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
	var output = "";
	var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
	var i = 0;

	input = _utf8_encode(input);
	while (i < input.length) {
		chr1 = input.charCodeAt(i++);
		chr2 = input.charCodeAt(i++);
		chr3 = input.charCodeAt(i++);
		enc1 = chr1 >> 2;
		enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
		enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
		enc4 = chr3 & 63;
		if (isNaN(chr2)) { enc3 = enc4 = 64; } 
		else if (isNaN(chr3)) { enc4 = 64; }
		output = output + _keyStr.charAt(enc1) + _keyStr.charAt(enc2) + _keyStr.charAt(enc3) + _keyStr.charAt(enc4);
	}
	return output;
}

function b64decode (input) {
	var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
	var output = "";
	var chr1, chr2, chr3;
	var enc1, enc2, enc3, enc4;
	var i = 0;

	input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
	while (i < input.length) {
		enc1 = _keyStr.indexOf(input.charAt(i++));
		enc2 = _keyStr.indexOf(input.charAt(i++));
		enc3 = _keyStr.indexOf(input.charAt(i++));
		enc4 = _keyStr.indexOf(input.charAt(i++));
		chr1 = (enc1 << 2) | (enc2 >> 4);
		chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
		chr3 = ((enc3 & 3) << 6) | enc4;
		output = output + String.fromCharCode(chr1);
		if (enc3 != 64) { output = output + String.fromCharCode(chr2); }
		if (enc4 != 64) { output = output + String.fromCharCode(chr3); }
	}
	output = _utf8_decode(output);
	return output;
}

/////////// URL AND HEX ENCODING ///////////////////////////////////////////////////

function URLEncode (clearString) {
	var output = '';
	var x = 0;
	clearString = clearString.toString();
	var regex = /(^[a-zA-Z0-9_.]*)/;
	while (x < clearString.length) {
		var match = regex.exec(clearString.substr(x));
		if (match != null && match.length > 1 && match[1] != '') {
			output += match[1];
			x += match[1].length;
		} else {
			if (clearString.charCodeAt(x) == 32)
				output += '+';
			else {
				var charCode = clearString.charCodeAt(x);
				var hexVal = charCode.toString(16);
				output += '%' + ( hexVal.length < 2 ? '0' : '' ) + hexVal.toUpperCase();
			}
			x++;
		}
	}
	return output;
}

function URLDecode (encodedString) {
	var output = encodedString;
	var binVal, thisString;
	var myregexp = /(%[^%]{2})/;
	while ((match = myregexp.exec(output)) != null
			&& match.length > 1
			&& match[1] != '') {
		binVal = parseInt(match[1].substr(1),16);
		thisString = String.fromCharCode(binVal);
		output = output.replace(match[1], thisString);
	}
	return output;
}

function HexEncode (clearString) {
	var output = '';
	var x = 0;
	clearString = clearString.toString();
	while (x < clearString.length) {
			var charCode = clearString.charCodeAt(x);
			var hexVal = charCode.toString(16);
			output += '%' + ( hexVal.length < 2 ? '0' : '' ) + hexVal.toUpperCase();
			x++;
		}
	return output;
	}


function EnDe (item,ev)
{
	var c=item.elem;
	var sel=new Selection(c);
	sel=sel.create()
	var func=item.handler2;

	var len=c.value.length;
	var start=sel.start;
	var end=sel.end;
	var size=end-start;
	var size2=len-end;

	res=func(c.value.substr(start,size));
	c.value=c.value.substr(0,start)+res+c.value.substr(end,size2);
}

function encodingsMenu(obj)
{
	total=Array();
	EncodeMenu=Array();
	DecodeMenu=Array();

	EncodeMenu.push({ text: 'Url encoding', elem: obj, handler2: URLEncode, handler: EnDe });
	EncodeMenu.push({ text: 'Hex encoding (%xx)', elem: obj, handler2: HexEncode, handler: EnDe });
	EncodeMenu.push({ text: 'Base64 encoding', elem: obj, handler2: b64encode, handler: EnDe });
	EncodeMenu.push({ text: 'Html encoding (entities)', elem: obj, handler2: HtmlEncode, handler: EnDe });
	EncodeMenu.push({ text: 'Mysql Encode CHAR(,,,)', elem: obj, handler2: MysqlEncode, handler: EnDe });
	EncodeMenu.push({ text: 'MsSQL Encode CHAR()+', elem: obj, handler2: MSSQLEncode, handler: EnDe });
	EncodeMenu.push({ text: 'Oracle Encode CHR()+', elem: obj, handler2: OracleEncode, handler: EnDe });

	DecodeMenu.push({ text: 'Url/Hex Decode', elem: obj, handler2: URLDecode, handler: EnDe });
	DecodeMenu.push({ text: 'Base64 decode', elem: obj, handler2: b64decode, handler: EnDe });
	DecodeMenu.push({ text: 'Html decode (entities)', elem: obj, handler2: HtmlDecode, handler: EnDe });


	total.push({ text: 'Encode...', icon: 'images/en.png',  menu: {items: EncodeMenu}});
	total.push({ text: 'Decode...', icon: 'images/de.png', menu: {items: DecodeMenu}});

	return total;

}
