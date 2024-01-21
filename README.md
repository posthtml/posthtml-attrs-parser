<div align="center">
  <img width="150" height="150" alt="PostHTML" src="https://posthtml.github.io/posthtml/logo.svg">
  <h1>posthtml-attrs-parser</h1>
  <p>PostHTML plugin for parsing HTML attributes</p>

  [![Version][npm-version-shield]][npm]
  [![Build][github-ci-shield]][github-ci]
  [![License][license-shield]][license]
  [![Downloads][npm-stats-shield]][npm-stats]
</div>

[npm]: https://www.npmjs.com/package/posthtml-attrs-parser
[npm-version-shield]: https://img.shields.io/npm/v/posthtml-attrs-parser.svg
[npm-stats]: http://npm-stat.com/charts.html?package=posthtml-attrs-parser
[npm-stats-shield]: https://img.shields.io/npm/dt/posthtml-attrs-parser.svg
[github-ci]: https://github.com/cossssmin/posthtml-attrs-parser/actions/workflows/nodejs.yml
[github-ci-shield]: https://github.com/cossssmin/posthtml-attrs-parser/actions/workflows/nodejs.yml/badge.svg
[license]: ./license
[license-shield]: https://img.shields.io/npm/l/posthtml-attrs-parser.svg

A [PostHTML](https://github.com/posthtml/posthtml) helper plugin that provides a better API for working with tag attributes.

This plugin is ESM-only.

## Usage
```js
import posthtml from 'posthtml';
import parseAttrs from 'posthtml-attrs-parser';

posthtml()
  .use(function (tree) {
    const div = tree[0];
    const attrs = parseAttrs(div.attrs);

    attrs.style['font-size'] = '15px';
    attrs.class.push('title-sub');

    // Compose attributes back to PostHTML-compatible format
    div.attrs = attrs.compose();
  })
  .process('<div class="title" style="font-size: 14px">Hello!</div>')
  .then(function (result) {
    console.log(result.html);
  });

// <div class="title title-sub" style="font-size: 15px">Hello!</div>
```

## Attributes

Only `style` and `class` attributes are parsed by default (as object and array, respectively). For other attributes, the parsing rules should be specified (see [Custom parsing rule](#custom-parsing-rule) below).

### Default attributes

#### `style`

```html
<div style="color: red; font-size: 14px; color: blue"></div>
```
```js
const attrs = parseAttrs(div.attrs);

console.log(attrs.style);
/*
{
  // If there are several properties with the same name,
  // the values are packed in array
  'color': ['red', 'blue'],
  'font-size': '14px'
}
*/
```

#### `class`

```html
<div class="title title-sub"></div>
```
```js
const attrs = parseAttrs(div.attrs);

console.log(attrs.class);
// ['title', 'title-sub']
```

### Custom parsing rule

You may also define the parsing rule for other attributes.

#### Array-like attribute

```html
<div data-ids="1  2 4 5   6"></div>
```
```js
const attrs = parseAttrs(div.attrs, {
  rules: {
  'data-ids': {
    delimiter: /\s+/,
    // Optional parameter for stringifying attribute's values
    // If not set, glue = delimiter
    glue: ' '
  }
}
});

console.log(attrs['data-ids']);
// ['1', '2', '4', '5', '6']

console.log(attrs.compose()['data-ids']);
// 1 2 3 4 5 6
```

#### Object-like attribute

```html
<div data-config="TEST=1;ENV=debug;PATH=."></div>
```
```js
const attrs = parseAttrs(div.attrs, {
  rules: {
    'data-config': {
      // Delimiter for key-value pairs
      delimiter: ';',
      // Delimiter for a key-value
      keyDelimiter: '=',
      // Optional parameter for stringifying key-value pairs
      // If not set, keyGlue = keyDelimiter
      glue: '; ',
      // Optional parameter for stringifying a key-value
      // If not set, glue = delimiter
      keyGlue: ' = '
    }
  }
});

console.log(attrs['data-config']);
// {TEST: '1', ENV: 'debug', PATH: '.'}

console.log(attrs.compose()['data-config']);
// TEST = 1; ENV = debug; PATH = .
```
