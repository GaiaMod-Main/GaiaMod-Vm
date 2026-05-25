// This is the entry point for the extension worker
const TeachableMachine = require('./index.js');
const name = 'teachableMachine';
const extensionClass = TeachableMachine;
module.exports = {name, extensionClass};
