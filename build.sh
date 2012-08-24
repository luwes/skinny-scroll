#!/bin/sh

cd $(dirname $0)

java -jar /usr/local/bin/compiler/compiler.jar \
	--js=src/main.js \
	--js=src/mousemode.js \
	--js=src/touchmode.js \
	--js=src/mousewheel.js \
	--js=src/scrollbar.js \
	--js=src/utils.js \
	--js_output_file=skinny-scroll.js \
	--output_wrapper "" \
	#--compilation_level ADVANCED_OPTIMIZATIONS \
