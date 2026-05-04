module.exports = {
    extensions: {
        adasound: {
            name: 'IA Son',
            opcodesToHideFromPalette: [
                'selectModelByUrl',
                'selectModelByKey'
            ]
        },
        adavision: {
            name: 'IA Image',
            opcodesToHideFromPalette: [
                'selectModelByUrl',
                'selectModelByKey',
                'runPredictionOnWebcam'
            ]
        }
    }
};