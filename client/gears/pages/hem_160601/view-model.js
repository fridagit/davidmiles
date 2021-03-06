var request = require('utils/request');

module.exports = {
    init: function () {
        var self = this;
        this.videos = ko.observableArray();
        var id = 'u05Hcpy6ixs';
        var video = {
            id: id,
            iFrameUrl: 'https://www.youtube.com/embed/' + id + '?autoplay=1&autohide=1&origin=http://davidmiles.se',
            image: 'url(https://i.ytimg.com/vi/' + id + '/mqdefault.jpg)',
            title: '',
            width: '320px',
            height: '180px',
            fill: true
        };
        self.videos([video]);

    },
    click: function() {
        window.location.href='https://open.spotify.com/track/3u4Z8W600ugcCeHijyykBE';
    }
};
