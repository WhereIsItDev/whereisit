# -*- coding: utf-8 -*-
# AngelHack Brooklyn 2015
import sys

from textwrap import dedent


SAMPLE_CTAGS_OUTPUT = dedent("""\
!_TAG_PROGRAM_URL	http://ctags.sourceforge.net	/official site/
!_TAG_PROGRAM_VERSION	5.9~svn20110310	//
$.addFlex	Flexigrid/js/flexigrid.js	69;"	f
$.addFlex	Flexigrid/js/flexigrid.js	75;"	f
""").split('\n')


class Tag(object):
    def __init__(self, *args):
        if len(args) < 3:
            raise Exception('bad args')
        self.tagname = args[0]
        self.tagfile = args[1]
        self.tagaddress = args[2]
        self.linenum = int(self.tagaddress.split(';')[0])

    def __str__(self):
        return '(%s)(%s)(%s)' % (self.tagname, self.tagfile, self.tagaddress)

    def __repr__(self):
        return str(self)


class Snippet(object):
    def __init__(self, filepath, linenum, snippet):
        self.filepath = filepath
        self.linenum = linenum
        self.snippet = snippet

    def __str__(self):
        return '(%s)(%s)(%s)' % (
            self.filepath, self.linenum, self.snippet)

    def __repr__(self):
        return str(self)


def make_tags(lines):
    """Takes in lines of tags file output,
    returns list of Tag objects

    >>> lines = SAMPLE_CTAGS_OUTPUT
    >>> results = list(make_tags(lines))
    >>> results[0]
    ($.addFlex)(Flexigrid/js/flexigrid.js)(69;")
    >>> results[1]
    ($.addFlex)(Flexigrid/js/flexigrid.js)(75;")
    """
    for line in lines:
        if not line or line[0] == '!':
            continue
        parts = line.split('\t')
        yield Tag(*parts)


def lookup_tagname(tagname, tags):
    """Looks up a tag within a list of Tags via the tagname

    >>> tags = make_tags(SAMPLE_CTAGS_OUTPUT)
    >>> results = list(lookup_tagname('$.addFlex', tags))
    >>> results[0]
    ($.addFlex)(Flexigrid/js/flexigrid.js)(69;")
    >>> results[1]
    ($.addFlex)(Flexigrid/js/flexigrid.js)(75;")
    """
    for tag in tags:
        if tag.tagname == tagname:
            yield tag


def get_snippet(tag):
    """A tag has information on the filename,
    and also the line where this tag can be found.

    >>> name = 'parser.py'
    >>> tag = Tag(name, name, '1;"')
    >>> get_snippet(tag)
    (parser.py)(1)(# AngelHack Brooklyn 2015)
    """
    path = tag.tagfile
    linenum = tag.linenum
    with open(path, 'r') as f:
        for i, l in enumerate(f):
            if i == linenum:
                line = l
                break;
        else:
            line = None
    return Snippet(path, linenum, line.strip() if line else '')


def main(tagname, tagsfile):
    """
    >>> snippet = main('$.fn.flexAddData', 'sample-tags')
    >>> snippet[0].filepath
    'Flexigrid/js/flexigrid.js'
    >>> snippet[0].linenum
    1516
    >>> snippet[0].snippet
    '$.fn.flexAddData = function (data) { // function to add data to grid'
    """
    tags = make_tags(open(tagsfile))
    candidates = lookup_tagname(tagname, tags)
    snippets = map(get_snippet, candidates)
    return snippets


if __name__ == '__main__':
    # import doctest
    # doctest.testmod()
    if len(sys.argv) == 3:
        snippets = main(sys.argv[1], sys.argv[2])
        print snippets
