RegExp.prototype.findAll = function(str) {
  var match = null, results = [];
  while ((match = this.exec(str)) !== null) {
    switch (match.length) {
      case 1:
        results[results.length] = match[0];
        break;
      case 2:
        results[results.length] = match[1];
        break;
      default:
        results[results.length] = match.slice(1);
    }
    if (!this.global) {
      break;
    }
  }
  return results;
}

RegExp.findAll = function(re, str, flags) {
  if (Object.prototype.toString.call(re) != '[object RegExp]') {
    re = new RegExp(re, flags);
  }
  return re.findAll(str);
}

function NewickNode()
{
	this.name="";
	this.len=0.0;
	this.acumlen=0.0;
	this.angle=0;
	this.children=[];
	this.dad=null;
	this.position=0;
	this.widthpixels=0
	this.minim=0;
	this.maxim=0;
	this.totminim=0;
	this.totmaxim=0;
	this.minangl=0;
	this.maxangl=0;
	this.height=0;
	this.selected=false;
	this.features={};
	this.heatmaps={};
	this.collapsed=false;
	this.strokecolor=[0,0,0];
	this.marked=null;
	this.shapes=[];

	this.setSelected=function()
	{
		this.selected=true;
		for (var i=0;i<this.children.length;i++)
		{this.children[i].setSelected();}
	}

	this.setColor=function(c)
	{
		this.strokecolor=c;
		for (var i=0;i<this.children.length;i++)
		{this.children[i].setColor(c);}

	}

	this.setMark=function(c)
	{
		this.marked=c;
	}

	this.clearSelected=function()
	{
		this.selected=false;
		for (var i=0;i<this.children.length;i++)
		{this.children[i].clearSelected();}
	}

	this.maxDistance=function()
	{
		if (!this.children.length)
			{return this.len;}
		return this.len+Math.max.apply(null,this.children.map(function(x){return x.maxDistance()}))
	}

	this.calcTreeCoordinates=function(sep,factor)
	{
		res=this._calcTreeCoordinates(0,sep,factor);
		this.height=res[1];
	}

	this._calcTreeCoordinates=function(position,sep,factor)
	{
		this.widthpixels=this.len*factor;
		if (!this.children.length)
		{
			this.minim=this.maxim=this.totminim=this.totmaxim=this.position=position;
			return [position,position+sep];
		}
		else
		{
			if (this.collapsed)
			{
				this.position=position;
				return [position,position+sep];
			}
			var tot=0;
			var posics=[];
			var maxims=[];
			var minims=[];
			for (var i=0;i<this.children.length;i++)
			{
				res=this.children[i]._calcTreeCoordinates(position,sep,factor)
				position=res[1];
				tot+=res[0];
				posics.push(res[0]);
				maxims.push(this.children[i].totmaxim);
				minims.push(this.children[i].totminim);
			}
			this.position=tot/i;
			this.maxim=Math.max.apply(null,posics);
			this.minim=Math.min.apply(null,posics);
			this.totminim=Math.min.apply(null,minims);
			this.totmaxim=Math.max.apply(null,maxims);
			return [this.position,position];
		}
	}

	this.calculateAngles=function(factor,widthfactor)
	{
		this.shapes=[];
		this.angle=Number((this.position*factor).toFixed(5));
		if (!this.collapsed)
		{
			for (var i=0;i<this.children.length;i++)
			{this.children[i].calculateAngles(factor,widthfactor);}
		}
		this.minangl=Number((this.minim*factor).toFixed(5));
		this.maxangl=Number((this.maxim*factor).toFixed(5));
		if (this.dad)
		{
			this.shapes.push(this.genarc(0,0,widthfactor*this.acumlen,this.angle,this.dad.angle));
		}
		var rang=this.radians(this.angle);
		this.shapes.push([[Math.cos(rang) * this.acumlen*widthfactor, Math.sin(rang) * this.acumlen*widthfactor],[Math.cos(rang) * (this.acumlen+this.len)*widthfactor, Math.sin(rang) * (this.acumlen+this.len)*widthfactor]]);
	}

	this.acumlength=function(start)
	{
		this.acumlen=start;
		for (var i=0;i<this.children.length;i++)
		{this.children[i].acumlength(start+this.len);}
	}

	this.radians=function(aAngle)
	{
		return (aAngle / 180) * Math.PI;
	}

	this.genarc=function (x,y,w,start,stop)
	{
		if (stop<start)
		{
			stop = [start, start = stop][0];
		}
		var steps=(stop-start);
		if (steps<2){steps=2;}

		var step=(stop-start)/steps;

		start=this.radians(start);
		stop=this.radians(stop);
		step=this.radians(step);
		var points=[];

		for (var i=start;i<stop;i+=step)
		{
			points.push([x + Math.cos(i) * w, y + Math.sin(i) * w]);
		}
		points.push([x + Math.cos(stop) * w, y + Math.sin(stop) * w]);
		return points;
	}

}

