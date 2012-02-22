async media load
=============

This is a simple jQuery plugin that allows you to load media elements (Youtube, Vimeo) only when user requests them.

Why do we need this?
-------

Developing responsive websites is getting more common every day, one issue we frequently find ourselves dealing with is the display of several media elements in a single page. 

Adding a huge list of flash audio or video embeds is never a good idea performance wise because you end up it a huge ammount of flash instances running even ehen the user has not requested to load any video. This makes the browser or the whole device to start responding slower and in some scenarios it can get really slow for something as simple as scrolling down the document.

As a solution we came up with this plugin, your markup can be as simple as a list of links that will be replaced by rich media content only upon user request.

How does async media load works?
-------

This plugin will act on plain links pointing to rich media content and it will do two step replacement for them.

1. It will find links and replace them with a lightweight placeholder.
2. Upon click on the media placeholder, the plugin will replace it with a full media embed.

How can I use it?
-------

For an example on how to use it view the index.html file in the test folder. 