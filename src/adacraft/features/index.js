const environments = {
    VITTASCIENCE: Symbol(),
    ADACRAFT_ORG: Symbol()
};

const adacraftOrgConfig = require('./config/environments/adacraft-org');
const vittascienceConfig = require('./config/environments/vittascience');
const configs = {
    [environments.ADACRAFT_ORG]: adacraftOrgConfig,
    [environments.VITTASCIENCE]: vittascienceConfig
};

let defaultTarget = environments.ADACRAFT_ORG;

// The choice of the target environment is done by setting a env var for the
// build of adacraft. Obviously, its value must be one of the environment names
// defined above. 
let target = defaultTarget;
const name = process.env.TARGET_ENVIRONMENT;
if (name !== undefined) {
    const newTarget = environments[name];
    if (newTarget === undefined) {
        console.log(`"${name}" is an unknown TARGET_ENVIRONMENT, switch to default one`)
    } else {
        target = newTarget;
    }
}

module.exports = {
    config: configs[target],
};