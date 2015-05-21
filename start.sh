#!/bin/sh
./clean
nohup ./checklive.sh >>checklive_Log 2>&1 &
