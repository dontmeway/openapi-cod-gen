#!/usr/bin/env node

"use strict";

const { program } = require("commander");
const path = require("path");

const params = program
  .requiredOption("-i, --input <value>", "--input must be path")
  .requiredOption("-o, --output <value>", "--output must be path")
  .parse(process.argv)
  .opts();

const { generate } = require(path.resolve(__dirname, "../dist/main.js"));

console.log("hello");
