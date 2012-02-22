(function($)
{
	$.fn.asyncml = function(options)
	{
		/*var defaults = {src: 'youtube'};
		var opts = $.extend(defaults, options);*/

		var regex = {
			youtube: /^.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/,
			vimeo: /^.*vimeo\.com\/(\d+).*/
		};

		var getProvider = function(href)
		{
			return href.indexOf('vimeo.com') >= 0 ? 'vimeo' : 'youtube';
		}

		var getVideoId = function(href, provider)
		{
			var match = href.match( regex[provider] );
			return (match && match[1]) || null;
		}

		var insertImg = function($a, img_src, width, height)
		{
			var image = document.createElement('img');
			image.onload = function(){
				var img_height = this.height*width/this.width;
				var img_top = (height - img_height)/2;
				var $img = $(this);
				$img.width(width).height(img_height).css({position: 'absolute', top: img_top+'px', left: '0'});
				$a.css({position: 'relative'}).parent().css({overflow: 'hidden'});
				$a.append($img);
			}
			image.src = img_src;
		}

		/*
		 *Only for Vimeo
		 */
		var getVideoDetails = function($a, id, width, height)
		{
			$.ajax({
				url: 'http://vimeo.com/api/v2/video/'+id+'.json',
				dataType: "jsonp",
				success: function(data){
					if (width > 200){
						var img_src = data[0].thumbnail_large;
					}else{
						var img_src = data[0].thumbnail_medium;
					}
					insertImg($a, img_src, width, height);
				}
			});
		}

		var playVid = function(e)
		{
			e.preventDefault();

			var embed_url = '';

			if (e.data.provider == 'vimeo'){
				embed_url = 'http://player.vimeo.com/video/'+e.data.id+'?autoplay=1';
			}else{
				embed_url = 'http://www.youtube.com/embed/'+e.data.id+'?rel=0&amp;autoplay=1';
			}
			var $embed = $('<iframe width="'+e.data.width+'" height="'+e.data.height+'" src="'+embed_url+'" frameborder="0" allowfullscreen></iframe>');
			$(this).replaceWith($embed);
		}

		return this.each(function(){
			var $this = $(this);
			var href = $this.attr('href');
			var provider = getProvider(href);
			var video_id = getVideoId(href, provider);
			var width = $this.parent().width();		
			var height = $this.parent().height();

			if (provider == 'vimeo'){
				getVideoDetails($this, video_id, width, height);
			}else{
				var img_src = 'http://img.youtube.com/vi/'+video_id+'/hqdefault.jpg';
				insertImg($this, img_src, width, height);
			}

			$(this).on('click', {width: width, height: height, id: video_id, provider: provider}, playVid);
		});
	}
})(jQuery);