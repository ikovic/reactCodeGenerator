reactCodeGenerator
=============

A CLI tool for generating React components source code.

Installing
----------

Install it as a global package:

```sh
npm install -g react-code-generator
```

Usage
----------
Run the generator with the following command:

```sh
generate-component <componentName> (-p)
```
This will result in creating a fresh JavaScript file in the current location (where you called the command from). Name of the file will be according to <componentName> argument.

If you use the '-p' flag, then the generated component will be written as a stateless functional component. Otherwise, a container component will be created as an ES6 module.
