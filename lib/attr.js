export function parseAttr(attrStr, rule) {
  rule = rule || {};
  const delimiter = rule.delimiter;
  const keyDelimiter = rule.keyDelimiter;

  if (!delimiter && !keyDelimiter) {
    return attrStr;
  }

  const attrValues = delimiter ? attrStr.split(delimiter) : [attrStr];
  if (!keyDelimiter) {
    return attrValues;
  }

  const attrDict = {};
  /**
   * We need to split attrKeyValue by keyDelimiter only once.
   * Therefore we use match() + slice() instead of split()
   */
  attrValues.forEach(attrKeyValue => {
    const match = attrKeyValue.match(keyDelimiter);
    if (!match) {
      return;
    }

    const attrKey = attrKeyValue.slice(0, match.index);
    if (!attrKey) {
      return;
    }

    const attrValue = attrKeyValue.slice(match.index + match[0].length) || '';
    let attrCombinedValue = attrDict[attrKey];

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

  const attrKeyValues = [];
  for (let attrName of Object.keys(attr)) {
    let attrCombinedValue = Array.isArray(attr[attrName]) ? attr[attrName] : [attr[attrName]];

    attrCombinedValue.forEach(attrValue => {
      attrKeyValues.push(attrName + keyDelimiter + attrValue);
    });
  }

  return attrKeyValues.join(delimiter);
}
