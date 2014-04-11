/* Share Overlay
 ================================================================================ */
videojs.ShareOverlay = videojs.Component.extend({
  init: function(player, options) {

    videojs.Component.call(this, player, options);

    this.createEl();
    this.hide();

    this.setDetails(player.share);

    player.on('showshareoverlay', this.onShowShareOverlay);
    player.on('hideshareoverlay', this.onHideShareOverlay);

  }
});

var createShareOverlayContainer = function() {
  return "<div class=\"vjs-share-options-container\">" +
      "<div class=\"vjs-share-options-container-asset-title\">Share Video:<\/div>" +
      "<div class=\"vjs-share-options-container-social-container\">" +
      "<div class=\"vjs-share-options-container-section-title\">Share via:<\/div>" +
      "<div class=\"vjs-share-options-container-social-icon-container\">" +
      "<span class=\"fa-stack fa-lg\">" +
      "<i class=\"fa fa-square fa-2x vjs-share-options-container-social-icon-fb\"><\/i>" +
      "<i class=\"fa fa-facebook fa-stack-1x vjs-share-options-container-social-icon\"><\/i>" +
      "<\/span>" +
      "<span class=\"fa-stack fa-lg\">" +
      "<i class=\"fa fa-square fa-2x vjs-share-options-container-social-icon-gp\"><\/i>" +
      "<i class=\"fa fa-google-plus fa-stack-1x vjs-share-options-container-social-icon\"><\/i>" +
      "<\/span>" +
      "<span class=\"fa-stack fa-lg\">" +
      "<i class=\"fa fa-square fa-2x vjs-share-options-container-social-icon-tw\"><\/i>" +
      "<i class=\"fa fa-twitter fa-stack-1x vjs-share-options-container-social-icon\"><\/i>" +
      "<\/span>" +
      "<span class=\"fa-stack fa-lg\">" +
      "<i class=\"fa fa-square fa-2x vjs-share-options-container-social-icon-tu\"><\/i>" +
      "<i class=\"fa fa-tumblr fa-stack-1x vjs-share-options-container-social-icon\"><\/i>" +
      "<\/span>" +
      "<span class=\"fa-stack fa-lg\">" +
      "<i class=\"fa fa-square fa-2x vjs-share-options-container-social-icon-pt\"><\/i>" +
      "<i class=\"fa fa-pinterest fa-stack-1x vjs-share-options-container-social-icon\"><\/i>" +
      "<\/span>" +
      "<span class=\"fa-stack fa-lg\">" +
      "<i class=\"fa fa-square fa-2x vjs-share-options-container-social-icon-in\"><\/i>" +
      "<i class=\"fa fa-linkedin fa-stack-1x vjs-share-options-container-social-icon\"><\/i>" +
      "<\/span>" +
      "<\/div>" +
      "<br style=\"clear: both\">" +
      "<div class=\"vjs-share-options-input-row\">" +
      "<div class=\"vjs-share-options-direct-link-container\">" +
      "<div class=\"vjs-share-options-container-section-title\">Direct Link:<\/div>" +
      "<div class=\"vjs-share-options-direct-link-input\">Direct Link<\/div>" +
      "<div class=\"vjs-share-clipboard-container-direct-link\"></div>" +
      "<\/div>" +
      "<div class=\"vjs-share-options-start-time-container\">" +
      "<div class=\"vjs-share-options-container-section-title\">Start Time:<\/div>" +
      "<div class=\"vjs-share-options-start-time-input\">00:00<\/div>" +
      "<\/div>" +
      "<div class=\"vjs-share-options-input-row\">" +
      "<div class=\"vjs-share-options-embed-container\">" +
      "<div class=\"vjs-share-options-container-section-title\">Embed Code:<\/div>" +
      "<div class=\"vjs-share-options-embed-input\">Embed Code Here<\/div>" +
      "<div class=\"vjs-share-clipboard-container-embed-code\"></div>" +
      "<\/div><\/div><\/div><\/div><\/div>";
};

var createClipboardSWF = function (url, className, elementId, playerId) {
  var div = document.createElement('div'),
      params =
          '<param name="flashvars" value="playerId=' + playerId + '">' +
          '<param name="wmode" value="transparent">' +
          '<param name="AllowScriptAccess" value="always">',
      id = elementId,
      object;

  // create a cross-browser friendly SWF embed
  div.innerHTML =
      '<!--[if !IE]>-->' +
      '<object width="100%" height="100%" type="application/x-shockwave-flash">' +
      '<param name="movie" value="'+ url +'">' + params +
      '</object>' +
      '<!--<![endif]-->';

  object = div.querySelector('object');

  // build an embed for IE<10
  if (!object) {
    div.innerHTML =
        '<object width="100%" height="100%" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000">' +
        '<param name="movie" value="'+ url +'">' + params +
        '</object>';
  }

  object.id = id;
  object.name = id;
  object.className = className;

  return object.outerHTML;
};

var createLinkIcon = function (object) {
  return "<a target=\"_blank\" href=\""+ object.url.toLowerCase() +"\">" +
  "<span class=\"fa-stack fa-lg\">" +
  "<i class=\"fa fa-square fa-2x "+ object.backgroundClass + "\"><\/i>" +
  "<i class=\"fa fa-"+object.name.toLowerCase()+" fa-stack-1x vjs-share-options-container-social-icon\"><\/i>" +
  "<\/span></a>";
};

