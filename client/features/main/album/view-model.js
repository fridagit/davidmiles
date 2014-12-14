var viewModel = {
    init: function () {
        var albums = ['5nrPJLz8D9BAwBkUYyISWi', '5RyzFjnNSYWYHdP5Nn9SDp', '5jo9tWCGshEon2Dt7a9EO7'];
        this.albums = albums.map(function (album) {
            return 'https://embed.spotify.com/?uri=spotify:album:' + album + '&view=coverart&theme=white';
        });
    }
};

module.exports.create = function () {
    var vm = Object.create(viewModel);
    vm.init();
    return vm;
};
