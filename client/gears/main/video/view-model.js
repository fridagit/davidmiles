var request = require('utils/request');

module.exports = {
    init: function () {
        var ids = ['34ZkmRl8l0k', 'WDnrjwN5X5I', 'ABF7PrYchNQ', 'AXf7meAEQnU'];
        this.videos = ids.map(function (id) {
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
    }
};
