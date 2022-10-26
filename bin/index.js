#!/usr/bin/env node

"use strict";

const { program } = require("commander");
const path = require("path");

const params = program
  .requiredOption("-i, --input <value>", "--input must be path")
  .requiredOption("-o, --output <value>", "--output must be path")
  .parse(process.argv)
  .opts();

const buildPath = path.resolve(__dirname, "../dist/index.js");

const MyCodGen = require(buildPath);

if (MyCodGen) {
  MyCodGen.default.generate(params);
  // console.log(MyCodGen.default.generate);
}
