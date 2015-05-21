#!/bin/sh

checkprocess()
{
 if [ "$1" = "" ];
   then
      return 1
 fi
process_num=`ps -ef |grep "$1" |grep -v "grep" |wc -l`
if [ $process_num -eq 1 ];
   then
      return 0
   else
      return 1
fi

}

while [ 1 ] ; do
   checkprocess "ResourceAPIServer.js"
   check_result=$?
  if [ $check_result -eq 1 ];
     then 
       nohup node ./ResourceAPIServer.js >> ./ResourceAPIServer_Log 2>&1 &
	   echo `date` "start ResourceAPIServer"
  fi
  
  checkprocess "ResourceDownloadServer.js"
   check_result=$?
  if [ $check_result -eq 1 ];
     then 
       nohup node ./ResourceDownloadServer.js >> ./ResourceDownloadServer_Log 2>&1 &
	   echo `date` "start ResourceDownloadServer"
  fi
  sleep 3
done
