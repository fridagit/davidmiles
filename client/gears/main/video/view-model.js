var request = require('utils/request');
var dataRequest = require('data-request');
var apiKey = 'AIzaSyBKplqq_V9dmIO1y8oD73kaj5rwnRSS_d4';


module.exports = {
    init: function () {
        var self = this;
        this.videos = ko.observableArray();
        dataRequest.getJson('video-artist', function (ids) {
            var videos = ids.map(function (id) {
                var video = {
                    id: id,
                    iFrameUrl: 'https://www.youtube.com/embed/' + id + '?autoplay=1&autohide=1&origin=http://davidmiles.se',
                    image: 'url(http://i.ytimg.com/vi/' + id + '/mqdefault.jpg)',
                    title: ko.observable(),
                    width: '320px',
                    height: '180px',
                    fill: true
                };
                request('GET', 'https://www.googleapis.com/youtube/v3/videos?key=' + apiKey +
                    '&fields=items(snippet(title))&part=snippet&id=' + video.id).end(function (result) {
                    video.title(result.body.items[0].snippet.title);
                });
                return video;
            });
            self.videos(videos);
        });
    }
};
