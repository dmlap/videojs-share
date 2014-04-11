(function(window,videojs,document,undefined) {
  videojs.share = {
    swf: 'src/swf/clipboard.swf',
    defaults: {
      title: 'Unknown Title',
      embedCode: 'Embed Script Here',
      directLink: 'http://to/nowhere.html',
      startTime: '00:00',
      networks: []
    }
  };

  var init;

  init = function(options) {
    var shareOptions, player;

    shareOptions = videojs.util.mergeOptions(videojs.share.defaults, options);

    player = this;
    player.share = shareOptions;

    // Add Share Overlay
    player.children.shareOverlay = new videojs.ShareOverlay(player);
    player.addChild(player.children.shareOverlay);

    // Add Share Button to Control Bar
    player.controlBar.children.shareButton = new videojs.ShareButton(player);
    player.controlBar.addChild(player.controlBar.children.shareButton);

  };

  videojs.plugin('share', function() {
    var initialize = function() {
      return function() {
        this.share = initialize();
        init.apply(this, arguments);
      }
    };
    initialize().apply(this, arguments);
  });
})(window, window.videojs, document);