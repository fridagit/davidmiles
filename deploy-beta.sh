#!/bin/sh
rsync --archive --delete  --chmod=Du=rwx,go=rx,Fu=rwx,og=rx  /Users/jofr/Development/davidmiles/client/builds/web/development/ davidmiles.se@ssh.davidmiles.se:/www/beta/