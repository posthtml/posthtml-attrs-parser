export function parseAttr(attrStr, rule) {
    rule = rule || {};
    const delimiter = rule.delimiter;
    const keyDelimiter = rule.keyDelimiter;
    if (! delimiter && ! keyDelimiter) {
        return attrStr;
    }

    var attrValues = delimiter ? attrStr.split(delimiter) : [attrStr];
    if (! keyDelimiter) {
        return attrValues;
    }

    var attrDict = {};
    attrValues.forEach(attrKeyValue => {
        const attrParts = attrKeyValue.split(keyDelimiter);
        const attrKey = attrParts[0];
        if (! attrKey) {
            return;
        }

        const attrValue = attrParts[1] || '';
        var attrCombinedValue = attrDict[attrKey];

        if (attrCombinedValue) {
            if (! Array.isArray(attrCombinedValue)) {
                attrCombinedValue = [attrCombinedValue];
            }
            attrCombinedValue.push(attrValue);
        } else {
            attrCombinedValue = attrValue;
        }

        attrDict[attrKey] = attrCombinedValue;
    });

    return attrDict;
}



export function stringifyAttr(attr, rule) {
    rule = rule || {};
    const delimiter = (rule.glue || rule.delimiter || '').toString();
    const keyDelimiter = (rule.keyGlue || rule.keyDelimiter || '').toString();

    if (typeof attr === 'string') {
        return attr;
    }

    if (Array.isArray(attr)) {
        return attr.join(delimiter);
    }

    var attrKeyValues = [];
    for (let attrName of Object.keys(attr)) {
        let attrCombinedValue = Array.isArray(attr[attrName]) ? attr[attrName] : [attr[attrName]];
        attrCombinedValue.forEach(attrValue => {
            attrKeyValues.push(attrName + keyDelimiter + attrValue);
        });
    }

    return attrKeyValues.join(delimiter);
}
