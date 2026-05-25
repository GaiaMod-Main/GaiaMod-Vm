const RgbColors = {
    BLACK: {
        r: 0,
        g: 0,
        b: 0
    },
    WHITE: {
        r: 255,
        g: 255,
        b: 255
    },
    RED: {
        r: 255,
        g: 0,
        b: 0
    },
    GREEN: {
        r: 0,
        g: 255,
        b: 0
    },
    BLUE: {
        r: 0,
        g: 0,
        b: 255
    },
    YELLOW: {
        r: 255,
        g: 255,
        b: 0
    },
    PURPLE: {
        r: 127,
        g: 0,
        b: 127
    },
    ORANGE: {
        r: 255,
        g: 165,
        b: 0
    },
    PINK: {
        r: 255,
        g: 0,
        b: 255
    },
    DARKGREY: {
        r: 127,
        g: 127,
        b: 127
    }
};

const Colors = {
    WHITE: 0,
    BLACK: 1,
    RED: 2,
    GREEN: 3,
    BLUE: 4,
    YELLOW: 5,
    PURPLE: 6,
    ORANGE: 7,
    PINK: 8,
    DARKGREY: 9
};

// eslint-disable-next-line func-style, require-jsdoc
const rgbFromStr = function (text) {
    if (text === Colors.WHITE) {
        return RgbColors.WHITE;
    } else if (text === Colors.BLACK) {
        return RgbColors.BLACK;
    } else if (text === Colors.RED) {
        return RgbColors.RED;
    } else if (text === Colors.GREEN) {
        return RgbColors.GREEN;
    } else if (text === Colors.BLUE) {
        return RgbColors.BLUE;
    } else if (text === Colors.YELLOW) {
        return RgbColors.YELLOW;
    } else if (text === Colors.PURPLE) {
        return RgbColors.PURPLE;
    } else if (text === Colors.ORANGE) {
        return RgbColors.ORANGE;
    } else if (text === Colors.PINK) {
        return RgbColors.PINK;
    } else if (text === Colors.DARKGREY) {
        return RgbColors.DARKGREY;
    }
    return RgbColors.WHITE;
};

exports.RgbColors = RgbColors;
exports.Colors = Colors;
exports.rgbFromStr = rgbFromStr;
