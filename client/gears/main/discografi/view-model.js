var request = require('utils/request');

module.exports = {
    init: function () {
        var self = this;
        self.albums = ko.observableArray();
        var ids = request.get('/json/spotify_albums.json', function (res) {
            if (res.status === 200) {
                var ids = res.body;
                ids.forEach(function (id) {
                    var album = {
                        id: id,
                        iFrameUrl: 'https://embed.spotify.com/?uri=spotify:album:' + id + '&view=coverart&theme=white',
                        title: '',
                        image: ko.observable(),
                        width: '300px',
                        height: '300px'
                    };
                    request('GET', 'https://api.spotify.com/v1/albums/' + album.id).end(function (result) {
                        var images = result.body.images;
                        images.forEach(function (image) {
                            if (image.height === 300) {
                                album.image('url(' + image.url + ')');
                            }
                        });
                    });
                    self.albums.push(album);
                });
            }
        });
    }
};