exports.parseTextToItems = function (lines) {
    var currentItem;
    var items = [];
    lines.split(/(?:\r\n|\r|\n)/g).forEach(function (line) {
        if (line.trim().indexOf('#') === 0) {
            currentItem = {
                text: '',
                id: line.trim().substr(1).trim()
            };
            items.push(currentItem);
        }
        else {
            if (currentItem !== undefined) {
                currentItem.text = currentItem.text + line + '\n';
            }
        }
    });
    return items;
};