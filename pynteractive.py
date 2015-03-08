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
from lib.datastruct import *
from lib.graph import *
from lib.tree import *
from lib.map import *
import traceback

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
		self.dataId=None
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
			traceback.print_exc()
			print "Error processing",str(self.data)

	def handleConnected(self):
#		print self.address, 'connected'
		pass

	def handleClose(self):
		pass

	def attach(self,name):
		self.dataId=name
		self.server.attachConnToDataId(self,name)

	def graphDblClick(self,nodes):
		if nodes:
			DataStruct.OBJECTS[self.dataId].doubleClick(nodes[0].encode())

	def graphAction(self,n,selectedNodes):
		selectedNodes=[i.encode() for i in selectedNodes]
		if n==1:
			DataStruct.OBJECTS[self.dataId].action1(selectedNodes)
		elif n==2:
			DataStruct.OBJECTS[self.dataId].action2(selectedNodes)
		elif n==3:
			DataStruct.OBJECTS[self.dataId].action3(selectedNodes)

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
			else:
				self.send_header("Content-Type","text/html")

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
