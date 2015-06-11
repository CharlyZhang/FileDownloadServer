@ECHO OFF   
 
:forever stop ResourceAPIServer.js && forever stop ResourceDownloadServer.js

taskkill /F /IM node.exe