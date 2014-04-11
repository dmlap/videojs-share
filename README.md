[![Build Status](https://travis-ci.org/videojs/videojs-contrib-hls.png)](https://travis-ci.org/videojs/videojs-contrib-hls)

# VideoJS Share Screen Plugin

A video.js plugin that allows a configurable share screen during playback.

## Getting Started
On your web page:

```html
<script src="video.js"></script>
<script	src="src/js/videojs-share.js"></script>
<script src="src/js/ui/share-overlay.js"></script>
<script src="src/js/ui/share-control-bar-button.js"></script>
<script>
  var player = videojs('video');
  // See Plugin code for model schema
  var optionalShareObject = {};
  player.share(optionalShareObject);
  player.play();
</script>
```

### Documentation
This is a demo repo for Brightcove consideration. Please see the example.html. If
using the Connect server grunt task, it should open at the following url:

http://localhost:9999/example.html

Some notes are as follows;

1. This plugin requires a compiled SWF for the clipboard functionality. This
works across desktop but mobile will still need some workaround. Clipboard API
in browsers not universally supported yet.

2. To test the clipboard API, click on either the direct link or embed code then
paste elsewhere.

3. The plugin has the following grunt commands;

#### Build SWF
```bash
grunt mxmlc
```

#### Start Development Server
```bash
grunt connect
```

#### Build Distribution package
```bash
grunt dist
```

### Events
#### showshareoverlay

Fired from player to show the share overlay screen.

#### hideshareoverlay

Fired from player to hide the share overlay screen.

