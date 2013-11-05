#!/bin/sh

cd $(dirname $0)

uglifyjs src/main.js \
	src/mousemode.js \
	src/touchmode.js \
	src/mousewheel.js \
	src/scrollbar.js \
	src/utils.js \
	-o skinny-scroll.js -m -c

cp skinny-scroll.js /Users/wesleyluyten/Sites/distrify/Distrify-Widget/scripts/libraries/
