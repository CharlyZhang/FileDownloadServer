#!/bin/sh
kill -s 9 `ps -ef | grep checklive | grep -v grep | awk '{print $2}'`
kill -s 9 `ps -ef | grep Resource | grep -v grep | awk '{print $2}'`
