(function($)
{
	$.fn.asyncml = function(options)
	{
		var defaults = {src: 'youtube'};
		var opts = $.extend(defaults, options);

		var youtube_regex = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/;

		var getYoutubeId = function(href)
		{
			var match = href.match(youtube_regex);
			if (match&&match[2].length==11){
				return match[2];
			}else{
				//error
			}
		}

		var insertImg = function($a, id, width, height)
		{
			var img_src = 'http://img.youtube.com/vi/'+id+'/default.jpg';

			var $img = $('<img src="'+img_src+'"/>');
			$img.width(width).height(height).css({position: 'absolute', top: '0', left: '0'});
			$a.css({position: 'relative'});
			$a.append($img);
		}

		var playYoutube = function(e)
		{
			e.preventDefault();

			var $embed = $('<iframe width="'+e.data.width+'" height="'+e.data.height+'" src="http://www.youtube.com/embed/'+e.data.id+'?rel=0&amp;autoplay=1" frameborder="0" allowfullscreen></iframe>');
			$(this).replaceWith($embed);
		}

		return this.each(function()
		{
			var href = $(this).attr('href');
			var video_id = getYoutubeId(href);

			var width = $(this).parent().width();		
			var height = $(this).parent().height();

			insertImg($(this), video_id, width, height);

			$(this).on('click', {width: width, height: height, id: video_id}, playYoutube);
		});
	}
})(jQuery);