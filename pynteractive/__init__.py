import threading
import pynteractive.globals as pyn_globals
from pynteractive.datastruct import *
from pynteractive.graph import *
from pynteractive.tree import *
from pynteractive.map import *
from pynteractive.chart import *
from pynteractive.phylotree import *
import atexit
from webserver import *


class WebServices:
	SERVERS_ON=False
	@staticmethod
	def webServerWorker():
		serveraddr = ('', pyn_globals.PORT)
		srvr = ThreadingServer(serveraddr, SimpleWS)
		srvr.serve_forever()

	@staticmethod
	def webSocketServerWorker():
		WSOCKserver = SimpleWebSocketServer("localhost", 8000, JSCom)
		DataStruct._connect(WSOCKserver.sendAction)
		WSOCKserver.serveforever()

	@staticmethod
	def stopServers():
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

