import globals
import inspect
import json
import mimetypes
import os
import random
import sys
import tarfile
import threading
import urllib
import webbrowser
import time
from SimpleWebSocketServer import WebSocket, SimpleWebSocketServer
from collections import Counter

MUTEX=threading.Lock()

if globals.VERSION<30:
	from BaseHTTPServer import HTTPServer
	from SimpleHTTPServer import SimpleHTTPRequestHandler
	from SocketServer import ThreadingMixIn
	from urlparse import urlparse,urlunparse 
	from urllib import unquote
else:
	from http.server import HTTPServer,SimpleHTTPRequestHandler
	from socketserver import ThreadingMixIn
	from urllib.parse import urlparse,urlunparse,unquote

class ThreadingServer(ThreadingMixIn, HTTPServer):
	stopped = False
	server=None

	def serve_forever(self):
		ThreadingServer.server=self
		while not self.stopped:
			self.handle_request()

	@staticmethod
	def force_stop():
		ThreadingServer.stopped = True
		urllib.urlopen("http://localhost:{0}/".format(globals.PORT)).read()

class FileMgr:
	def __init__(self,path=None,tar=None):
		self.available=set()
		if tar and not path:
			self.tar=self.iniTar(tar)
			self.METHOD="tar"
		elif path and not tar:
			self.iniPath(path)
			self.path=path
			self.METHOD="path"
		else:
			raise Exception("Bad initialization")

	
	def iniTar(self,tar):
		assert tarfile.is_tarfile(tar)
		if tar.split(".")[-1].lower() in ["tgz","gz"]:
			tar = tarfile.open("sample.tar.gz", "r:gz")
		else:
			tar = tarfile.open("sample.tar.gz", "r")
			
		for tarinfo in tar:
			if tarinfo.isreg():
				self.available.add(tarinfo.name[1:])
			elif tarinfo.isdir(): pass #print ("a directory.")
			else: pass #print ("something else.")
		return tar

	def iniPath(self,path):
		pass

	def __contains__ (self,item):
		return item in self.available
	
	def __getitem__(self,item):
		if self.METHOD=="tar":
			return self.tar.extractfile("."+item).read()
		
#class simpleRH(SimpleHTTPRequestHandler):
#	def do_GET(self):
#		global FM
#		# self.path
#
#		if self.path in FM:
#			self.send_response(200)
#			ext=self.path.split(".")[-1].lower()
#			if ext in mimetypes.types_map:
#				mime=mimetypes.types_map[ext]
#				self.send_header("Content-Type", mime)
#			self.end_headers()
#			self.wfile.write(FM[self.path])
#		else:
#			self.send_response(404)
#			self.send_header("Content-Type", mimetypes.types_map[".html"])
#			self.end_headers()
#			self.wfile.write("<h1>File not found (404)</h1><br>We are so sorry :(<br><br><br>That's no so bad, we will die someday anyway<br>Have a good day :D".encode())
#
#
#	do_POST=do_GET

#FM=FileMgr(tar="sample.tar.gz")	


class JSCom(WebSocket):
	def __init__(self,*args,**kwargs):
		WebSocket.__init__(self,*args,**kwargs)
		funcs=[i for i in dir(self) if inspect.ismethod(getattr(self,i)) and getattr(self,i).__doc__!="FWCLASS"]
		self.dicFuncs={}
		self.dicArgs={}
		for i in funcs:
			self.dicFuncs[i]=getattr(self,i)
			self.dicArgs[i]=inspect.getargspec(self.dicFuncs[i])

	def sendAction(self,fname,*params):
		data=json.dumps([fname]+list(params))
		with MUTEX:
			self.sendMessage(data)

	def handleMessage(self):
		try:
			dat=json.loads(str(self.data))
			funcname=dat[0]
			args=dat[1]
			self.dicFuncs[funcname](**args)
		except:
			print "Error processing",str(self.data)

	def handleConnected(self):
#		print self.address, 'connected'
		pass

	def handleClose(self):
		pass

	def attach(self,name):
		self.server.attachConnToDataId(self,name)

	def refresh(self,name):
		DataStruct.refreshData(name)

class SimpleWS(SimpleHTTPRequestHandler):
	def do_GET(self):
		if self.path.startswith("/?"): resource="webfiles/index.html"
		else: resource=os.path.join(*(["webfiles"]+self.path.split("?")[0].split("/")))
		if os.path.isfile(resource):
			self.send_response(200)
			ext=self.path.split(".")[-1].lower()
			if ext in mimetypes.types_map:
				mime=mimetypes.types_map[ext]
				self.send_header("Content-Type", mime)
			self.end_headers()
			f=open(resource,"rb")
			self.wfile.write(f.read())
			f.close()
		else:
			self.send_response(404)
			self.send_header("Content-Type", mimetypes.types_map[".html"])
			self.end_headers()
			self.wfile.write("<h1>File not found (404)</h1><br>We are so sorry :(<br><br><br>That's no so bad, we will die someday anyway<br>Have a good day :D".encode())

	def log_message(self, format, *args):
		return

