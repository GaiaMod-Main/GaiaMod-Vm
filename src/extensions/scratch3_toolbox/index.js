const icon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAAaVBMVEUAAAAAAAAkJCQfHx8fHx8jIyMhISEhISEgICAiIiIgICAhISEhISEhISEgICAiIiIhISEiIiIhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEiIiIhISEhISEhISEhISEhISH////0Ya7vAAAAIXRSTlMAARwxMjNUVVhZd3t8fX+Ag4iKw8TP0NHS0+Lj5Pv8/f6YOwMnAAAAAWJLR0QiXWVcrAAAAJJJREFUKM/FktsOgyAMQJ3u5uaGVVHnLtD//8klndCGbj7sxfNEOEkPELJsRXajR8IPWyWHqToR1dQr6eqwqp2SaMLK4LeaJJRjTRLKXJPMZa5J5jLJ4433xzKRV9xE6Y2QP/jIDgBahAhtdGLs+cVjn5ekmR/4QPs8kYtX+UsuPl9/b0DRPCzJwjr9As4W63zXN/SEFN4JKmm3AAAAAElFTkSuQmCC"

class Toolbox {

    dictionaries = {}

    constructor() {
    }

    getInfo() {
        return {
            id: "toolbox",
            name: "Toolbox",
            blockIconURI: icon,
            blocks: [
                {
                    opcode: "ternaryOperatorForNumbers",
                    blockType: "reporter",
                    text: "if [a] then [b] else [c]",
                    arguments: {
                        a: {
                            type: "Boolean"
                        },
                        b: {
                            type: "number",
                            defaultValue: 1
                        },
                        c: {
                            type: "number",
                            defaultValue: 2
                        }
                    }
                },
                {
                    opcode: "ternaryOperatorForStrings",
                    blockType: "reporter",
                    text: "if [a] then [b] else [c]",
                    arguments: {
                        a: {
                            type: "Boolean"
                        },
                        b: {
                            type: "string",
                            defaultValue: "A"
                        },
                        c: {
                            type: "string",
                            defaultValue: "B"
                        }
                    }
                },
                {
                    opcode: "power",
                    blockType: "reporter",
                    text: "[a] ** [b]",
                    arguments: {
                        a: {
                            type: "number",
                            defaultValue: 10
                        },
                        b: {
                            type: "number",
                            defaultValue: 3
                        }
                    }
                },
                {
                    opcode: "factorial",
                    blockType: "reporter",
                    text: "[a]!",
                    arguments: {
                        a: {
                            type: "number",
                            defaultValue: 5
                        }
                    }
                },
                {
                    opcode: "greaterEqual",
                    blockType: "Boolean",
                    text: "[a] ≥ [b]",
                    arguments: {
                        a: {
                            type: "number",
                            defaultValue: 10
                        },
                        b: {
                            type: "number",
                            defaultValue: 50
                        }
                    }
                },
                {
                    opcode: "lessEqual",
                    blockType: "Boolean",
                    text: "[a] ≤ [b]",
                    arguments: {
                        a: {
                            type: "number",
                            defaultValue: 10
                        },
                        b: {
                            type: "number",
                            defaultValue: 50
                        }
                    }
                },
                {
                    opcode: "inequal",
                    blockType: "Boolean",
                    text: "[a] ≠ [b]",
                    arguments: {
                        a: {
                            type: "number",
                            defaultValue: 10
                        },
                        b: {
                            type: "number",
                            defaultValue: 50
                        }
                    }
                },
                {
                    opcode: "indexOf",
                    blockType: "reporter",
                    text: "position of [a] in [b]",
                    arguments: {
                        a: {
                            type: "string",
                            defaultValue: "World"
                        },
                        b: {
                            type: "string",
                            defaultValue: "Hello, World!"
                        }
                    }
                },
                {
                    opcode: "slice",
                    blockType: "reporter",
                    text: "part of [a] from [b] to [c]",
                    arguments: {
                        a: {
                            type: "string",
                            defaultValue: "Hello, World!"
                        },
                        b: {
                            type: "number",
                            defaultValue: 8
                        },
                        c: {
                            type: "number",
                            defaultValue: 12
                        }
                    }
                },
                {
                    opcode: "replace",
                    blockType: "reporter",
                    text: "replace [a] in [b] with [c]",
                    arguments: {
                        a: {
                            type: "string",
                            defaultValue: "World"
                        },
                        b: {
                            type: "string",
                            defaultValue: "Hello, World!"
                        },
                        c: {
                            type: "string",
                            defaultValue: "Space"
                        }
                    }
                },
                {
                    opcode: "startsEnds",
                    blockType: "Boolean",
                    text: "[a] [b] with [c]?",
                    arguments: {
                        a: {
                            type: "string",
                            defaultValue: "Hello, World!"
                        },
                        b: {
                            type: "string",
                            menu: "startsEnds",
                            defaultValue: "starts"
                        },
                        c: {
                            type: "string",
                            defaultValue: "Hello"
                        }
                    }
                },
                {
                    opcode: "lowerUpper",
                    blockType: "reporter",
                    text: "[a] as [b]",
                    arguments: {
                        a: {
                            type: "string",
                            defaultValue: "Hello, World!"
                        },
                        b: {
                            type: "string",
                            menu: "lowerUpper",
                            defaultValue: "lowercase"
                        }
                    }
                },
                {
                    opcode: "trueFalse",
                    blockType: "Boolean",
                    text: "[a]",
                    arguments: {
                        a: {
                            type: "string",
                            menu: "trueFalse",
                            defaultValue: "true"
                        }
                    }
                },
                {
                    opcode: "controlCharacter",
                    blockType: "reporter",
                    text: "[a]",
                    arguments: {
                        a: {
                            type: "string",
                            menu: "controlCharacter",
                            defaultValue: "LF"
                        }
                    }
                },
                {
                    opcode: "logicalOperator",
                    blockType: "reporter",
                    text: "[a] [b] [c]",
                    arguments: {
                        a: {
                            type: "number",
                            defaultValue: 4
                        },
                        b: {
                            type: "string",
                            menu: "logicalOperator",
                            defaultValue: "<<"
                        },
                        c: {
                            type: "number",
                            defaultValue: 1
                        }
                    }
                },
                {
                    opcode: "dictionarySet",
                    blockType: "command",
                    text: "set [key] of [dictionary] to [value]",
                    arguments: {
                        key: {
                            type: "string",
                            defaultValue: "key"
                        },
                        dictionary: {
                            type: "string",
                            defaultValue: "dictionary"
                        },
                        value: {
                            type: "string",
                            defaultValue: "value"
                        }
                    }
                },
                {
                    opcode: "dictionaryIn",
                    blockType: "Boolean",
                    text: "is [key] in [dictionary]?",
                    arguments: {
                        key: {
                            type: "string",
                            defaultValue: "key"
                        },
                        dictionary: {
                            type: "string",
                            defaultValue: "dictionary"
                        }
                    }
                },
                {
                    opcode: "dictionaryGet",
                    blockType: "reporter",
                    text: "get [key] of [dictionary] or [value]",
                    arguments: {
                        key: {
                            type: "string",
                            defaultValue: "key"
                        },
                        dictionary: {
                            type: "string",
                            defaultValue: "dictionary"
                        },
                        value: {
                            type: "string",
                            defaultValue: "value"
                        }
                    }
                },
                {
                    opcode: "dictionary",
                    blockType: "reporter",
                    text: "[dictionary]",
                    arguments: {
                        dictionary: {
                            type: "string",
                            defaultValue: "dictionary"
                        }
                    }
                },
                {
                    opcode: "evaluate",
                    blockType: "reporter",
                    text: "eval [expression]",
                    arguments: {
                        expression: {
                            type: "string",
                            defaultValue: "1 + 1"
                        }
                    }
                },
            ],
            menus: {
                startsEnds: ["starts", "ends"],
                lowerUpper: ["lowercase", "UPPERCASE"],
                trueFalse: ["true", "false"],
                controlCharacter: ["NUL", "TAB", "LF", "CR"],
                logicalOperator: ["<<", ">>", ">>>", "&", "^", "|"]
            }
        };
    }

