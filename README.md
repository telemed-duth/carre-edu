[![Build Status](https://travis-ci.org/telemed-duth/carre-edu.svg?branch=master)](https://travis-ci.org/telemed-duth/carre-edu)


carre-edu
=========

Educational material for carre-project ontology

Development url : http://beta.carre-project.eu:8080

Code metrics url : http://beta.carre-project.eu:9999

Production url : http://edu.carre-project.eu



Technology stack
----------------
    Client : AngularJS , bootstrap css, HTML5
    
    Server : NodeJS, mongodb with mongoose, socket.io for sockets
    
    Deployment : 2-container(app+db) docker with dokku-alt
    
    Workflow : gruntjs,yeoman fullstack generator, plato
    



Try your self!
--------------
The deployment is supported only on a unix* like machine (linux , Mac) and requires the following libraries to installed on your computer : 

* NodeJS application sever
* MongoDB database server
* Git version control system

Next you should clone the repository at github, install all dependencies and run the build script.

    The commands for the above steps are self-explanatory :
            
    $ git clone https://github.com/telemed-duth/carre-edu.git
    $ npm install -g bower grunt-cli
    $ npm install && bower install
    $ grunt serve
            
	
Now the system is running on the default port 8080 and can be accessed at http://localhost:8080 through a supported web browser. 


    
[MIT License (MIT)](https://raw.githubusercontent.com/telemed-duth/carre-edu/master/LICENSE.txt)
------------
Copyright (c) 2014 Democritus University of Thrace (DUTH) , Greece
