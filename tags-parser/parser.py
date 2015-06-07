# -*- coding: utf-8 -*-
# AngelHack Brooklyn 2015
import os
import json
import subprocess
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
        """
        >>> name = 'repos/danielcodes/Algorithms/Seven/Graph.java'
        >>> tag = Tag(name, name, '4;"', 'm', 'class:Graph')
        >>> tag.kind
        'method'
        >>> tag.member_of
        'class:Graph'
        >>> tag.member_of_kind
        'class'
        >>> tag.member_of_name
        'Graph'
        """
        if len(args) < 3:
            raise Exception('bad args')
        self.tagname = args[0]
        self.tagfile = args[1]
        self.tagaddress = args[2]
        self.linenum = int(self.tagaddress.split(';')[0])
        self.parse_tagfields(*args[3:])

    def parse_tagfields(self, *args):
        for arg in args:
            if not arg:
                continue
            if arg == 'm':
                self.kind = 'method'
            elif arg == 'c':
                self.kind = 'class'
            elif arg.startswith('class:'):
                self.member_of = arg
                kind, name = arg.split(':')
                self.member_of_kind = kind
                self.member_of_name = name

    def __str__(self):
        return '(%s)(%s)(%s)' % (self.tagname, self.tagfile, self.tagaddress)

    def __repr__(self):
        return str(self)


class SnippetEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Snippet):
            return obj.to_json()
        return json.JSONEncoder.default(self, obj)


class Snippet(object):
    def __init__(self, localpath, linenum, snippet, exerpt=None):
        self.filepath = '/'.join(localpath.split('/')[3:])
        self.linenum = linenum
        self.snippet = snippet
        self.exerpt = exerpt

    def to_json(self):
        """
        >>> snippet = Snippet('repos/u/p/path', 1, 'snippet')
        >>> snippet.to_json()
        {'snippet': 'snippet', 'linenum': 1, 'filepath': 'path'}
        """
        return {
            'filepath': self.filepath,
            'linenum': self.linenum,
            'snippet': self.snippet,
        }

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

    >>> name = 'repos/danielcodes/Algorithms/Seven/Graph.java'
    >>> tag = Tag(name, name, '4;"')
    >>> get_snippet(tag)
    (Seven/Graph.java)(4)(public class Graph)
    """
    path = tag.tagfile
    linenum = tag.linenum
    with open(path, 'r') as f:
        for i in range(linenum):
            line = f.readline().strip()
    exerpt = []
    return Snippet(path, linenum, line, exerpt)


def main(tagname, tagsfile):
    """
    # >>> snippets = main('$.fn.flexAddData', 'Flexigrid')
    # >>> snippets[0].filepath
    # 'Flexigrid/js/flexigrid.js'
    # >>> snippets[0].linenum
    # 1516
    # >>> snippets[0].snippet
    # '$.fn.flexAddData = function (data) { // function to add data to grid'
    """
    tags = make_tags(open(tagsfile))
    candidates = lookup_tagname(tagname, tags)
    snippets = map(get_snippet, candidates)
    return json.dumps(snippets, cls=SnippetEncoder)


def gen_ctags(repo_path):
    tags_path = os.path.join(repo_path, 'tags')
    if os.path.exists(tags_path):
        return tags_path
    else:
        with open('error.log', 'a') as f:
            subprocess.check_output(
                ['ctags', '-f', tags_path, '-R', '--excmd=number', repo_path],
                stderr=f)
        return tags_path


if __name__ == '__main__':
    # import doctest
    # doctest.testmod()
    if len(sys.argv) == 3:
        tagname = sys.argv[1]
        repo_path = sys.argv[2]
        tags_path = gen_ctags(repo_path)
        snippets = main(tagname, tags_path)
        print snippets
