.PHONY: install dev build start local clean

install:
	npm install

dev:
	npm run dev

build:
	npm run build

start:
	npm run start

# Production-like local run (build + start)
local: build
	npm run start

clean:
	rm -rf .next
