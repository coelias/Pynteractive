import sys
from pynteractive.webfiles import *
import random

VERSION=sys.version_info[0]*10+sys.version_info[1]
PORT=random.randint(12580,18580)
WEBSOCKETPORT=PORT+1
