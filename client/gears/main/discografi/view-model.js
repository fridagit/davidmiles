var request = require('data-request');

module.exports = {
    init: function () {
        var self = this;
        self.albums = ko.observableArray();
        request.getJson('spotify_albums', function (ids) {
            ids.forEach(function (id) {
                var album = {
                    id: id,
                    iFrameUrl: 'https://embed.spotify.com/?uri=spotify:album:' + id + '&view=coverart&theme=white',
                    title: '',
                    image: ko.observable(),
                    width: '300px',
                    height: '300px'
                };
                request.get('https://api.spotify.com/v1/albums/' + album.id, function (result) {
                    var images = result.body.images;
                    images.forEach(function (image) {
                        if (image.height === 300) {
                            album.image('url(' + image.url + ')');
                        }
                    });
                });
                self.albums.push(album);
            });
        });
    }
};