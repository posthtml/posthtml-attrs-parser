import posthtml from 'posthtml';
import { test, expect } from 'vitest';
import parseAttrs from '../lib/index.js';

test('should parse string attrs', () => {
  const tree = getTree('<input name="user" required>');
  const attrs = parseAttrs(tree[0].attrs);

  assertAttrs(attrs, {name: 'user', required: ''});
  expect(attrs.compose()).toEqual({name: 'user', required: true});
});

test('should parse "class" attr', () => {
  const tree = getTree('<h1 class="title title-sub"></h1>');
  const attrs = parseAttrs(tree[0].attrs);

  assertAttrs(attrs, {class: ['title', 'title-sub']});
  expect(attrs.compose()).toEqual({class: 'title title-sub'});
});

test('should parse "style" attr', () => {
  const tree = getTree('<i style="color: red !important; background: url(http://github.com/logo.png); color: blue;"></i>');
  const attrs = parseAttrs(tree[0].attrs);

  const base64String = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkAAIAAAoAAv/lxKUAAAAASUVORK5CYII=';
  const base64Tree = getTree(`<i style="color: red !important; background: url('${base64String}'); color: blue;"></i>`);
  const base64Attrs = parseAttrs(base64Tree[0].attrs);

  assertAttrs(attrs, {style: {
    'color': ['red !important', 'blue'],
    'background': 'url(http://github.com/logo.png)'
  }});
  expect(attrs.compose()).toEqual({style: 'color: red !important; color: blue; background: url(http://github.com/logo.png)'});

  assertAttrs(base64Attrs, {style: {
    'color': ['red !important', 'blue'],
    'background': `url('${base64String}')`
  }});
  expect(base64Attrs.compose()).toEqual({style: `color: red !important; color: blue; background: url('${base64String}')`});
});

test('should parse custom list attrs', () => {
  const tree = getTree('<div data-ids="1,2,3,4,"></div>');
  let attrs = parseAttrs(tree[0].attrs, {
    rules: {'data-ids': {delimiter: ','}}
  });

  assertAttrs(attrs, {'data-ids': ['1', '2', '3', '4', '']});
  expect(attrs.compose()).toEqual({'data-ids': '1,2,3,4,'});

  attrs = parseAttrs(tree[0].attrs, {
    rules: {'data-ids': {delimiter: /,\s*/, glue: ';'}}
  });

  assertAttrs(attrs, {'data-ids': ['1', '2', '3', '4', '']});
  expect(attrs.compose()).toEqual({'data-ids': '1;2;3;4;'});
});

test('should parse custom dict attrs', () => {
  const tree = getTree('<div data-query="a=5&b=7&c=9"></div>');
  let attrs = parseAttrs(tree[0].attrs, {
    rules: {
      'data-query': {delimiter: '&', keyDelimiter: '='}
    }
  });

  assertAttrs(attrs, {'data-query': {a: '5', b: '7', c: '9'}});
  expect(attrs.compose()).toEqual({'data-query': 'a=5&b=7&c=9'});

  attrs = parseAttrs(tree[0].attrs, {
    rules: {
      'data-query': {
        delimiter: '&', keyDelimiter: '=', glue: ', ', keyGlue: ':'
      }
    }
  });

  assertAttrs(attrs, {'data-query': {a: '5', b: '7', c: '9'}});
  expect(attrs.compose()).toEqual({'data-query': 'a:5, b:7, c:9'});
});

test('should do nothing if attrs is empty', () => {
  const tree = getTree('<div></div>');
  const attrs = parseAttrs(tree[0].attrs);

  assertAttrs(attrs, {});
  expect(attrs.compose()).toEqual({});
});

function getTree(html) {
  return posthtml().process(html, { sync: true }).tree;
}

function assertAttrs(actual, expected) {
  actual = Object.assign({}, actual);
  delete actual.compose;

  expect(actual).toEqual(expected);
}
