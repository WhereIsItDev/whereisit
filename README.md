# whereisit
Sometimes finding references on GitHub is frustrating. Not anymore. whereisit is an extension that helps you to easily find the references on repositories in an online fashion. Just select the function or declaration and whereisit is going to help finding the right stuff. Piece of cake.

whereisit is a hack developed during the Angelhack Brooklyn 2015, by @celsopalmeiraneto, @danielcodes, @filfrey, @Anomalous1, @ngzhian

## How to get it
This has been released as a [chrome extension](https://chrome.google.com/webstore/detail/where-is-it/cdgnplmebagbialenimejpokfcodlkdm). Things may be slow at times or really buggy, especially if you are using the extension on a repo for the first time.

If it takes too long, please try the extension on these repositories:

1. [django/django](https://github.com/django/django/)
2. [danielcodes/Algorithms](https://github.com/danielcodes/Algorithms/)
3. [cocos2d/cocos2d-x](https://github.com/cocos2d/cocos2d-x/)
4. [jquery/jquery](https://github.com/jquery/jquery)
5. [jekyll/jekyll](https://github.com/jekyll/jekyll)

## Running this locally
You'll need `nodejs`, `python`, [`ctags`](http://ctags.sourceforge.net/) installed.

1. `cd` into gitCloner, and run `npm install`, this should get the backend node server running
2. install `ctags` on your machine, usually it's `sudo apt-get install exuberant-ctags`
3. inside the main `whereisit` folder, start the server using `./scripts/runserver`
4. install the chrome extension (you need to be in developer mode for chrome)
5. navigate to your favourite repository on GitHub and try it out!

[![Join the chat at https://gitter.im/ngzhian/whereisit](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/ngzhian/whereisit?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
where is it?
