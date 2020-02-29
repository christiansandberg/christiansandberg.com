#!/bin/bash

afconvert $1 -d aac -f m4af --soundcheck-generate -b 160000 -q 127 -s 2 $2/christiansandberg.m4a
ffmpeg -i $1 -c:a libmp3lame -q:a 4 $2/christiansandberg.mp3
ffmpeg -i $1 -c:a libvorbis -q:a 5 $2/christiansandberg.ogg
