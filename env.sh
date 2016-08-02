#!/bin/bash

LANG=${LANGUAGE:-en} 
API=${API_URL:-https://devices.carre-project.eu/ws/} 
AUTH=${AUTH_URL:-https://devices.carre-project.eu/devices/accounts/} 
GRAPH=${GRAPH_URL:-carre.kmi.open.ac.uk} 
SUBGRAPH=${SUBGRAPH_URL:-public} 
TOKENNAME=${TOKEN_NAME:-CARRE_USER} 

REPLACE_OBJECT="{language:\"$LANG\",api_url:\"$API\",token_name:\"$TOKENNAME\",subgraph_url:\"$SUBGRAPH\",auth_url:\"$AUTH\",graph_url:\"$GRAPH\"}"
cd public
sed "s|'CARRE_EDU_CONFIGURATION_REPLACE_OBJECT'|$REPLACE_OBJECT|" index.html >new.html
echo "Loaded configuration: "$REPLACE_OBJECT
mv new.html index.html
cd ..