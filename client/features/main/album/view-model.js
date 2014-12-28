var request = require('utils/request');

var viewModel = {
    init: function () {
        var ids = ['5nrPJLz8D9BAwBkUYyISWi', '5RyzFjnNSYWYHdP5Nn9SDp', '5jo9tWCGshEon2Dt7a9EO7'];
        this.albums = ids.map(function (id) {
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
                images.forEach(function(image) {
                    if (image.height === 300) {
                        album.image('url(' + image.url + ')');
                    }
                });
            });
            return album;
        });
    }
};

module.exports.create = function () {
    var vm = Object.create(viewModel);
    vm.init();
    return vm;
};
