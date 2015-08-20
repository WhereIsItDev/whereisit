# -*- coding: utf-8 -*-
# AngelHack Brooklyn 2015
import os
import json
import re
import subprocess
import sys

from textwrap import dedent

import click


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
            raise Exception('bad args: %s' % list(args))
        self.tagname = args[0]
        self.tagfile = args[1]
        self.tagaddress = args[2]
        self.filepath = '/'.join(self.tagfile.split('/')[3:])
        self.linenum = int(self.tagaddress.split(';')[0])
        self.kind = None
        self.member_of = None
        self.member_of_kind = None
        self.member_of_name = None
        self.parse_tagfields(*args[3:])

    def parse_tagfields(self, *args):
        for arg in args:
            if not arg:
                continue
            arg = arg.strip()
            if arg == 'm':
                self.kind = 'method'
            elif arg == 'c':
                self.kind = 'class'
            elif arg.startswith('class:'):
                self.member_of = arg
                kind, name = arg.split(':', 1)
                self.member_of_kind = kind
                self.member_of_name = name

    def read_snippet(self):
        """A tag has information on the filename,
        and also the line where this tag can be found.

        >>> name = 'repos/danielcodes/Algorithms/Seven/Graph.java'
        >>> tag = Tag(name, name, '4;"')
        """
        path = self.tagfile
        exerpt = []
        with open(path, 'r') as f:
            for i in range(self.linenum):
                line = f.readline()
            exerpt.append(line)
            for i in range(5):
                l = f.readline()
                if l == '':
                    break
                exerpt.append(l)

        # this snippet is only set after tag has been populated
        self.snippet = line[:].strip()
        self.exerpt = ''.join(exerpt)

    def to_json(self):
        """
        >>> name = 'repos/danielcodes/Algorithms/Seven/Graph.java'
        >>> tag = Tag(name, name, '4;"')
        """
        # impt, ensure that file is read
        if not hasattr(self, 'snippet'):
            self.read_snippet()

        obj = {}
        for field in ['tagname', 'filepath', 'linenum', 'kind', 'snippet',
                'member_of', 'member_of_kind', 'member_of_name', 'exerpt']:
            obj[field] = getattr(self, field)
        return obj

    def is_of_filetype(self, filetype):
        if filetype is None:
            return True
        return self.filepath and self.filepath.endswith(filetype)

    def __str__(self):
        return '(%s)(%s)(%s)' % (self.tagname, self.tagfile, self.tagaddress)

    def __repr__(self):
        return str(self)


class TagEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Tag):
            return obj.to_json()
        return json.JSONEncoder.default(self, obj)


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


def lookup_tagname(tagname, tags, filetype=None):
    """Looks up a tag within a list of Tags via the tagname

    >>> tags = make_tags(SAMPLE_CTAGS_OUTPUT)
    >>> results = list(lookup_tagname('$.addFlex', tags))
    >>> results[0]
    ($.addFlex)(Flexigrid/js/flexigrid.js)(69;")
    >>> results[1]
    ($.addFlex)(Flexigrid/js/flexigrid.js)(75;")
    >>> results = list(lookup_tagname('$.addFlex', tags, 'java'))
    >>> results
    []
    """
    for tag in tags:
        if tag.tagname == tagname and tag.is_of_filetype(filetype):
            yield tag


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


@click.command()
@click.option('--tag_name', default=None, help='Tag name to lookup')
@click.option('--code_file', default=None, help='Tag names of this file')
@click.option('--repo_path', default=None, help='Path to repo')
def main(tag_name, code_file, repo_path):
    if not repo_path:
        return

    tags_path = gen_ctags(repo_path)
    tags = make_tags(open(tags_path))

    # looking for a single tag name
    if tag_name:
        candidates = list(lookup_tagname(tag_name, tags))
        print json.dumps(candidates, cls=TagEncoder)

    # looking for a all tags in a particular file
    if code_file:
        names = get_names_from_file(code_file)
        tags_dict = {tag.tagname: tag for tag in tags}
        tags_in_file = []
        for name in names:
            tag = tags_dict.get(name['name'], None)
            if tag and tag_and_file_same_extension(tag, code_file):
                tags_in_file.append(tag)
        print json.dumps(tags_in_file, cls=TagEncoder)


def tag_and_file_same_extension(tag, code_file):
    return extension(code_file) == extension(tag.filepath)

def extension(name):
    splits = name.rsplit('.')
    if len(splits) >= 2:
        return splits[-1]
    return name

def get_names_from_file(code_file):
    results = []
    with open(code_file) as f:
        for i, line in enumerate(f):
            parts = filter(bool, re.split(r'[\W\(\,)\.,]+', line))
            for name in parts:
                index = line.index(name)
                results.append({
                    'name': name,
                    'line': line,
                    'start': index,
                    'end': index - 1 + len(name)
                })
    return results


if __name__ == '__main__':
    # import doctest
    # doctest.testmod()
    main()
