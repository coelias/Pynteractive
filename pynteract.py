import globals
import base64
import tarfile
import mimetypes
import threading
import sys
import urllib
mimetypes.init()
mimetypes.types_map['.dwg']='image/x-dwg'
mimetypes.types_map['.ico']='image/x-icon'
mimetypes.types_map['.bz2']='application/x-bzip2'
mimetypes.types_map['.gz']='application/x-gzip'

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
#		ThreadingServer.server.server_close()
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

import os
import inspect
import json
import traceback
import hashlib
#from lib.ConfigManager import ConfigManager
import imp


class Wfcom:
	'''FWCLASS'''
	def __init__(self,dataFramework):
		funcs=[i for i in dir(self) if inspect.ismethod(getattr(self,i)) and getattr(self,i).__doc__!="FWCLASS"]
		self.dicFuncs={}
		self.dicArgs={}
		for i in funcs:
			self.dicFuncs[i]=getattr(self,i)
			self.dicArgs[i]=inspect.getargspec(self.dicFuncs[i])
		self.dataFramework=dataFramework

	def POST(self,fname,data):

		if fname not in self.dicFuncs:
			return self.encode({"success": False,"error":'Function [ %s ] not found!' % (fname)})
	
		variables=self.decode(str(data))
		realargs=self.dicArgs[fname]


		for i in variables.keys():
			if not i in realargs[0]:
				return self.encode({"success": False,"error":'Parameter [ %s ] does not exist in function [ %s ]!' % (i,fname)})

		temp=0
		if realargs[3]:
			temp=len(realargs[3])
			requiredargs=realargs[0][1:-temp]
		else:
			requiredargs=realargs[0][1:]

		for i in requiredargs:
			if not i in variables:
				return self.decode({"success": False,"error":'Parameter [ %s ] REQUIRED by function [ %s ]!' % (i,fname)})

		try:
			info=self.dicFuncs[fname](**variables)
		except Exception as a:
				formatted_lines = traceback.format_exc().splitlines()
				exc="\r\n".join(formatted_lines)+"\r\n"
				return self.encode({"success": False,"error":'%s: Exception in function execution: %s' % (fname,exc)})

		return self.encode({"success": True, "result":info})

	############################ JSON MANAGEMENT #####################
	def encode(self,obj):
		return json.dumps(obj)

	def decode(self,cad):
		return self.safe_dict(json.loads(cad))
		
	def safe_dict(self,d):
		"""Recursively clone json structure with UTF-8 dictionary keys"""
		if isinstance(d, dict):
			if "__b64" in d:
				return  base64.b64decode(d["__b64"])
			return dict([(k.encode('utf-8'), self.safe_dict(v)) for k,v in d.iteritems()])
		elif isinstance(d, list):
			return [self.safe_dict(x) for x in d]
		else:
			return d

	def encodeString(self,obj):
		return "{ __b64: '%s' }" % (base64.b64encode(obj))

	def encodelist(self,l):
		cad=[]
		for i in l:
			cad.append(self.encode(i))
		return "[ "+", ".join(cad)+" ]"

	def encodedict(self,d):
		cad=[]
		for i,j in d.items():
			if i=="__proto__":
				continue
			cad.append(str(i)+": "+self.encode(j))
		return "{ "+", ".join(cad)+" }"

	############## METHODS ####################

	def getGraphUpdates(self):
		return self.dataFramework.getUpdates()

	# EMPTY
	# EMPTY
	# EMPTY

class SimpleWS(SimpleHTTPRequestHandler):
	def do_GET(self):
		if self.path=="/": self.path="/index.html"
		path=os.path.join(*(["webfiles"]+self.path.split("/")))
		if os.path.isfile(path):
			self.send_response(200)
			ext=self.path.split(".")[-1].lower()
			if ext in mimetypes.types_map:
				mime=mimetypes.types_map[ext]
				self.send_header("Content-Type", mime)
			self.end_headers()
			f=open(path,"rb")
			self.wfile.write(f.read())
			f.close()
		else:
			self.send_response(404)
			self.send_header("Content-Type", mimetypes.types_map[".html"])
			self.end_headers()
			self.wfile.write("<h1>File not found (404)</h1><br>We are so sorry :(<br><br><br>That's no so bad, we will die someday anyway<br>Have a good day :D".encode())

	def do_POST(self):
		global wfcomO

		content=self.rfile.read(int(self.headers['Content-length'])).decode().split("&")
		query=[i.split("=") for i in content]
		query=dict([(i[0],unquote(i[1])) for i in query])
		if "fname" not in query or "data" not in query:
			self.send_response(500)
			self.end_headers()
			self.wfile.write("Incorrect call to Wfcon".encode())
			return

		self.send_response(200)
		self.send_header("Content-Type", "application/json")
		self.end_headers()
		res=wfcomO.POST(query["fname"],query["data"]).encode()
		self.wfile.write(res)
		self.wfile.close()

	def log_message(self, format, *args):
		return

class Network:
	def __init__(self,directed=False):
		self.vertices={}
		self.edges=set()
		self.directed=directed

		self.updates=[]

	def getUpdates(self):
		with MUTEX:
			res=self.updates[:]
			self.updates=[]
		return res

	def addNode(self,name=None,**kwargs):
		if not name:
			i=1
			while True:
				if str(i) not in self.vertices:
					name=str(i)
					break
				i+=1
		self.vertices[name]=kwargs

		with MUTEX:
			self.updates.append(["addNode",name])

		return ["addNode",name]

	def addEdge(self,n1,n2):
		assert n1 in self.vertices and n2 in self.vertices
		self.edges.add((n1,n2))

		with MUTEX:
			self.updates.append(["addEdge",n1,n2])

		return ["addEdge",n1,n2]




class DataFrameWork:
	def __init__(self):
		self.dataObjects=[]

	def createNetwork(self):
		nw=Network()
		self.dataObjects.append(nw)
		return nw

	def getUpdates(self):
		res=[]
		for i in self.dataObjects:
			res+=i.getUpdates()

		return res

		
dfw=DataFrameWork()
nw=dfw.createNetwork()

wfcomO=Wfcom(dfw)

def startServer():
	serveraddr = ('', globals.PORT)
	srvr = ThreadingServer(serveraddr, SimpleWS)
	srvr.serve_forever()

threading.Thread(target=startServer).start()

print ">>>dfw=DataFrameWork()"
print ">>>nw=dfw.createNetwork()"

import code
code.interact(local=locals())

ThreadingServer.force_stop()
sys.exit(0)
