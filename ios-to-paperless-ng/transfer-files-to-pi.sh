#!/bin/zsh

scp $1 pi@10.0.1.5:/home/pi/Docker/paperless-ng/consume
rm $1
exit 0