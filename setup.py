from setuptools import setup, find_packages  # Always prefer setuptools over distutils
from codecs import open  # To use a consistent encoding
import os
import tarfile
import StringIO
import sys
import base64

def recurdir(d):
	e=[os.path.join(d,i)  for i in os.listdir(d)]
	ds=[i for i in e if os.path.isdir(i)]
	fs=[i for i in e if os.path.isfile(i)]

	for i in ds:
		fs+=recurdir(i)
	
	return fs


if "build" in sys.argv or "install" in sys.argv:
	webtarbuff=StringIO.StringIO()
	webtar=tarfile.open(fileobj=webtarbuff,mode="w:gz")
	for i in recurdir('webfiles'):
		webtar.add(i)
	
	webtar.close()
	webtarbuff.seek(0)
	webtarbuff=base64.b64encode(str(webtarbuff.read()))
	q=open("pynteractive/webfiles.py",'w')
	q.write("WEBFILES='''{0}'''".format(webtarbuff))
	q.close()


long_description='''Pynteractive is a library that uses different JS graphic suites (html)
in order to generate interactive graphics (Networks, trees, charts, maps...'''

setup(
	name='pynteractive',

	# Versions should comply with PEP440.  For a discussion on single-sourcing
	# the version across setup.py and the project code, see
	# https://packaging.python.org/en/latest/single_source_version.html
	version='1.3.0',

	description='Pynteractive, a suite to generate interactive Javascript graphics',
	long_description=long_description,

	# The project's main homepage.
	url='http://github.com/coelias/Pynteractive',

	# Author details
	author='Carlos del Ojo Elias, Oriol Mazariegos Canellas',
	author_email='deepbit@gmail.com, mazeitor@gmail.com',

	# Choose your license
	license='GPLv3',

	# See https://pypi.python.org/pypi?%3Aaction=list_classifiers
	classifiers=[
		# How mature is this project? Common values are
		#   3 - Alpha
		#   4 - Beta
		#   5 - Production/Stable
		'Development Status :: 3 - Alpha',

		# Indicate who your project is intended for
		'Intended Audience :: Science/Research',
		'Topic :: Scientific/Engineering :: Visualization',

		# Pick your license as you wish (should match "license" above)
		'License :: OSI Approved :: GNU General Public License v3 or later (GPLv3+)',

		# Specify the Python versions you support here. In particular, ensure
		# that you indicate whether you support Python 2, Python 3 or both.
		'Programming Language :: Python :: 2',
		'Programming Language :: Python :: 2.6',
		'Programming Language :: Python :: 2.7',
	],

	# What does your project relate to?
	keywords='plotting interactive graphics JS',

	# You can just specify the packages manually here if your project is
	# simple. Or you can use find_packages().
	packages=find_packages(),

	# List run-time dependencies here.  These will be installed by pip when your
	# project is installed. For an analysis of "install_requires" vs pip's
	# requirements files see:
	# https://packaging.python.org/en/latest/requirements.html
	install_requires=[],

	# List additional groups of dependencies here (e.g. development dependencies).
	# You can install these using the following syntax, for example:
	# $ pip install -e .[dev,test]
	extras_require = {
	},

	# If there are data files included in your packages that need to be
	# installed, specify them here.  If using Python 2.6 or less, then these
	# have to be included in MANIFEST.in as well.
	package_data={'pynteractive':["../"+i for i in recurdir("webfiles")] },

	# Although 'package_data' is the preferred approach, in some case you may
	# need to place data files outside of your packages.
	# see http://docs.python.org/3.4/distutils/setupscript.html#installing-additional-files
	# In this case, 'data_file' will be installed into '<sys.prefix>/my_data'
	data_files=[],

	# To provide executable scripts, use entry points in preference to the
	# "scripts" keyword. Entry points provide cross-platform support and allow
	# pip to create the appropriate form of executable for the target platform.
	entry_points={ }
)

if "build" in sys.argv or "install" in sys.argv:
	q=open("pynteractive/webfiles.py",'w')
	q.write("WEBFILES=None".format(webtarbuff))
	q.close()
