import objectAssign from 'object-assign';
import expect from 'expect';
import posthtml from 'posthtml';
import parseAttrs from '..';


describe('Parser', () => {
    it('should parse string attrs', () => {
        const tree = getTree('<input name="user" required>');
        const attrs = parseAttrs(tree[0].attrs);
        assertAttrs(attrs, {name: 'user', required: ''});
        expect(attrs.compose()).toEqual({name: 'user', required: ''});
    });


    it('should parse "class" attr', () => {
        const tree = getTree('<h1 class="title title-sub"></h1>');
        const attrs = parseAttrs(tree[0].attrs);
        assertAttrs(attrs, {class: ['title', 'title-sub']});
        expect(attrs.compose()).toEqual({class: 'title title-sub'});
    });


    it('should parse "style" attr', () => {
        const tree = getTree('<i style="color: red !important; background: url(http://github.com/logo.png); color: blue;"></i>');
        const attrs = parseAttrs(tree[0].attrs);
        assertAttrs(attrs, {style: {
            'color': ['red !important', 'blue'],
            'background': 'url(http://github.com/logo.png)'
        }});
        expect(attrs.compose()).toEqual({style: 'color: red !important; color: blue; background: url(http://github.com/logo.png)'});
    });


    it('should parse custom list attrs', () => {
        const tree = getTree('<div data-ids="1,2,3,4,"></div>');
        var attrs = parseAttrs(tree[0].attrs, {
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


    it('should parse custom dict attrs', () => {
        const tree = getTree('<div data-query="a=5&b=7&c=9"></div>');
        var attrs = parseAttrs(tree[0].attrs, {
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


    it('should do nothing if attrs is empty', () => {
        const tree = getTree('<div></div>');
        const attrs = parseAttrs(tree[0].attrs);
        assertAttrs(attrs, {});
        expect(attrs.compose()).toEqual({});
    });
});


function getTree(html) {
    return posthtml().process(html, { sync: true }).tree;
}


function assertAttrs(actual, expected) {
    actual = objectAssign({}, actual);
    delete actual.compose;

    expect(actual).toEqual(expected);
}
