#!/bin/sh

CLIENT_ROOT="client/"
SRC_DIR=$CLIENT_ROOT"builds/web/development/"
DEST_DIR="davidmiles.se@ssh.davidmiles.se:/www/"

rsync --archive --delete --chmod=Du=rwx,go=rx,Fu=rwx,og=rx  $SRC_DIR $DEST_DIR
