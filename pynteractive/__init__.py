import threading
import pynteractive.globals as pyn_globals
from pynteractive.datastruct import *
from pynteractive.graph import *
from pynteractive.tree import *
from pynteractive.map import *
from pynteractive.chart import *
from pynteractive.phylotree import *
from pynteractive.graphd3 import *
import atexit
import os
import pickle
from .webserver import *


class WebServices:
	SERVERS_ON=False
	@staticmethod
	def webServerWorker():
		serveraddr = ('', pyn_globals.PORT)
		srvr = ThreadingServer(serveraddr, SimpleWS)
		srvr.serve_forever()

	@staticmethod
	def webSocketServerWorker():
		WSOCKserver = SimpleWebSocketServer("localhost", pyn_globals.WEBSOCKETPORT, JSCom)
		DataStruct._connect(WSOCKserver.sendAction)
		WSOCKserver.serveforever()

	@staticmethod
	def stopServers():
		a=open(os.path.join(os.path.expanduser("~"),".pynteractive"),'w')
		pickle.dump(Map.CACHE,a)
		a.close()

		if WebServices.SERVERS_ON:
			ThreadingServer.force_stop()
			WSOCKserver.close()

	@staticmethod
	def startServers():
		a=threading.Thread(target=WebServices.webServerWorker)
		b=threading.Thread(target=WebServices.webSocketServerWorker)
		a.setDaemon(True)
		b.setDaemon(True)
		a.start()
		b.start()

WebServices.startServers()
atexit.register(WebServices.stopServers)

