build:
	mkdir -p build
	pnpm exec browserify -t brfs src/app.js > build/main.js


.PHONY: build
