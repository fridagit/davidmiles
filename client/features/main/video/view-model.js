var viewModel = {
    init: function () {
        this.videos = ['5nMKfLtT9YU','WDnrjwN5X5I','ABF7PrYchNQ','AXf7meAEQnU'];
        this.videos = this.videos.map(function(video) {
            return 'http://www.youtube.com/embed/' + video + '?origin=http://davidmiles.se';
        });
    }
};

module.exports.create = function () {
    var vm = Object.create(viewModel);
    vm.init();
    return vm;
};