function NewickParser(nw)
{
	this.leafs={};
	this.nodes={};

	this.deleteNode=function(name)
	{
		if (!name in this.leafs){return;}
		var leaf=this.leafs[name];

		leaf.dad.children.splice(leaf.dad.children.indexOf(leaf),1);
		if (leaf.dad.children.length==1 && leaf.dad.dad)
		{
			leaf.dad.children[0].len+=leaf.dad.len;
			leaf.dad.dad.children.splice(leaf.dad.dad.children.indexOf(leaf.dad),1);
			leaf.dad.dad.children.push(leaf.dad.children[0]);
			leaf.dad.children[0].dad=leaf.dad.dad;
		}
		else if (leaf.dad.children.length==1)
		{
			leaf.dad.len+=leaf.dad.children[0].len;
			for (var i=0;i<leaf.dad.children[0].children.length;i++)
			{
				leaf.dad.children[0].children[i].dad=leaf.dad;
			}
			leaf.dad.children=leaf.dad.children[0].children;
		}
	}

	this.getSelected=function()
	{
		var res=[];
		for (var key in this.leafs)
		{
			if (this.leafs[key].selected){res.push(this.leafs[key].name)}

		}
		return res;
	}

	this.maxLeafName=function()
	{
		max=0;
		for (var name in this.leafs)
		{
			k=name.length;
			if (k>max){max=k;}
		}
		return max;
	}

	this.maxlabel=0;


	this._parseTree= function(nw,pos)
	{
		var n=new NewickNode();

		while (true)
		{
				if (nw[pos]==")")
				{
					if (pos==nw.length-1){break;}
					else if (nw[pos+1]==';') {break;}
					else if (nw[pos+1]!=')' && nw[pos+1]!=',' ){
						res=this._parseLeaf(nw,pos+1);
						n.name=res.name;
						//					if (!this.name){}
						n.len=res.len
						return {'node': n,'pos': res.pos}
					}
					else {break;}
				}
				else if (nw[pos]== ";"){ break;}

				if (nw[pos+1]!="(")
					{
						res=this._parseLeaf(nw,pos+1);
						nn=new NewickNode();
						pos=res.pos;
						nn.name=res.name;
						nn.len=res.len;
						this.leafs[res.name]=nn;
						this.nodes[res.name]=nn;
						n.children.push(nn);
						nn.dad=n;
					}
				else{
						res=this._parseTree(nw,pos+1)
						this.nodes[res.node.name]=res.node;
						n.children.push(res.node)
						res.node.dad=n;
						pos=res.pos;
				}

		}
		return {'node':n,'pos':pos+1};
	}

	this._parseLeaf= function(nw,pos)
	{
		var len=0;
		var i=pos;
		var name='';

		while (i<nw.length && nw[i]!=')' && nw[i]!=',' && nw[i]!=';' ) {i++;}
		items=RegExp.findAll("([^:]+)?(:[0-9.e-]+)?",nw.slice(pos,i));
		if (items[0][0]) {name=items[0][0];}
		if (items[0][1]) {len=parseFloat(items[0][1].substring(1));}
		return {'name':name,'len':len,'pos':i};
	}

	this.rt=this._parseTree(nw,0).node;
	this.rt.acumlength(0);
	this.maxDistance=this.rt.maxDistance();

	this.calcTreeCoordinates=function(sep,width)
	{
		var factor=width/this.maxDistance;
		this.rt.calcTreeCoordinates(sep,factor);
		this.maxlabel=this.maxLeafName();
		console.log(this.rt.height);
		this.rt.calculateAngles(360/this.rt.height,factor);
	}
}
