var request = require('data-request');

module.exports = {
    init: function () {
        var self = this;
        self.albums = ko.observableArray();
        request.getJson('spotify_albums', function (albums) {
            albums.forEach(function (album) {
                album.spotifyUrl = 'http://open.spotify.com/album/' + album.spotifyId;
                album.iTunesUrl = 'https://itunes.apple.com/us/album/' + album.iTunesId;
                album.shopUrl = album.shopId ? 'http://davidmiles.tictail.com/product/' + album.shopId : false;
                album.title = ko.observable();
                album.date = ko.observable();
                album.trackCount = ko.observable();
                album.image = ko.observable();
                album.width = '250px';
                album.height = '250px';
                request.get('https://api.spotify.com/v1/albums/' + album.spotifyId, function (result) {
                    if (!result.body.error) {
                        var images = result.body.images;
                        album.title(result.body.name);
                        album.date(result.body['release_date'].replace(/-.*/, ''));
                        album.trackCount(result.body.tracks.items.length);
                        images.forEach(function (image) {
                            if (image.height === 300) {
                                album.image('url(' + image.url + ')');
                            }
                        });
                    } else {
                        self.albums.remove(album);
                    }
                });
                self.albums.push(album);
            });
        });
    }
};