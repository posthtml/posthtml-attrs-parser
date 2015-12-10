import objectAssign from 'object-assign';
import defaultParseRules from './parseRules';
import { parseAttr, stringifyAttr } from './attr';


export default function parseAttrs(posthtmlAttrs = {}, options = {}) {
    const parseRules = objectAssign({}, defaultParseRules, options.rules || {});
    var attrs = {};
    for (let attrName of Object.keys(posthtmlAttrs)) {
        attrs[attrName] = parseAttr(posthtmlAttrs[attrName], parseRules[attrName]);
    }

    attrs.compose = function () {
        return composeAttrs(this, parseRules);
    };

    return attrs;
}


function composeAttrs(attrs, parseRules) {
    delete attrs.compose;

    var posthtmlAttrs = {};
    for (let attrName of Object.keys(attrs)) {
        posthtmlAttrs[attrName] = stringifyAttr(attrs[attrName], parseRules[attrName]);
    }

    return posthtmlAttrs;
}