videojs.ShareOverlay.prototype.createEl = function() {

  this.el().innerHTML = createShareOverlayContainer();
  this.addClass('vjs-share-overlay');

  this.closeButton = new videojs.Component(player);
  this.closeButton.createEl();
  this.closeButton.addClass('fa fa-times fa-2x vjs-share-options-container-close-icon white');
  this.closeButton.on('click', this.onCloseButtonClick);
  this.addChild(this.closeButton);

  this.overlayContainer = this.el().children[0];
  this.titleElement = this.overlayContainer.querySelector('.vjs-share-options-container-asset-title');
  this.timeElement = this.overlayContainer.querySelector('.vjs-share-options-start-time-input');
  this.linkElement = this.overlayContainer.querySelector('.vjs-share-options-direct-link-input');
  this.linkElement.addEventListener('click', this.onDirectLinkClick);
  this.embedCodeElement = this.overlayContainer.querySelector('.vjs-share-options-embed-input');
  this.embedCodeElement.addEventListener('click', this.onEmbedCodeClick);
  this.directLinkSWFContainer = this.overlayContainer.querySelector('.vjs-share-clipboard-container-direct-link');
  this.directLinkSWFContainer.innerHTML = createClipboardSWF(videojs.share.swf, 'vjs-clipboard-swf-direct-link', 'vjs-share-clipboard-api-direct-link', player.el().id);
  this.embedCodeSWFContainer = this.overlayContainer.querySelector('.vjs-share-clipboard-container-embed-code');
  this.embedCodeSWFContainer.innerHTML = createClipboardSWF(videojs.share.swf, 'vjs-clipboard-swf-embed-code', 'vjs-share-clipboard-api-embed-code', player.el().id);
  this.socialIconContainer = this.overlayContainer.querySelector('.vjs-share-options-container-social-icon-container');

  videojs.share.clipboardAPI = {};
  videojs.share.clipboardAPI.directLink = this.directLinkSWFContainer.querySelector('.vjs-clipboard-swf-direct-link');
  videojs.share.clipboardAPI.embedCode = this.embedCodeSWFContainer.querySelector('.vjs-clipboard-swf-embed-code');

  return this.el();
};

videojs.ShareOverlay.prototype.setDetails = function(details) {
  if(!details) {
    details = videojs.share.defaults;
  }
  this.title(details.title);
  this.directLink(details.directLink);
  this.embedCode(details.embedCode);
  this.startTime(player.currentTime());

  this.socialIconContainer.innerHTML = "";

  for (i in details.networks) {
    this.socialIconContainer.innerHTML += createLinkIcon(details.networks[i]);
  }
};

videojs.ShareOverlay.prototype.title = function(title) {
  if(title) {
    this.titleElement.innerHTML = "Share Video: " + title;
  }
  return this.titleElement.innerHTML.substr(13);
};

videojs.ShareOverlay.prototype.directLink = function(url) {
  if(url) {

    this.linkElement.innerHTML = (url.length > 55) ? url.substr(0,55) + '...' : url;

    setTimeout(function() {
      try {
        videojs.share.clipboardAPI.directLink.copy(url);
      } catch (error) {

      }
    }, 500);
  }

  return this.linkElement.innerHTML;
};

videojs.ShareOverlay.prototype.startTime = function(time) {
  if(time) {
    this.timeElement.innerHTML = this.formatTime(time);
  }

  return this.timeElement.innerHTML;
};

videojs.ShareOverlay.prototype.embedCode = function(code) {
  if(code) {
    this.embedCodeElement.innerHTML = (code.length > 85) ? code.substr(0,85) + '...' : code;

    setTimeout(function() {
      try {
        videojs.share.clipboardAPI.embedCode.copy(code);
      } catch (error) {

      }
    }, 500);
  }

  return this.embedCodeElement.innerHTML;
};

/**
 * Event handler for player.on('showshareoverlay')
 */
videojs.ShareOverlay.prototype.onShowShareOverlay = function() {
  this.share.paused = this.paused();
  this.pause();
  this.children.shareOverlay.setDetails(this.share);
  this.children.shareOverlay.show();
};

/**
 * Event handler for player.on('hideshareoverlay');
 */
videojs.ShareOverlay.prototype.onHideShareOverlay = function() {
  this.children.shareOverlay.hide();
  if(!this.share.paused) {
    this.play();
  }
};

/**
 * Event handler for close button click
 */
videojs.ShareOverlay.prototype.onCloseButtonClick = function() {
  player.trigger('hideshareoverlay');
};

/**
 * Format seconds as a time string, H:MM:SS or M:SS
 * Supplying a guide (in seconds) will force a number of leading zeros
 * to cover the length of the guide
 * @param  {Number} seconds Number of seconds to be turned into a string
 * @param  {Number} guide   Number (in seconds) to model the string after
 * @return {String}         Time formatted as H:MM:SS or M:SS
 * @private
 */
videojs.ShareOverlay.prototype.formatTime = function(seconds, guide) {
  // Default to using seconds as guide
  guide = guide || seconds;
  var s = Math.floor(seconds % 60),
      m = Math.floor(seconds / 60 % 60),
      h = Math.floor(seconds / 3600),
      gm = Math.floor(guide / 60 % 60),
      gh = Math.floor(guide / 3600);

  // handle invalid times
  if (isNaN(seconds) || seconds === Infinity) {
    // '-' is false for all relational operators (e.g. <, >=) so this setting
    // will add the minimum number of fields specified by the guide
    h = m = s = '-';
  }

  // Check if we need to show hours
  h = (h > 0 || gh > 0) ? h + ':' : '';

  // If hours are showing, we may need to add a leading zero.
  // Always show at least one digit of minutes.
  m = (((h || gm >= 10) && m < 10) ? '0' + m : m) + ':';

  // Check if leading zero is need for seconds
  s = (s < 10) ? '0' + s : s;

  return h + m + s;
};