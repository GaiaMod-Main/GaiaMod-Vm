const corsProxyBaseUrl = 'https://corsproxy.ogadaki.workers.dev';
module.exports = {
    extensions: {
        adavision: {
            constructorConfig: {
                corsProxyBaseUrl
            }
        },
        adasound: {
            constructorConfig: {
                corsProxyBaseUrl
            }
        },
        adagif: {
            constructorConfig: {
                corsProxyBaseUrl
            }
        },
    }
};