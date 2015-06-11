@ECHO OFF   
 
:forever start ResourceAPIServer.js && forever start ResourceDownloadServer.js

start /b node ResourceAPIServer.js && start /b node ResourceDownloadServer.js