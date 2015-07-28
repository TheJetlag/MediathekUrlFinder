// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.tabs.getSelected(null, function(tab) {
        var url = tab.url; // like http://www.ardmediathek.de/tv/Rote-Rosen/Folge-2006-Auf-Jobsuche/Das-Erste/Video?documentId=29765096&bcastId=317766
        var documentId = getUrlParameter("documentId", url);
        var reqUrl = "http://www.ardmediathek.de/play/media/";
        
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                var result = JSON.parse(xhr.responseText);
                var mediaArray = result._mediaArray;
                var bestStream = searchForBestQuality(mediaArray);
                alert(JSON.stringify(bestStream));
                document.getElementById('urlPlaceholder').textContent = JSOON.stringify(bestStream);
            }
        };
        
        xhr.open("GET", reqUrl + documentId, true);
        xhr.send();
    });
});

function searchForBestQuality(mediaArray) {
    var bestStream = null;
    var bestStreamQuality = -1;
    for (var i = 0; i < mediaArray.length; i++) {
        var streams = mediaArray[i]._mediaStreamArray;
        for (var j = 0; j < streams.length; j++) {
            var stream = streams[j];
            if (stream._quality > bestStreamQuality) {
                bestStream = stream;
                bestStreamQuality = stream._quality;
            }
        }
    }
    return bestStream;
}

function getUrlParameter( name, url ) {
    if (!url) url = location.href;
    name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
    var regexS = "[\\?&]"+name+"=([^&#]*)";
    var regex = new RegExp( regexS );
    var results = regex.exec( url );
    return results === null ? null : results[1];
}