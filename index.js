#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const doT = require('dot');
const minimist = require('minimist');
const camelCase = require('camelcase');
const capitalize = require('capitalize');
const reserved = require('reserved-words');

const templatesDir = path.join(__dirname, 'templates');
const config = getConfigFromArgs(process.argv.slice(2));

if (!validateConfig(config)) {
  displayHelp();
  return;
}

formatConfig(config);
loadTemplate(config)
  .then(template => {
    let source = interpolateTemplate(config, template);
    let fileName = config.id + '.js';
    return saveSource(fileName, source);
  })
  .then(outputFileName => {
    console.log('Created component: ' + outputFileName);
  })
  .catch(error => {
    console.log(error);
  });

function getConfigFromArgs(argv) {
  let parsedArgs = minimist(argv, {
    boolean: 'presentation',
    alias: {h: 'help', presentation: 'p'}
  });

  return {
    name: parsedArgs._[0],
    presentation: parsedArgs.presentation
  }
}

function validateConfig(config) {
  if (!config.name) {
    console.log('No component name provided!');
    return false;
  }
  if (reserved.check(config.name, 'es2015')) {
    console.log('You have entered a reserved ES6 keyword as a component name!');
    return false;
  }

  return true;
}

function formatConfig(config) {
  config.name = capitalize(camelCase(config.name));
  config.id = camelCase(config.name);
}

function loadTemplate(config) {
  return new Promise((resolve, reject) => {
    const templateFileName = getTemplateFileName(config);
    fs.readFile(path.join(templatesDir, templateFileName), 'utf8', function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  })
}

function getTemplateFileName(config) {
  return config.presentation ? 'presentation.js' : 'container.js';
}

function interpolateTemplate(config, templateSource) {
  doT.templateSettings.strip = false;
  let template = doT.template(templateSource);
  return template(config);
}

function saveSource(fileName, source) {
  return new Promise((resolve, reject) => {
    fs.writeFile(fileName, source, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve(fileName);
      }
    })
  });
}
function displayHelp() {
  console.log('Usage: generate-component [name] (-p)');
}