class DataStruct:
	JSConnector=None
	OBJECTS={}

	def __init__(self,name=None):
		if not name:
			name=self.__class__.__name__+"-"+"".join([random.choice("ABCDEF0123456789") for i in range(4)])
		ID=name
		if ID in DataStruct.OBJECTS:
			raise ("Object {0} already exists!".format(ID))
		DataStruct.OBJECTS[ID]=self
		self._ID=name
	
	def view(self):
		webbrowser.open_new_tab("http://localhost:{0}/?dataid={1}&vtype={2}".format(globals.PORT,self._ID,self.__class__.__name__))

	def closeView(self):
		self.update("close")

	def update(self,func,*pars):
		DataStruct.JSConnector(self._ID,func,*pars)

	@staticmethod
	def refreshData(name):
		if name in DataStruct.OBJECTS:
			DataStruct.OBJECTS[name].refresh()

	@staticmethod
	def connect(updateFunc):
		DataStruct.JSConnector=updateFunc

	@staticmethod
	def readCsv(csvfile):
		with open(csvfile) as f:
			csv=[i.strip() for i in f]
		if csv:
			delimiter=Counter([i for i in csv[0] if i in "\t ;,|"]).most_common(1)
			if delimiter:
				csv=[i.split(delimiter[0][0]) for i in csv]
		return csv
	

class Tree(DataStruct):
	def __init__(self,name=None,directed=False):
		DataStruct.__init__(self,name)
	

class Graph(DataStruct):
	def __init__(self,name=None,directed=False):
		DataStruct.__init__(self,name)

		self.vertices={}
		self.edges={}
		self.directed=directed

	def refresh(self):
		for i in self.vertices.values():
			self.update("addNode",i["_id"],i["_label"],i["_title"],i["_group"],i["_color"],i["_radius"],i["_image"])
		for i,j in self.edges.items():
			self.update("addEdge",i,j["_n1"],j["_n2"],j["_label"],j["_title"],j["_threshold"],j["_style"])

	def addNode(self,node_id=None,label=None,title=None,group=None,shape=None,color=None,radius=None,image=None):
		# ellipse, circle, box, database, image, circularImage, label, dot, star, triangle, triangleDown, square
		assert not shape or shape in ['ellipse','circle','box','database','image','circularImage','label','dot','star','triangle','triangleDown','square']
		if shape in ['image','circularImage']: assert image!=None

		if node_id==None:
			i=1
			while True:
				if str(i) not in self.vertices:
					node_id=i
					break
				i+=1
		node_id=str(node_id)
		if not label: label=node_id
		else: label=str(label)
		self.vertices[node_id]={"_id":node_id,"_label":label,"_title":title,"_group":group,"_color":color,"_radius":radius,"_image":image}

		self.update("addNode",node_id,label,title,group,shape,color,radius,image)

	def addEdge(self,n1,n2,label=None,title=None,width=None,style=None):
		assert not style or style in ['line','arrow','arrow-center','dash-line']
		n1,n2=str(n1),str(n2)
		assert n1 in self.vertices and n2 in self.vertices

		if not label: label=''

		if self.directed:
			style='arrow'
		else:
			style='line'
			if n1>n2:n1,n2=n2,n1

		_id="~".join([n1,n2,label])
		self.edges[_id]={"_n1":n1,"_n2":n2,"_label":label,"_title":title,"_threshold":width,"_style":style}
		self.update("addEdge",_id,n1,n2,label,title,width,style)

	def random(self,nn,ne):
		map(self.addNode,xrange(nn))
		for i in xrange(ne):
			self.addEdge(random.choice(xrange(nn)),random.choice(xrange(nn)))

	def fromCsv(self,fil,matrix=False,distances=False):
		csv=self.readCsv(fil)
		if not matrix:
			for i in csv:
				for j in i:
					if j not in self.vertices: self.addNode(j)
				for j in i[1:]:
					if not (i[0],j) in self.edges:
						self.addEdge(i[0],j)
		else:
			cols=csv[0][1:]
			rows=[i[0] for i in csv[1:]]
			if cols!=rows: raise Exception("Rows andColumns do not match")
			for i in rows:
				if i not in self.vertices: self.addNode(i)
			csv=[i[1:] for i in csv][1:]
			for i in range(len(rows)):
				for j in range(len(rows)):
					if csv[i][j]!='0':
						self.addEdge(rows[i],rows[j])



######## Webserver
def startServer():
	serveraddr = ('', globals.PORT)
	srvr = ThreadingServer(serveraddr, SimpleWS)
	srvr.serve_forever()
threading.Thread(target=startServer).start()

########## Websocket server
WSOCKserver = SimpleWebSocketServer("localhost", 8000, JSCom)
DataStruct.connect(WSOCKserver.sendAction)

def startWebSocket():
	WSOCKserver.serveforever()
threading.Thread(target=startWebSocket).start()

print ">>> n=Graph()"
n=Graph()

import code
code.interact(banner="",local=locals())

ThreadingServer.force_stop()
WSOCKserver.close()
sys.exit()
