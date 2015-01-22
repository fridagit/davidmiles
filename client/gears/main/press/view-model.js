module.exports = {
    init: function () {
        var images = [];
        for (var i = 1; i <= 22; i++) {
            var fullUrl = 'img/press/david_press_' + i + '.jpg';
            images.push(
                {
                    thumb: 'img/press/david_press_' + i + '_thumbnail.jpg',
                    url: fullUrl,
                    downloadLink: '<a href="' + fullUrl + '" target="_blank">Klicka här för att ladda ner</a>'
                }
            );
        }
        this.images = images;
    }
};