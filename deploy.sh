#!/bin/sh

CLIENT_ROOT="/Users/jofr/Development/davidmiles/client/"
SRC_DIR=$CLIENT_ROOT"builds/web/development/"
DEST_DIR="davidmiles.se@ssh.davidmiles.se:/www/"

rsync --archive --delete $DEST_DIR"txt" $CLIENT_ROOT"web/"
rsync --archive --delete $DEST_DIR"json" $CLIENT_ROOT"web/"
rsync --archive --ignore-existing -- $DEST_DIR"img" $CLIENT_ROOT"web/"

echo "Ready to upload? Press enter to perform dry-run. Otherwise press ctrl+C."
read
rsync -n --verbose --archive --delete --chmod=Du=rwx,go=rx,Fu=rwx,og=rx  $SRC_DIR $DEST_DIR |grep -v "components/"
echo "Dry run looks ok? Otherwise press ctrl+c"
read
rsync --archive --delete --chmod=Du=rwx,go=rx,Fu=rwx,og=rx  $SRC_DIR $DEST_DIR
