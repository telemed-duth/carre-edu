
Educational Aggregator for CARRE project
=========
The aim of the educational resource aggregator is to harvest educational resources from 3rd party repositories, present these to the medical expert for annotation and rating, and output the results of the annotation (together with resource metadata) to the CARRE public RDF repository.

The main parts of this aggregator are: the Resource Retriever, the Resource Rating, the Resource Metadata Processing, and the User Application.

The Resource Retriever accepts CARRE concept terms from the CARRE public RDF repository and uses them to formulate queries to external 3rd party educational resource repositories. The results of this search are parsed to extract metadata. Then the retrieved results and metadata are displayed to the expert user for rating and annotation (via the aggregator front end). The module consists of 2 services that make use of SPARQL protocol in the case of query term extraction from the CARRE server and API requests to each educational repository.
The Resource Rating module allows the input of expert user opinion and annotation, and also calculates subjective scores that measure the quality of the resource. Expert rating involves assessment of content-keyword relevance, content accuracy and depth of coverage, while the automatic systems rating is based on the Readability Test of the Flesch-Kincaid algorithm, and rating based on the latest modified version of the article and number of revisions. The module is an optional process that requires special user privileges. Each user role is assigned to different rating criteria according to user authorization. As of version 0.2, only 2 user roles have been taken into implementation: (a) the expert, and (b) the general public.
The Resource Metadata Processing module involves metadata enrichment via semantic web sources (such as NCBO BioPortal medical ontologies and DBpedia). The module is a combination of 3 services that collect data per article, making multiple SPARQL requests to enrich the data and finally store it as a unique identified resource into the local MongoDB datastore. Then data is transformed into RDF triples in order to be inserted to CARRE educational repository.
The User Application is a web application accessible at http://edu.carre-project.eu/. The visible components of the web application are built upon html5 and CSS3 using modern frameworks for consistency and responsiveness like Twitter Bootstrap CSS Framework have been extensively used. Bootstrap is also responsible for mobile/tablet view of the web application.




Public URL's
-------

Production url : http://edu.carre-project.eu

Testing and Deployment services
---------
[![Build Status](https://travis-ci.org/telemed-duth/carre-edu.svg?branch=master)](https://travis-ci.org/telemed-duth/carre-edu)
[![Code Climate](https://codeclimate.com/github/telemed-duth/carre-edu/badges/gpa.svg)](https://codeclimate.com/github/telemed-duth/carre-edu)

Technology stack
----------------
    Client : AngularJS , bootstrap css, HTML5
    
    Server : NodeJS, mongodb with mongoose, socket.io for sockets
    
    Deployment : 2-container(app+db) docker with dokku-alt
    
    Workflow : gruntjs,yeoman fullstack generator, plato
    



Host on your own server!
--------------
Minimum Requirements: 1GB RAM + 3GB HDD
The deployment is supported only on a unix* like machine (linux , Mac) and requires the following libraries to installed on your computer : 

* NodeJS application sever
* Git version control system

Next you should clone the repository at github, install all dependencies and run the build script.

You should take into considaration that the dependencies require ~3gb of space.

    The commands for the above steps are self-explanatory :
            
    $ git clone https://github.com/telemed-duth/carre-edu.git
    $ npm install -g bower grunt-cli
    $ npm install && bower install
    $ grunt serve
            

Now the system is running on the default port 8080 and can be accessed at http://localhost:8080 through a supported web browser. 


    
[MIT License (MIT)](https://raw.githubusercontent.com/telemed-duth/carre-edu/master/LICENSE.txt)
------------
Copyright (c) 2014 Democritus University of Thrace (DUTH) , Greece
