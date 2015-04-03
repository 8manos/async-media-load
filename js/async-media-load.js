(function($) {
  $.fn.asyncml = function(options) {
    var defaults = {responsive: true};
    var opts = $.extend(defaults, options);

    var regex = {
      youtube: /^.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/,
      vimeo: /^.*vimeo\.com\/(\d+).*/
    };

    var getProvider = function getProvider(href) {
      return href.indexOf('vimeo.com') >= 0 ? 'vimeo' : 'youtube';
    }

    var getVideoId = function getVideoId(href, provider) {
      var match = href.match( regex[provider] );
      return (match && match[1]) || null;
    }

    var setStyles = function setStyles($a, $img, width, height) {
      var img_height = $img.height() * width / $img.width();
      var img_top = (height - img_height) / 2;

      $img.width(width).height(img_height).css({
        position: 'absolute',
        top: img_top + 'px',
        left: '0'
      });
      $a.css({ position: 'relative' });
      $a.parent().css({ overflow: 'hidden' });
    }

    var setResponsiveStyles = function setStyles($a, $img, imgSize) {
      var imgMargin = imgSize === 'large' ? '0':'-9% 0';

      $img.css({
        left: 0,
        margin: imgMargin,
        position: 'absolute',
        top: 0,
        width: '100%'
      });

      $a.css({
        display: 'block',
        position: 'relative'
      });
      $a.parent().css({
        height: 0,
        'max-width': '100%',
        'padding-bottom': '56.25%',
        overflow: 'hidden',
        position: 'relative'
      });
    }

    var insertImg = function insertImg($a, img_src, width, height, provider) {
      var image = document.createElement('img');

      image.onload = function loadImg() {

        var $img = $(this);

        if (opts.responsive) {
          var imgSize = provider === 'vimeo_l' ? 'large':'small';
          setResponsiveStyles($a, $img, imgSize);
        } else {
          setStyles($a, $img, width, height);
        }

        $a.append($img);
      }
      image.src = img_src;
    }

    //Only for Vimeo
    var getVideoDetails = function getVideoDetails($a, id, width, height) {
      $.ajax({
        url: 'http://vimeo.com/api/v2/video/' + id + '.json',
        dataType: 'jsonp',
        success: function(data){
          if (width > 200) {
            var img_src = data[0].thumbnail_large;
            var prov_s = 'vimeo_l';
          } else {
            var img_src = data[0].thumbnail_medium;
            var prov_s = 'vimeo_m';
          }

          insertImg($a, img_src, width, height, prov_s);
        }
      });
    }

    var playVid = function playVid(e) {
      e.preventDefault();

      var embed_url = '';

      if (e.data.provider === 'vimeo') {
        embed_url = 'http://player.vimeo.com/video/' + e.data.id + '?autoplay=1';
      } else {
        embed_url = 'http://www.youtube.com/embed/' + e.data.id + '?rel=0&amp;autoplay=1&amp;wmode=opaque';
      }

      if (opts.responsive) {
        var style = 'height:100%;left:0;position:absolute;top:0;width:100%;';
        var $embed = $('<iframe style="' + style + '" src="' + embed_url + '" frameborder="0" allowfullscreen></iframe>');
      } else {
        var $embed = $('<iframe width="' + e.data.width + '" height="' + e.data.height + '" src="' + embed_url + '" frameborder="0" allowfullscreen></iframe>');
      }

      $(this).replaceWith($embed);
    }

    return this.each(function() {
      var $this = $(this);
      var href = $this.attr('href');
      var provider = getProvider(href);
      var video_id = getVideoId(href, provider);
      var width = $this.parent().width();
      var height = $this.parent().height();

      //Get thumbnail only if there isn't one already
      if ($this.children('img').length === 0) {
        if (provider === 'vimeo') {
          getVideoDetails($this, video_id, width, height);
        } else {
          var img_src = 'http://img.youtube.com/vi/' + video_id + '/hqdefault.jpg';
          insertImg($this, img_src, width, height, 'youtube');
        }
      } else {
        if (opts.responsive) {
          var imgSize = width > 200 ? 'large':'small';
          var $img = $this.children('img');
          setResponsiveStyles($this, $img, imgSize);
        }
      }

      $(this).on('click', {width: width, height: height, id: video_id, provider: provider}, playVid);
    });
  }
})(jQuery);
