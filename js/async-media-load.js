(function($)
{
	$.fn.asyncml = function(options)
	{
		/*var defaults = {src: 'youtube'};
		var opts = $.extend(defaults, options);*/

		var youtube_regex = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/;
		var vimeo_regex = /^.*vimeo\.com\/(\d+).*/;

		var getProvider = function(href)
		{
			var vimeo = href.indexOf('vimeo.com');
			if (vimeo >= 0){
				return 'vimeo'
			}else{
				return 'youtube';
			}
		}

		var getVideoId = function(href, provider)
		{
			if (provider == 'vimeo'){
				var match = href.match(vimeo_regex);
				if (match){
					return match[1];
				}else{
					//error
				}
			}else{
				var match = href.match(youtube_regex);
				if (match && match[2].length==11){
					return match[2];
				}else{
					//error
				}
			}
		}

		var insertImg = function($a, img_src, width, height)
		{
			var image = document.createElement('img');
			image.onload = function(){
				var img_height = this.height*width/this.width;
				var img_top = (height - img_height)/2;
				var $img = $(this);
				$img.width(width).height(img_height).css({position: 'absolute', top: img_top+'px', left: '0'});
				$a.css({position: 'relative'});
				$a.parent().css({overflow: 'hidden'});
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

			if (e.data.provider == 'vimeo'){
				var embed_url = 'http://player.vimeo.com/video/'+e.data.id+'?autoplay=1';
			}else{
				var embed_url = 'http://www.youtube.com/embed/'+e.data.id+'?rel=0&amp;autoplay=1';
			}
			var $embed = $('<iframe width="'+e.data.width+'" height="'+e.data.height+'" src="'+embed_url+'" frameborder="0" allowfullscreen></iframe>');
			$(this).replaceWith($embed);
		}

		return this.each(function()
		{
			var href = $(this).attr('href');
			var provider = getProvider(href);

			var video_id = getVideoId(href, provider);

			var width = $(this).parent().width();		
			var height = $(this).parent().height();

			if (provider == 'vimeo'){
				getVideoDetails($(this), video_id, width, height);
			}else{
				var img_src = 'http://img.youtube.com/vi/'+video_id+'/hqdefault.jpg';
				insertImg($(this), img_src, width, height);
			}

			$(this).on('click', {width: width, height: height, id: video_id, provider: provider}, playVid);
		});
	}
})(jQuery);