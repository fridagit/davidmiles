var request = require('utils/request');
var dataRequest = require('data-request');


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
                request('GET', 'http://gdata.youtube.com/feeds/api/videos/' + video.id + '?alt=json').end(function (result) {
                    video.title(result.body.entry.title.$t);
                });
                return video;
            });
            self.videos(videos);
        });
    }
};
