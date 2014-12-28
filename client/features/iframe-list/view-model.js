var viewModel = {
    init: function (params) {
        this.playIconClass = 'play ' + params.playIconClass;
        this.items = params.items.map(function(item){
            item.click = showIFrame;
            return item;
        });
    }
};

function showIFrame(item, event) {
    var element = event.currentTarget;
    var iframe = document.createElement('iframe');
    var iframeUrl = item.iFrameUrl;
    if (element.getAttribute('data-params')) {
        iframeUrl += '&' + element.getAttribute('data-params');
    }
    iframe.setAttribute('src', iframeUrl);
    iframe.setAttribute('frameborder', '0');
    iframe.style.width = element.style.width;
    iframe.style.height = element.style.height;
    element.parentNode.replaceChild(iframe, element);
}

module.exports.create = function (params) {
    var vm = Object.create(viewModel);
    vm.init(params);
    return vm;
};
