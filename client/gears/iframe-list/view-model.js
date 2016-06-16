var viewModel = {
    init: function (params) {
        this.playIconClass = 'play ' + params.playIconClass;
        this.items = params.items;
        this.click = showIFrame;
        this.iframeListClass = params.iframeListClass || 'lazyIFrames';
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
    if (item.fill) {
        iframe.style.width = element.parentElement.style.width;
        iframe.style.height = element.parentElement.style.height;
    } else {
        iframe.style.display = 'block';
    }
    element.replaceChild(iframe, element.querySelector('.replaceMe'));
    element.className = 'play';
}

module.exports.create = function (params) {
    var vm = Object.create(viewModel);
    vm.init(params);
    return vm;
};
