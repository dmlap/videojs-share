/* Share Control Bar Button
 ================================================================================ */
videojs.ShareButton = videojs.Component.extend({
  init: function(player, options) {

    videojs.Component.call(this, player, options);

    this.createEl('div');
    this.closeButton = new videojs.Component(player);
    this.closeButton.createEl('i');
    this.addClass('vjs-share-control fa fa-share fa-2x white');
    this.addChild(this.closeButton);
    this.on('click', this.onClick);
  }
});

videojs.ShareButton.prototype.onClick = function() {
  player.trigger('showshareoverlay');
};

