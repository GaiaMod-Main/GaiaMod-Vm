function toAlnum (id) {
    const result = [];
    for (let i = 0; i < id.length; i++) {
        let c = id[i];
        if (!/[a-zA-Z_0-9]/.test(c)) {
            c = c.charCodeAt(0).toString(16);
        }
        result.push(c);
    }
    return result.join('');
}

function convertReporters(block, blocks, specs) {
    return specs.map(([p1, p2, p3]) => {
        const b = block[p1][p2];
        if (!b) return p3;
        const id = b.block;
        return convert(blocks[id], blocks, null, null);
    });
}

function convert (block, blocks, functions, whatIsNext, useFuture) {
    const isCont = e => typeof e === 'string';
    const asCode = (e, isFuture) => {
        const method = isFuture ? 'futureInvoke' : 'invoke';
        if (!e) {
            return [];
        }
        if (isCont(e)) {
            return [`this.${method}('${e}')`];
        }
        return e;
    };
    if (!block) return asCode(whatIsNext, useFuture);
    const op = block.opcode;
    if (op === 'croquet_modelCode') {
        const id = block.next;
        if (!id) return null;
        const result = convert(blocks[id], blocks, functions, null, false);
        if (isCont(result)) return result;
        const fName = `f_${toAlnum(block.id)}`;
        functions[fName] = result.join('');
        return fName;
    }
    if (op === 'control_repeat') {
        const subStack = block.inputs.SUBSTACK;
        const nextId = block.next;

        const fName = `f_${toAlnum(block.id)}`;
        const fNameLimit = `${fName}_Limit`;
        const fNameTest = `${fName}_test`;
        const fNameInit = `${fName}_init`;
        const fNameBody = `${fName}_body`;

        const times = block.inputs.TIMES;
        const timesStr = times ? convert(times ? blocks[times.block] : null, blocks, functions) : ['0'];

        const nextCode = convert(blocks[nextId], blocks, functions, whatIsNext, false);

        const subCode = convert(subStack ? blocks[subStack.block] : null, blocks, functions, fNameTest, true);

        functions[fNameInit] = [
            `this.$vars['${fName}'] = 0; this.$vars['${fNameLimit}'] = Cast.toNumber(`, ...timesStr, `);`,
            ...asCode(fNameTest, false)
        ].join('');

        functions[fNameTest] = [
            `this.$vars['${fName}'] += 1;`,
            `if (this.$vars['${fName}'] > this.$vars['${fNameLimit}']) {`,
            ...asCode(nextCode, false), ';',
            `} else {`,
            ...asCode(fNameBody, false), ';',
            `}`
        ].join('');

        functions[fNameBody] = [
            ...asCode(subCode), ';'
        ].join('');
        return fNameInit;
    }
    if (op === 'control_forever') {
        const subStack = block.inputs.SUBSTACK;
        const fName = `f_${toAlnum(block.id)}`;
        const fNameBody = `${fName}_body`;
        
        const subCode = convert(subStack ? blocks[subStack.block] : null, blocks, functions, fNameBody, true);

        functions[fNameBody] = [
            ...asCode(subCode), ';'
        ].join('');
        return fNameBody;
    }
        
    if (op === 'control_if' || op === 'control_if_else') {
        const fName = `f_${toAlnum(block.id)}`;
        const fNameTest = `${fName}_test`;
        const fNameNext = `${fName}_next`;

        const subStack = block.inputs.SUBSTACK;
        const subStack2 = block.inputs.SUBSTACK2;
        // const condition = block.inputs.CONDITION;
        const nextId = block.next;

        const nextCode = convert(blocks[nextId], blocks, functions, whatIsNext, useFuture);

        functions[fNameNext] = asCode(nextCode).join('');

        const subCode = convert(subStack ? blocks[subStack.block] : null, blocks, functions, fNameNext, false);

        const subCode2 = convert(subStack2 ? blocks[subStack2.block] : null, blocks, functions, fNameNext, false);

        // const cCode = condition ? convert(blocks[condition.block], blocks, functions) : ['false'];
        const cCode = convertReporters(block, blocks, [['inputs', 'CONDITION', ['false']]])[0];

        functions[fNameTest] = [
            'if (', cCode.join(''), ') {',
            ...asCode(subCode),
            '} else {',
            ...asCode(subCode2),
            '}'
        ].join('');
        return fNameTest;
    }
    if (op === 'control_wait') {
        const fName = `f_${toAlnum(block.id)}`;
        const fNameNext = `${fName}_next`;
        const duration = block.inputs.DURATION;
        const nextId = block.next;
        const nextCode = convert(blocks[nextId], blocks, functions, whatIsNext, useFuture);
        functions[fNameNext] = asCode(nextCode).join('');

        const dCode = duration ? convert(blocks[duration.block], blocks, functions) : ['0'];

        functions[fName] = [
            'this.future(Cast.toNumber(',
            ...dCode,
            `) * 1000).invoke('${fNameNext}')`
        ].join('');
        return fName;
    }
    if (op === 'croquet_setValue') {
        const nextId = block.next;
        const reporters = convertReporters(block, blocks, [
            ['inputs', 'NAME'],
            ['inputs', 'VALUE']
        ]); // should pass in shadow as default?
        const nameStr = reporters[0];
        const valueStr = reporters[1];

        const nextCode = convert(blocks[nextId], blocks, functions, whatIsNext, useFuture);

        const thisOne = ['this.setValue({name: ', ...nameStr, ', value: ', ...valueStr, '})'];

        // those two lines, should be identical but the bundler seems to have real trouble.
        return [].concat(thisOne).concat([';']).concat(asCode(nextCode));
        // return [...thisOne, ';', ...asCode(nextCode)]
    }
    if (op === 'croquet_getValue') { // REPORTER
        const nameStr = convertReporters(block, blocks, [['inputs', 'NAME']])[0];
        return ['this.getValue(', ...nameStr, ')'];
    }
    if ([
        'operator_add', 'operator_subtract', 'operator_multiply',
        'operator_divide', 'operator_mod',
        'operator_equals', 'operator_lt', 'operator_gt',
        'operator_join', 'operator_contains', 'operator_random',
        'operator_letter_of', 'operator_mathop'].indexOf(op) >= 0) {
        const method = {
            operator_add: 'addOp',
            operator_subtract: 'minusOp',
            operator_multiply: 'mulOp',
            operator_divide: 'divOp',
            operator_mod: 'modOp',
            operator_equals: 'equalsOp',
            operator_lt: 'ltOp',
            operator_gt: 'gtOp',
            operator_join: 'joinOp',
            operator_contains: 'containsOp',
            operator_random: 'randomOp',
            operator_letter_of: 'letterOf',
            operator_mathop: 'mathOp'
        }[op];

        let spec;
        if (['operator_add', 'operator_subtract', 'operator_multiply',
            'operator_divide', 'operator_mod'].indexOf(op) >= 0) {
            spec = [['inputs', 'NUM1'], ['inputs', 'NUM2']];
        }
        if (['operator_equals', 'operator_lt', 'operator_gt'].indexOf(op) >= 0) {
            spec = [['inputs', 'OPERAND1'], ['inputs', 'OPERAND2']];
        }
        if (['operator_join', 'operator_contains'].indexOf(op) >= 0) {
            spec = [['inputs', 'STRING1'], ['inputs', 'STRING2']];
        }
        if (['operator_random'].indexOf(op) >= 0) {
            spec = [['inputs', 'FROM'], ['inputs', 'TO']];
        }
        if (['operator_letter_of'].indexOf(op) >= 0) {
            spec = [['inputs', 'LETTER'], ['inputs', 'STRING']];
        }
        if (['operator_mathop'].indexOf(op) >= 0) {
            spec = [['inputs', 'OPERATOR'], ['inputs', 'NUM']];
        }
              
        const reporters = convertReporters(block, blocks, spec);
        const str1 = reporters[0];
        const str2 = reporters[1];
        
        return [`this.${method}(`, ...str1, ', ', ...str2, `)`];
    }
    if (op === 'operator_round') {
        const numStr = convertReporters(block, blocks, [['inputs', 'NUM']])[0];
        return [`this.roundOp(`, ...numStr, `)`];
    }
    if (op === 'operator_length') {
        const strStr = convertReporters(block, blocks, [['inputs', 'STRING']])[0];
        return ['this.lengthOp(', ...strStr, ')'];
    }
    if (op === 'text') { // REPORTER
        const fields = block.fields.TEXT;
        return ["'", fields.value, "'"];
    }
    if (op === 'math_number') {
        const fields = block.fields.NUM;
        return ["'", fields.value, "'"];
    }
    if (op === 'math_whole_number' || op === 'math_positive_number') {
        const fields = block.fields.NUM;
        return ["'", fields.value, "'"];
    }
}

function convertBlock (block, blocks) {
    const functions = {};
    const cont = convert(block, blocks, functions, null);
    return {functions, entryPoint: cont};
}

if (typeof module !== 'undefined') {
    module.exports = convertBlock;
}
