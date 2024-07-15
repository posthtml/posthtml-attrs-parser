import defaultParseRules from './parseRules.js';
import { parseAttr, stringifyAttr } from './attr.js';

export default function parseAttrs(posthtmlAttrs = {}, options = {}) {
  const parseRules = Object.assign({}, defaultParseRules, options.rules || {});
  const attrs = {};

  for (const attrName of Object.keys(posthtmlAttrs)) {
    attrs[attrName] = parseAttr(posthtmlAttrs[attrName], parseRules[attrName]);
  }

  attrs.compose = function () {
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
