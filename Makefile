MOCHA_OPTS=
REPORTER?=dot
NODE=node

build:
	$(NODE) build/Makefile.js

test: test-lib test-compiler

test-lib: 
	@L20N_TEST=1 ./node_modules/.bin/mocha \
		--require should \
		--reporter $(REPORTER) \
		tests/lib/*.js

test-compiler:
	@./node_modules/.bin/mocha \
		--require should \
		--reporter $(REPORTER) \
		tests/compiler/*.js

watch-compiler:
	@./node_modules/.bin/mocha \
		--require should \
		--reporter min \
		--watch \
		--growl \
		tests/compiler/*.js

coverage: docs/coverage.html

docs/coverage.html: build/cov
	@L20N_COV=1 $(MAKE) test REPORTER=html-cov > docs/coverage.html

build/cov: lib
	@rm -rf build/cov
	@mkdir build/cov
	@jscoverage lib build/cov/lib

docs: lib html
	./node_modules/docco/bin/docco --output docs/lib lib/*.js
	./node_modules/docco/bin/docco --output docs/html html/*.js
	@touch docs

gh-pages: docs
	./build/gh-pages.sh

.PHONY: build test test-compiler watch-compiler coverage gh-pages
