(function($, undefined) {
	$.ajax({
		url: "MusicPlayerServlet",
		dataType: "json",
		success: function(data) {
			var innerHtml = "";
			for (var i in data) {
				innerHtml += "<div class='row'>";
				innerHtml += "<a href='#' onclick='player(\""+ data[i]["url"] +"\");'><strong>" + data[i]["name"] +"." + data[i]["type"] + "</strong></a>";
				innerHtml += "</div>";
			}
			$("#music-item").html(innerHtml);
		}
	});
	
	
})(jQuery);

function player(url) {
	$("#music-player").html("<source src='" + url + "' type='audio/mpeg'></source>" );
}
	