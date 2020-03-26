import inspect
import json
import mimetypes
import os
import sys
import tarfile
import threading
import urllib
import traceback
import base64
from pynteractive.SimpleWebSocketServer import WebSocket, SimpleWebSocketServer
import pynteractive.globals as pyn_globals
from pynteractive.datastruct import DataStruct
import re

import sys
VER = sys.version_info[0]
if VER >= 3:
      from io import BytesIO as StringIO
else:
      from StringIO import StringIO

Pynteractive_ws_MUTEX=threading.Lock()

if pyn_globals.VERSION<30:
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
        urllib.urlopen("http://localhost:{0}/".format(pyn_globals.PORT)).read()

class FileMgr:
    def __init__(self,path=None,tarString=None):
        assert (path and not tarString) or (tarString and not path)
        if tarString:
            self.contents=self.iniTar(StringIO(base64.b64decode(tarString)))
            self.METHOD="tar"
        else:
            self.iniPath('.')
            self.path='.'
            self.METHOD="path"
    
    def iniTar(self,tarStr):

        tar = tarfile.open(fileobj=tarStr,mode="r:gz")
        filelist=[]
            
        for tarinfo in tar:
            if tarinfo.isreg():
                filelist.append(tarinfo.name)
            elif tarinfo.isdir(): pass #print ("a directory.")
            else: pass #print ("something else.")
        return dict([(item,tar.extractfile(item).read()) for item in filelist])

    def iniPath(self,path):
        pass

    def __contains__ (self,item):
        if self.METHOD=='tar':
            return item in self.contents
        else:
            return os.path.isfile(os.path.join(self.path,item))
    
    def __getitem__(self,item):
        if self.METHOD=="tar":
            return self.contents[item]
        else:
            with open(os.path.join(self.path,item),"rb") as q:
                res=q.read()
            return res

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

        self.MESSAGES={}

    def sendAction(self,fname,*params):
        data=json.dumps([fname]+list(params))
        with Pynteractive_ws_MUTEX:
            self.sendMessage(data)

    def handleMessage(self):
        orig=self.data
        try:
            dat=json.loads(str(orig))
            funcname=dat[0]
            args=dat[1]
            self.dicFuncs[funcname](**args)
        except:
            traceback.print_exc()
            print ("Error processing","({0})".format(len(orig)),str(orig)[:30],"...",str(orig)[-30:])

    def handleConnected(self):
#        print (self.address, 'connected')
        pass

    def handleClose(self):
        pass

    def attach(self,name):
        self.dataId=name
        self.server.attachConnToDataId(self,name)

    def graphDblClick(self,nodes):
        if nodes:
            DataStruct._OBJECTS[self.dataId]._doubleClick(nodes[0].encode())

    def treeNodeClick(self,node):
        DataStruct._OBJECTS[self.dataId].nodeClick(node.encode())

    def performAction(self,n,selectedNodes):
        selectedNodes=[str(i).encode() for i in selectedNodes]
        DataStruct._OBJECTS[self.dataId]._performAction(n,selectedNodes)

    def refresh(self,name):
        DataStruct._refreshData(name)

    def selectionSet(self,nodes):
        DataStruct._OBJECTS[self.dataId]._selectionSet(nodes)

    def downloadSVG(self,svg):
        q=open("/tmp/a.svg","w")
        q.write(svg)
        q.close()


class SimpleWS(SimpleHTTPRequestHandler):
    FILE_MGR=FileMgr(path='webfiles/') if not pyn_globals.WEBFILES else FileMgr(tarString=pyn_globals.WEBFILES)

    def do_GET(self):
        if self.path.startswith("/?"): resource="webfiles/index.html"
        else: resource='/'.join(["webfiles"]+self.path.split("?")[0].split("/"))
        resource=re.sub("/+","/",resource)
        if resource in SimpleWS.FILE_MGR:
            self.send_response(200)
            ext=self.path.split(".")[-1].lower()
            if ext in mimetypes.types_map:
                mime=mimetypes.types_map[ext]
                self.send_header("Content-Type", mime)
            else:
                self.send_header("Content-Type","text/html")

            self.end_headers()
            self.wfile.write(SimpleWS.FILE_MGR[resource])
        else:
            self.send_response(404)
            self.send_header("Content-Type", mimetypes.types_map[".html"])
            self.end_headers()
            self.wfile.write("<h1>File not found (404)</h1><br>We are so sorry :(<br><br><br>That's no so bad, we will die someday anyway<br>Have a good day :D".encode())

    def log_message(self, format, *args):
        return

