#!/bin/sh

SRC_DIR="/Users/jofr/Development/davidmiles/client/builds/web/development/"
DEST_DIR="davidmiles.se@ssh.davidmiles.se:/www/"

EXCLUDE="--exclude beta"
EXCLUDE="$EXCLUDE --exclude json"
EXCLUDE="$EXCLUDE --exclude texter"
EXCLUDE="$EXCLUDE --exclude img"

echo "Have you run: 'git diff HEAD^ --stat' to see what needs to be copied for img/json/texter? Otherwise press ctrl+C."
read
rsync -n --verbose --archive --delete $EXCLUDE --chmod=Du=rwx,go=rx,Fu=rwx,og=rx  $SRC_DIR $DEST_DIR |grep -v "components/"
echo "Dry run looks ok? Otherwise press ctrl+c"
read
rsync --archive --delete $EXCLUDE --chmod=Du=rwx,go=rx,Fu=rwx,og=rx  $SRC_DIR $DEST_DIR
