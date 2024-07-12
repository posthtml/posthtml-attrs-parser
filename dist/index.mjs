const defaultParseRules = {
  class: {
    delimiter: /\s+/,
    glue: " "
  },
  style: {
    delimiter: /\s*;\s*(?![^()]*\))/,
    keyDelimiter: /\s*:\s*/,
    glue: "; ",
    keyGlue: ": "
  }
};

function parseAttr(attrStr, rule) {
  rule = rule || {};
  const delimiter = rule.delimiter;
  const keyDelimiter = rule.keyDelimiter;
  if (!delimiter && !keyDelimiter) {
    return attrStr;
  }
  const attrValues = delimiter ? String(attrStr).split(delimiter) : [attrStr];
  if (!keyDelimiter) {
    return attrValues;
  }
  const attrDict = {};
  attrValues.forEach((attrKeyValue) => {
    const match = attrKeyValue.match(keyDelimiter);
    if (!match) {
      return;
    }
    const attrKey = attrKeyValue.slice(0, match.index);
    if (!attrKey) {
      return;
    }
    const attrValue = attrKeyValue.slice(match.index + match[0].length) || "";
    let attrCombinedValue = attrDict[attrKey];
    if (attrCombinedValue) {
      if (!Array.isArray(attrCombinedValue)) {
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
function stringifyAttr(attr, rule) {
  rule = rule || {};
  const delimiter = (rule.glue || rule.delimiter || "").toString();
  const keyDelimiter = (rule.keyGlue || rule.keyDelimiter || "").toString();
  if (typeof attr === "string") {
    return attr;
  }
  if (Array.isArray(attr)) {
    return attr.join(delimiter);
  }
  const attrKeyValues = [];
  for (const attrName of Object.keys(attr)) {
    const attrCombinedValue = Array.isArray(attr[attrName]) ? attr[attrName] : [attr[attrName]];
    for (const attrValue of attrCombinedValue) {
      attrKeyValues.push(attrName + keyDelimiter + attrValue);
    }
  }
  return attrKeyValues.join(delimiter);
}

function parseAttrs(posthtmlAttrs = {}, options = {}) {
  const parseRules = Object.assign({}, defaultParseRules, options.rules || {});
  const attrs = {};
  for (const attrName of Object.keys(posthtmlAttrs)) {
    attrs[attrName] = parseAttr(posthtmlAttrs[attrName], parseRules[attrName]);
  }
  attrs.compose = function() {
    return composeAttrs(this, parseRules);
  };
  return attrs;
}
function composeAttrs(attrs, parseRules) {
  delete attrs.compose;
  const posthtmlAttrs = {};
  for (const attrName of Object.keys(attrs)) {
    posthtmlAttrs[attrName] = stringifyAttr(attrs[attrName], parseRules[attrName]) || true;
  }
  return posthtmlAttrs;
}

export { parseAttrs as default };