    ternaryOperatorForNumbers({ a, b, c }) {
        return a ? b : c
    }

    ternaryOperatorForStrings({ a, b, c }) {
        return a ? b : c
    }

    power({ a, b }) {
        return a ** b
    }

    factorial({ a }) {
        if (a == 0 || a == 1)
            return 1
        for (var i = a - 1; i >= 1; i--) {
            a *= i
        }
        return a
    }

    greaterEqual({ a, b }) {
        return a >= b
    }

    lessEqual({ a, b }) {
        return a <= b
    }

    inequal({ a, b }) {
        return a != b
    }

    indexOf({ a, b }) {
        return b.indexOf(a) + 1
    }

    slice({ a, b, c }) {
        return a.slice(b - 1, c)
    }

    replace({ a, b, c }) {
        return b.replace(a, c)
    }

    startsEnds({ a, b, c }) {
        switch (b) {
            case "starts": return a.startsWith(c)
            case "ends": return a.endsWith(c)
        }
    }

    lowerUpper({ a, b }) {
        switch (b) {
            case "lowercase": return a.toLowerCase()
            case "UPPERCASE": return a.toUpperCase()
        }
    }

    trueFalse({ a }) {
        return a == "true"
    }

    controlCharacter({ a }) {
        switch (a) {
            case "NUL": return "\0"
            case "TAB": return "\t"
            case "LF": return "\n"
            case "CR": return "\r"
        }
    }

    logicalOperator({ a, b, c }) {
        switch (b) {
            case "<<": return a << c
            case ">>": return a >> c
            case ">>>": return a >>> c
            case "&": return a & c
            case "^": return a ^ c
            case "|": return a | c
        }
    }

    dictionarySet({ key, dictionary, value }) {
        if (!(dictionary in this.dictionaries)) {
            this.dictionaries[dictionary] = {}
        }
        this.dictionaries[dictionary][key] = value
    }

    dictionaryIn({ key, dictionary }) {
        return dictionary in this.dictionaries && key in this.dictionaries[dictionary]
    }

    dictionaryGet({ key, dictionary, value }) {
        if (!(dictionary in this.dictionaries)) {
            return value
        } if (!(key in this.dictionaries[dictionary])) {
            return value
        } else {
            return this.dictionaries[dictionary][key]
        }
    }

    dictionary({ dictionary }) {
        if (dictionary in this.dictionaries) {
            return JSON.stringify(this.dictionaries[dictionary])
        } else {
            return null
        }
    }

    evaluate({ expression }) {
        return eval(expression)
    }

}

module.exports = Toolbox;