#!/bin/sh
./clean.sh
nohup ./checklive.sh >>checklive_Log 2>&1 &
