#!/bin/sh
kill -s 9 `ps -ef | grep checklive.sh | grep -v grep | awk '{print $2}'`
kill -s 9 `ps -ef | grep 'node ./Resource' | grep -v grep | awk '{print $2}'`
