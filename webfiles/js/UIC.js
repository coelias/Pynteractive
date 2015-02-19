loginWindow =function (user){ w=Ext.create('widget.window', { id: 'pwdLoginWin', height: 168, width: 401, resizable: false , modal:true, layout: { type: 'border' }, title: 'Authentication', items: [ { xtype: 'textfield', id: 'logPwdField', margin: '20 20 20 20', maxHeight: 22, fieldLabel: 'Enter Password', region: 'center', inputType: 'password', listeners: { specialkey: function(field, e){ if (e.getKey() == e.ENTER) { SC.send("login",{uname:user,pwd:Ext.getCmp('logPwdField').getValue()},USERS.returnLogin); } } } }, { xtype: 'container', height: 22, layout: { type: 'column' }, region: 'south', items: [ { xtype: 'container', height: 22, columnWidth: 0.5 }, { xtype: 'button', height: 150, maxHeight: 22, maxWidth: 100, text: 'Login', handler: function(){SC.send("login",{uname:user,pwd:Ext.getCmp('logPwdField').getValue()},USERS.returnLogin);} }, { xtype: 'container', height: 22, columnWidth: 0.5 } ] } ] }); w.show(); Ext.getCmp('logPwdField').focus(true, 200); };



UIC=new function UserInterfaceEventController()
{
		this.log=function(obj)
		{
			alert(obj)
		}

		this.logged=function(obj)
		{
			if (!obj)
			{
				Ext.getCmp("winUserManager").show();
			}
		}

		this.getUsers=function(obj)
		{
			a=Ext.getCmp('usersList');
			a=a.getStore();
			a.removeAll();
			a.add(obj);
		}
		this.changeBody=function(obj)
		{
			if (obj.ok)
			{
				a=Ext.get('bodContainer'); 
				a.dom.innerHTML=obj.html;
			}
		}

		this.hideVideo=function(obj)
		{
			if (obj.ok)
			{
				a=Ext.get(obj.vid); 
				a.dom.innerHTML="<br><hr>VIDEO MOVED/DELETED<hr><br>";
			}
		}

		this.changeCatVideo=function(nvideo)
		{
			a=Ext.getCmp('CategTree'); 
			b=a.getSelectionModel().getSelectedNode(); 
			if (!b) 
					return; 
			SC.send("moveVideo",{nvid:nvideo,category:b.id},UIC.hideVideo);	
		}
}

USERS=new function UserManager()
{
	this.checkUserSelection=function()
	{
		a=Ext.getCmp("usersList");
		a=a.getSelectionModel();
		b=a.hasSelection();
		if (b)
		{
			a=a.getSelection();
			return a[0].data.uname;
		}
		Ext.example.msg("Warning","Select a user please!");
		return b;
	}

	this.loginUser=function(user)
	{
		loginWindow(user);
	}

	this.deleteUser=function(user)
	{
		Ext.MessageBox.confirm('Confirm', 'Are you sure you want to delete user "<b>'+user+'</b>"?', function(btn){if (btn=='yes'){SC.send("deleteUser",{uname:user},UIC.getUsers)}});
	}

	this.clearFields=function()
	{
		Ext.getCmp("createUname").setValue("");
		Ext.getCmp("createPwd1").setValue("");
		Ext.getCmp("createPwd2").setValue("");
	}

	this.createUser=function()
	{
		this.clearFields();
		a=Ext.getCmp("winCreateUser");
		a.show();
		
	}

	this.okCreate=function()
	{
		u=Ext.getCmp("createUname").getValue();
		p1=Ext.getCmp("createPwd1").getValue();
		p2=Ext.getCmp("createPwd2").getValue();
		if (u.length<1)
		{
			Ext.MessageBox.show({ title: 'Username error', msg: "please insert a username", buttons: Ext.MessageBox.OK, icon: Ext.MessageBox.ERROR });
			return;
		}
		else if (p1!=p2)
		{
			Ext.MessageBox.show({ title: 'Password mismatch', msg: "The passwords don't match", buttons: Ext.MessageBox.OK, icon: Ext.MessageBox.ERROR });
			return;
		}
	
		SC.send("createUser",{uname:u,pwd:p1},function(obj){UIC.getUsers(obj); Ext.getCmp("winCreateUser").hide(); USERS.clearFields();});
		
	}

	this.returnLogin=function(obj)
	{
		if (obj)
		{
			Ext.getCmp("pwdLoginWin").hide();
			Ext.getCmp("winUserManager").hide();
		}
		else
		{
			Ext.MessageBox.show({ title: 'Authentication failed', msg: "Incorrect password", buttons: Ext.MessageBox.OK, icon: Ext.MessageBox.ERROR });
		}
	}
}
