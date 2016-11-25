#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const doT = require('dot');
const camelCase = require('camelcase');
const capitalize = require('capitalize');
const reserved = require('reserved-words');

const templatesDir = path.join(__dirname, 'templates');

var component = {
    name: 'Default',
    id: 'default'
};

// parse command line arguments
if (process.argv.length < 3) {
    console.log('No class name provided - used default instead!');
} else {
    let componentName = process.argv[2];
    if (reserved.check(componentName, 'es2015')) {
        console.log('You have entered a reserved ES6 keyword!');
        return;
    }
    component.name = capitalize(camelCase(componentName));
    component.id = camelCase(component.name);
}

fs.readFile(path.join(templatesDir, 'component.js'), 'utf8', function (err, data) {
    if (err) {
        console.log(err);
    } else {
        doT.templateSettings.strip = false;
        let template = doT.template(data);
        let output = template(component);
        let fileName = component.id + '.js';
        let outputLocation = path.join(__dirname, 'output', fileName);
        fs.writeFile(outputLocation, output, function (err) {
            if (err) {
                console.log(err);
            }
        })
    }
});