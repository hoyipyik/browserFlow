# Browser Flow

![build](https://github.com/chibat/chrome-extension-typescript-starter/workflows/build/badge.svg)

Chrome Extension for recording and replaying operations on Chromium browsers, written in TypeScript and React

## Prerequisites

* [node + npm](https://nodejs.org/) (Current Version)

## Project Structure
* dist: Chrome Extension directory
* dist/js: Generated JavaScript files
* src/renderer: React Components
* src/util: Record and replay tool funtions
* src/options.tsx: Option page of the extension. (Useless for now)
* src/background.ts: background.js file of the extension. Handle the creation of the extension window.
* src/content_script.tsx: content_script of the extension. Handle script injection into webpages.

## Current Features

* click
* text input
* tab create
* tab switch
* tab visit

## Attention

Each step you make an operation, you have to wait for the page finishing loading.

## Setup
```
npm install
```

## Build

```
npm run build
```

## Build in watch mode

### terminal

```
npm run watch
```


## Load extension to chrome

1. Open the extension page of your Chrome browser and enable development mode.

2. Click load from unpacked and load `dist` directory

Attention: Each time you refresh the extension, you also need to refresh the opened webpage to see the lastest effects of the extension.