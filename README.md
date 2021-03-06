# Garbage Collector

> Saving all your screenshot trash for future use

## Overview

This project is inspired by the description of [Trash Exchange](https://lil.law.harvard.edu/sketches/trash-exchange/), a Sketch by the [Library Innovation Lab](https://lil.law.harvard.edu/).

It's an attempt to create an application that monitors the trashcan on your computer, and every time you throw an image away it actually saves it in a hidden folder on your computer for future use.

## Instructions

To run this project yourself, first clone this repo and install all the dependencies with

```
npm install
```

After that, you'll need to install [pm2](http://pm2.keymetrics.io/), which will allow you to run this process in the background of your computer at all times. Once `pm2` is installed, run

```
pm2 startup
```

and copy the code that's shown in the terminal in order to tell it to always run when your computer starts up. Then:

```
pm2 start garbage-collector.js
```

to run the actual program in the background of your computer.

## TODOS

* Look into Dithering images to save space
* Publish images online
* Properly slugify file names
* ~~Make all images JPEGs~~
* Make compatible with ~~linux~~ and windows machines.
