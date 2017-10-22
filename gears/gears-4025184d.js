require.register('data-request/index', function(require, exports, module) {var request = require('utils/request');

exports.getJson = function (jsonName, callback) {
	request.get('/json/' + jsonName + '.json?_=' + new Date().getTime(), function (res) {
		if (res.status === 200) {
			var json = JSON.parse(res.text);
			callback(json);
		}
	});
};

exports.getTxt = function (txtName, callback) {
	request.get('/txt/' + txtName + '.txt?_=' + new Date().getTime(), function (res) {
		if (res.status === 200) {
			callback(res.text);
		}
	});
};

exports.get = request.get;
});
window.cogwheels.addFeature({name: "data-request", version: "0.0.0"});
require.register('dm-utils/index', function(require, exports, module) {exports.parseTextToItems = function (lines) {
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
});
window.cogwheels.addFeature({name: "dm-utils", version: "0.0.0"});
require.register('start/index', function(require, exports, module) {var router = require('router');
var pages = require('pages');
var bus = require('message-bus');
var webStorage = require('web-storage');
var currentPage;

exports.start = function () {
    var firstRender = true;
    router.on('/', function (ctx) {
            pages.render();
            firstRender = false;
        }
    );
    router.on('/:page', function (ctx) {
            var page = ctx.params.page;
            if (page.indexOf('#') === 0) {
                page = page.substr(1);
                if (!firstRender) {
                    bus.publish('main-content', page);
                } else {
                    firstRender = false;
                    pages.render(page);
                }
                webStorage.store('session', 'previousPage', currentPage);
                currentPage = page;
            }
        }
    );
};

exports.controllers = [];
});
window.cogwheels.addFeature({name: "start", version: "0.0.0"});
require.register('editable/index', function(require, exports, module) {var template = require('./template');
var viewModel = require('./view-model');

exports.init = function () {
    ko.components.register('editable', component);
};

var component = {
    viewModel: {
        'createViewModel': viewModel.create
    },
    template: template
};
});
require.register('editable/template', function(require, exports, module) {module.exports = "<div data-bind=\"css: {'editBox': editMode}\"><div data-bind=\"visible: editMode()\" vertical layout><textarea data-bind=\"textInput: textToEdit\"></textarea><div class=\"marginTop\"><button data-bind=\"click: cancel\">ÅNGRA</button> <button data-bind=\"click: save\">SPARA</button></div></div><button data-bind=\"click: edit, visible: !editMode() && isLoggedIn()\">REDIGERA</button></div>";
});
require.register('editable/view-model', function(require, exports, module) {var request = require('utils/request');
var login = require('login');

var viewModel = {
    init: function (params) {
        this.textToEdit = params.textToEdit;
        this.fileName = params.fileName;
        this.isLoggedIn = login.isLoggedIn;
        this.editMode = params.editMode;
    },

    edit: function () {
        if (login.isLoggedIn()) {
            this.editMode(true);
        }
    },

    cancel: function () {
        this.editMode(false);
    },

    save: function () {
        request.post("/admin/save.php?name=" + this.fileName + "&password=" + login.getPassword(), this.textToEdit(), function (res) {
            location.reload();
        });
    }
};


module.exports.create = function (params) {
    var vm = Object.create(viewModel);
    vm.init(params);
    return vm;
};

});
window.cogwheels.addFeature({name: "editable", version: "0.0.0"});
require.register('gallery/index', function(require, exports, module) {var template = require('./template');
var viewModel = require('./view-model');

exports.init = function () {
    ko.components.register('gallery', component);
};

var component = {
    viewModel: {
        'createViewModel': viewModel.create
    },
    template: template
};
});
require.register('gallery/template', function(require, exports, module) {module.exports = "<div class=\"photos\"><div class=\"fotorama\" data-auto=\"false\" data-nav=\"thumbs\" data-bind=\"attr:{'data-width':width, 'data-height':height}\"></div></div>";
});
require.register('gallery/view-model', function(require, exports, module) {var request = require('data-request');

function setSize(obj) {
    var mainContent = $('.mainContent');
    obj.width = mainContent.width();
    obj.height = mainContent.height() - 80;
}
var viewModel = {
    init: function (params) {
        var self = this;
        setSize(this);
        request.getJson(params.jsonName, function (images) {
            setTimeout(function () {
                images.forEach(function (image) {
                    image.caption = image.text;
                    image.img = image.url;
                    image.thumb = image.url;
                    image.full = image.url;
                });
                var fotorama = $('.fotorama').fotorama({
                    data: images,
                    allowfullscreen: true,
                    autoplay: '5000',
                    loop: true,
                    arrows: 'always',
                    shuffle: true
                });
                $(window).resize(function () {
                    var resize = {};
                    setSize(resize);
                    fotorama.resize(resize);
                });
            }, 0);
        });
    }
};


module.exports.create = function (params) {
    var vm = Object.create(viewModel);
    vm.init(params);
    return vm;
};

});
window.cogwheels.addFeature({name: "gallery", version: "0.0.0"});
require.register('iframe-list/index', function(require, exports, module) {var template = require('./template');
var viewModel = require('./view-model');

exports.init = function () {
    ko.components.register('iframe-list', component);
};

var component = {
    viewModel: {
        'createViewModel': viewModel.create
    },
    template: template
};
});
require.register('iframe-list/template', function(require, exports, module) {module.exports = "<div data-bind=\"foreach: items, css: iframeListClass\"><div class=\"card\" data-bind=\"style: {width: width}\"><div class=\"iFrameTitle\" data-bind=\"text: title\"></div><div z=\"2\" style=\"background-size: 100%\" data-bind=\"style: {backgroundImage: image, width: width, height: height}\"><div data-bind=\"click: $parent.click, css: $parent.playIconClass\"><div class=\"replaceMe\"></div></div></div></div></div>";
});
require.register('iframe-list/view-model', function(require, exports, module) {var viewModel = {
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

});
window.cogwheels.addFeature({name: "iframe-list", version: "0.0.0"});
require.register('login/index', function(require, exports, module) {var template = require('./template');
var viewModel = require('./view-model');
var webStorage = require('web-storage');

exports.init = function () {
    ko.components.register('login', component);
};

exports.isLoggedIn = function() {
    return exports.getPassword() !== undefined;
};

exports.getPassword = function() {
    return webStorage.retrieve('session', 'password');
};

exports.logout = function() {
    webStorage.clear('session', 'password');
    location.reload();
};

var component = {
    viewModel: {
        'createViewModel': viewModel.create
    },
    template: template
};
});
require.register('login/template', function(require, exports, module) {module.exports = "<div class=\"login\"><label for=\"password\">Lösenord</label><input id=\"password\" type=\"password\" autofocus data-bind=\"textInput: password, event: {keypress: submit}, css: {'redBackground': unauthorized}\"> <button class=\"marginTop\" data-bind=\"click: login\">LOGGA IN</button></div>";
});
require.register('login/view-model', function(require, exports, module) {var request = require('data-request');
var router = require('router');
var webStorage = require('web-storage');

var viewModel = {
    init: function () {
        this.password = ko.observable();
        this.unauthorized = ko.observable(false);
    },

    login: function () {
        var self = this;
        request.get('/admin/login.php?password=' + this.password(), handleLoginResponse.bind(this));
    },

    submit: function (d, e) {
        e.keyCode === 13 && this.login();
        return true;
    }
};

function handleLoginResponse(res) {
    this.unauthorized(res.unauthorized);
    if (!res.unauthorized) {
        webStorage.store('session', 'password', this.password());
        var prevPage = webStorage.retrieve('session', 'previousPage');
        router.navigate('/#' + prevPage);
        location.reload();
    }
}

module.exports.create = function () {
    var vm = Object.create(viewModel);
    vm.init();
    return vm;
};

});
window.cogwheels.addFeature({name: "login", version: "0.0.0"});
require.register('pages/index', function(require, exports, module) {var layoutEngine = require('layout-engine');
var template = require('./template');
var viewModel = require('./view-model').create();
var request = require('data-request');

var urlPage;

exports.init = function () {
    request.getJson('menu', function (sections) {
        sections.forEach(function (section) {
            if (!section.header) {
                var name = section.id || section.text.toLowerCase();
                if (section.category) {
                    name = section.category + '/' + name;
                }
                var component = {
                    viewModel: {
                        'createViewModel': function () {
                            var viewModel = require('./' + name + '/view-model');
                            var vm = Object.create(viewModel);
                            vm.init();
                            return vm;
                        }
                    },
                    template: require('./' + name + '/template')
                };
                ko.components.register(name, component);
            }
        });
        viewModel.createSections(urlPage);
    });
};

exports.render = function (page) {
    urlPage = page;
    layoutEngine.render(template, viewModel, 'site');
};
});
require.register('pages/template', function(require, exports, module) {module.exports = "<div class=\"main\"><div class=\"navbar navbar-default navbar-fixed-top\" role=\"navigation\"><img id=\"loggedInLogo\" src=\"img/guitar-burning.gif\" data-bind=\"visible: loggedIn\"><div class=\"container\"><div class=\"navbar-header\"><button type=\"button\" class=\"navbar-toggle animated rollIn\" data-toggle=\"offcanvas\" data-target=\".sidebar-nav\"><span class=\"icon-bar\"></span> <span class=\"icon-bar\"></span> <span class=\"icon-bar\"></span></button> <img class=\"drawerPhoto\" src=\"/img/drawer_photo.jpg\"> <img class=\"logo\" src=\"/img/logo.png\"></div></div></div><div class=\"container\"><div class=\"row row-offcanvas row-offcanvas-left\"><div class=\"col-xs-6 col-sm-2 sidebar-offcanvas\" id=\"sidebar\" role=\"navigation\"><ul class=\"nav\" data-bind=\"foreach: sections\"><li class=\"item\" data-bind=\"css: {'item-selected' : selected(), 'animated flash': initPage(), 'menu-header': header}\"><div data-bind=\"click: select, text:text\"></div></li></ul></div><div class=\"col-xs-12 col-sm-10 mainContent\" data-bind=\"if: mainContent()\"><div data-bind=\"component: {name: mainContent}\"></div></div></div></div></div>";
});
require.register('pages/view-model', function(require, exports, module) {var bus = require('message-bus');
var request = require('data-request');
var router = require('router');
var login = require('login');

var viewModel = {
    init: function () {
        var self = this;
        self.mainContent = ko.observable('');
        self.sections = ko.observableArray();
        self.loggedIn = login.isLoggedIn();
        bus.subscribe('main-content', function (item) {
            var section = item.data.toLowerCase();
            self.mainContent(section.replace('-','/'));
        });
    },
    createSections: function (selected) {
        var self = this;
        request.getJson('menu', function (sections) {
            sections.forEach(function (section, index) {
                if (!section.hidden) {
                    section.initPage = ko.observable(false);
                section.header = section.header || false;
                section.id = section.id || section.text.toLowerCase();
                    if (section.category) {
                        section.id = section.category + '-' + section.id;
                    }
                section.selected = ko.computed(function () {
                    return section.id === self.mainContent();
                });
                section.select = function () {
                    if (!section.header) {
                        router.navigate('/#' + section.id);
                        document.querySelector('#sidebar').parentElement.className = 'row row-offcanvas row-offcanvas-left';
                    }
                };
                if (!selected) {
                    if (section.startPage) {
                        section.select();
                        section.initPage(true);
                    }
                }
                self.sections.push(section);
                }
            });
            if (selected)  {
                bus.publish('main-content', selected);
            }
        });
    }
};


module.exports.create = function () {
    var vm = Object.create(viewModel);
    vm.init();
    return vm;
};

});
require.register('pages/hem_160510/template', function(require, exports, module) {module.exports = "<div><p><b>David släpper nytt!</b></p><p>Äntligen kommer det ny musik från David Miles. 13/5 släpps videon till <i>När mitt hjärta stod i brand</i>. 3 dagar senare finns singeln på Spotify, iTunes mm.</p><div center-justified><paper-shadow z=\"1\" class=\"card homeImage\"><img src=\"/img/nar_mitt_hjarta_stod_i_brand-1.jpg\"></paper-shadow></div></div>";
});
require.register('pages/hem_160510/view-model', function(require, exports, module) {var bus = require('message-bus');

module.exports = {
    init: function () {

    }

};
});
require.register('pages/hem_160513/template', function(require, exports, module) {module.exports = "<div><p><b>David släpper nytt!</b></p><p>Nu finns Davids nya singel <i>När mitt hjärta stod i brand</i> ute. Här kan du se videon.</p><iframe-list params=\"items:videos, playIconClass: 'youtube', iframeListClass:'textLeft'\"></iframe-list><p>Den 16/5 släpps låten på Spotify, iTunes mm.</p><p>1/6 kommer andra singeln <i>Sanningen</i> ut.</p></div>";
});
require.register('pages/hem_160513/view-model', function(require, exports, module) {var request = require('utils/request');
var apiKey = 'AIzaSyBKplqq_V9dmIO1y8oD73kaj5rwnRSS_d4';

module.exports = {
    init: function () {
        var self = this;
        this.videos = ko.observableArray();
        var id = 'u05Hcpy6ixs';
        var video = {
            id: id,
            iFrameUrl: 'https://www.youtube.com/embed/' + id + '?autoplay=1&autohide=1&origin=http://davidmiles.se',
            image: 'url(http://i.ytimg.com/vi/' + id + '/mqdefault.jpg)',
            title: ko.observable(),
            width: '320px',
            height: '180px',
            fill: true
        };
        request('GET', 'https://www.googleapis.com/youtube/v3/videos?key=' + apiKey +
            '&fields=items(snippet(title))&part=snippet&id=' + video.id).end(function (result) {
            video.title(result.body.items[0].snippet.title);
        });
        self.videos([video]);

    }
};

});
require.register('pages/hem_160516/template', function(require, exports, module) {module.exports = "<div><p><b>David släpper nytt!</b></p><p>Nu finns Davids nya singel <i>När mitt hjärta stod i brand</i> ute.</p><p>Här kan du se videon:</p><iframe-list params=\"items:videos, playIconClass: 'youtube', iframeListClass:'textLeft'\"></iframe-list><p>Lyssna på låten på Spotify:<div style=\"border:1px solid lightgray;cursor: pointer; background: url('/img/nar_mitt_hjarta_stod_i_brand-small.jpg');width: 100px;height: 100px;position: relative\" data-bind=\"click: click\"><img src=\"/img/spotify-icon.png\" width=\"15\" height=\"15\" style=\"position: absolute; right: 0; bottom: 0\"></div></p><p>Eller på iTunes:</p><a href=\"https://geo.itunes.apple.com/us/album/nar-mitt-hjarta-stod-i-brand/id1110999648?mt=1&app=music\" style=\"display:inline-block;overflow:hidden;background:url(https://linkmaker.itunes.apple.com/images/badges/en-us/badge_music-lrg.svg) no-repeat;width:165px;height:40px\"></a><p>1/6 kommer andra singeln <i>Sanningen</i> ut.</p></div>";
});
require.register('pages/hem_160516/view-model', function(require, exports, module) {var request = require('utils/request');
var apiKey = 'AIzaSyBKplqq_V9dmIO1y8oD73kaj5rwnRSS_d4';

module.exports = {
    init: function () {
        var self = this;
        this.videos = ko.observableArray();
        var id = 'u05Hcpy6ixs';
        var video = {
            id: id,
            iFrameUrl: 'https://www.youtube.com/embed/' + id + '?autoplay=1&autohide=1&origin=http://davidmiles.se',
            image: 'url(http://i.ytimg.com/vi/' + id + '/mqdefault.jpg)',
            title: '',
            width: '320px',
            height: '180px',
            fill: true
        };
        self.videos([video]);

    },
    click: function() {
        window.location.href='https://open.spotify.com/track/3u4Z8W600ugcCeHijyykBE';
    }
};

});
require.register('pages/hem_160601/template', function(require, exports, module) {module.exports = "<div><p><b>David släpper nytt!</b></p><p>Nu finns Davids nya singlar <i>När mitt hjärta stod i brand</i> och <i>Sanningen</i> ute.</p><p>Lyssna på låtarna på Spotify:</p><ul><li><a href=\"https://open.spotify.com/track/3u4Z8W600ugcCeHijyykBE\">När mitt hjärta stod i brand</a></li><li><a href=\"https://open.spotify.com/track/4rpnE60gMwM1bvciBQ4mxr\">Sanningen</a></li></ul><p>Eller på iTunes:</p><ul><li><a href=\"https://itunes.apple.com/se/album/nar-mitt-hjarta-stod-i-brand/id1110999648\">När mitt hjärta stod i brand</a></li><li><a href=\"https://itunes.apple.com/se/album/sanningen-single/id1116592289\">Sanningen</a></li></ul><p>Här kan du se videon för <i>När mitt hjärta stod i brand</i>:</p><iframe-list params=\"items:videos, playIconClass: 'youtube', iframeListClass:'textLeft'\"></iframe-list></div>";
});
require.register('pages/hem_160601/view-model', function(require, exports, module) {var request = require('utils/request');

module.exports = {
    init: function () {
        var self = this;
        this.videos = ko.observableArray();
        var id = 'u05Hcpy6ixs';
        var video = {
            id: id,
            iFrameUrl: 'https://www.youtube.com/embed/' + id + '?autoplay=1&autohide=1&origin=http://davidmiles.se',
            image: 'url(https://i.ytimg.com/vi/' + id + '/mqdefault.jpg)',
            title: '',
            width: '320px',
            height: '180px',
            fill: true
        };
        self.videos([video]);

    },
    click: function() {
        window.location.href='https://open.spotify.com/track/3u4Z8W600ugcCeHijyykBE';
    }
};

});
require.register('pages/hem_171022/template', function(require, exports, module) {module.exports = "<div><p>Välkommen till David Miles hemsida. Här finns det mesta som är kopplat till Davids musik. Under spelplanen kan ni hitta var och när David spelar nästa gång.</p><div center-justified><paper-shadow z=\"1\" class=\"card homeImage\"><img src=\"/img/nar_mitt_hjarta_stod_i_brand-1.jpg\"></paper-shadow></div></div>";
});
require.register('pages/hem_171022/view-model', function(require, exports, module) {module.exports = {
    init: function () {

    }
};

});
require.register('pages/kontakt/template', function(require, exports, module) {module.exports = "<div><div class=\"marginBottom\">Kontakta David Miles på<div>E-post: <a href=\"mailto:david@davidmiles.se\">david@davidmiles.se</a></div><div>Telefon: <a href=\"tel:0706-979604\">0706-979604</a></div></div><paper-shadow z=\"1\" class=\"contactImage\"><img src=\"img/press/david_press_18.jpg\"></paper-shadow><div class=\"marginBottom\" vertical layout>Kontakta skivbolag på <a href=\"http://www.hansarenmusik.se\" target=\"_blank\">www.hansarenmusik.se</a></div><div horizontal layout class=\"marginBottom\"><div>Sidan är skapad av</div><a class=\"spaced\" href=\"https://se.linkedin.com/in/johanfrick\">Johan Frick</a></div><div horizontal layout><div>Administatör:</div><a class=\"spaced\" href=\"\" data-bind=\"click: login, visible: !isLoggedIn()\">Logga in</a> <a class=\"spaced\" href=\"\" data-bind=\"click: logout, visible: isLoggedIn()\">Logga ut</a></div></div>";
});
require.register('pages/kontakt/view-model', function(require, exports, module) {var router = require('router');
var login = require('login');

module.exports = {
    init: function () {
        this.isLoggedIn = login.isLoggedIn;
    },

    login: function () {
        router.navigate('/#login');
    },

    logout: function () {
        login.logout();
    }
};
});
require.register('pages/om/template', function(require, exports, module) {module.exports = "<div><p>David Miles är en låtskrivare, gitarrist och sångare uppvuxen i Göteborg men numera bosatt i Malmö. Han har gett ut 3 skivor sedan 2008. Den senaste skivan <a href=\"http://open.spotify.com/album/5nrPJLz8D9BAwBkUYyISWi\">Tiden är ett jetplan</a> gavs ut hösten 2012.</p><p>2011 hade David en radiohit med låten <a href=\"http://open.spotify.com/album/5RyzFjnNSYWYHdP5Nn9SDp\">Det är bara så det är</a>.</p><p>Många krogar, restauranger, eventbolag mm bokar David som trubadur. Efter flera år som flitig underhållare på uteserveringar och pubar runt om i landet är han med sitt genuina och äkta sound alltid mycket omtyckt.</p><p>David medverkar även i <a href=\"\" data-bind=\"click:goToPodcast\">podcasten Sjöwall & Miles</a> där det släpps ett nytt avsnitt ungefär en gång i månaden.</p><div center-justified><paper-shadow z=\"1\" class=\"card homeImage\"><img src=\"/img/spelplan.jpg\"></paper-shadow><paper-shadow z=\"1\" class=\"card homeImage\"><img src=\"/img/press/david_press_7_medium.jpg\"></paper-shadow></div><div class=\"musicServices\" horizontal center-justified layout><a href=\"http://www.facebook.com/pages/David-Miles/155341767874341\" target=\"_blank\"><img src=\"img/facebook.jpeg\" border=\"0\"></a> <a href=\"http://open.spotify.com/artist/4z4NwEHgD7Ykjs1L0gsKCI\" target=\"_blank\"><img src=\"img/spotify-logo-32x32-no-tagline.png\" border=\"0\"></a> <a href=\"https://itunes.apple.com/us/artist/david-miles/id304549972\" target=\"_blank\"><img src=\"img/itunes.png\" border=\"0\"></a></div></div>";
});
require.register('pages/om/view-model', function(require, exports, module) {var bus = require('message-bus');

module.exports = {
    init: function () {

    },
    goToTrubadur: function() {
        bus.publish('main-content', 'info-trubadur');
    },
    goToPodcast: function() {
        bus.publish('main-content', 'podcast');
    }

};
});
require.register('pages/podcast/template', function(require, exports, module) {module.exports = "<img class=\"max100\" src=\"/img/podcast.jpg\"><div class=\"podcasts\"><div class=\"animated fadeIn\" data-bind=\"if:podcasts().length === 0\">Inga podcasts tillgängliga</div><div data-bind=\"foreach: podcasts\"><div class=\"animated fadeIn\"><a href=\"\" data-bind=\"attr:{href: url}, text: title\" target=\"_blank\"></a></div></div></div>";
});
require.register('pages/podcast/view-model', function(require, exports, module) {var request = require('data-request');

module.exports = {
    init: function () {
        var self = this;
        this.podcasts = ko.observableArray([{title: 'Läser in podcast-listan...', url: ''}]);
        request.getJson('podcast', function (podcasts) {
            podcasts.forEach(function (podcast) {
                podcast.url = 'http://sjowallmiles.podomatic.com/entry/' + podcast.podomaticId;
            });
            self.podcasts(podcasts);
        });
    }
};

});
require.register('pages/spelplan/template', function(require, exports, module) {module.exports = "<img src=\"/img/spelplan.jpg\" class=\"card floatRight halfWidth\" data-bind=\"visible: !editMode()\"><div data-bind=\"visible:loading\" class=\"animated fadeIn\">Läser in spelplanen...</div><!--ko if: !loading()--><editable params=\"fileName: 'spelplan', textToEdit: gigs, editMode: editMode\"></editable><div class=\"animated fadeIn\" data-bind=\"visible: !editMode()\"><div class=\"marginBottom bigger\" data-bind=\"with: first\"><div class=\"red\">Nästa spelning <span data-bind=\"text: distance\"></span></div><div>Datum: <span data-bind=\"text: date\"></span></div><div>Plats: <span data-bind=\"text: place\"></span></div></div><div class=\"red\">Kommande</div><div data-bind=\"if:upcoming().length === 0\">Inga spelningar inbokade</div><div class=\"marginBottom\" data-bind=\"foreach: upcoming\"><div><span class=\"bold\" data-bind=\"text: date\"></span> <span data-bind=\"text: place\"></span></div></div><div data-bind=\"if:history().length > 0\"><div class=\"red\">Tidigare</div><div data-bind=\"foreach: history\"><div><span class=\"bold\" data-bind=\"text: date\"></span> <span data-bind=\"text: place\"></span></div></div></div></div><!--/ko-->";
});
require.register('pages/spelplan/view-model', function(require, exports, module) {var request = require('data-request');
var router = require('router');

module.exports = {
    init: function () {
        var self = this;
        this.first = ko.observable();
        this.upcoming = ko.observableArray();
        this.history = ko.observableArray();
        this.loading = ko.observable(true);
        this.editMode = ko.observable(false);
        this.gigs = ko.observable();
        request.getTxt('spelplan', function (gigs) {
            self.loading(false);
            self.gigs(gigs);
            var now = new Date();
            now.setHours(0, 0, 0, 0);
            var upcoming = [];
            gigs.split('\n').forEach(function (line) {
                var gig = {};
                gig.date = parseDate(line);
                if (gig.date) {
                    gig.place = line.replace(gig.date, '');
                    gig.dateObject = new Date(gig.date);
                    gig.dateObject.setHours(0, 0, 0, 0);
                    if (now <= gig.dateObject) {
                        upcoming.push(gig);
                    } else {
                        self.history.unshift(gig);
                    }
                }
            });
            upcoming.sort(function(a,b) {
                return a.dateObject - b.dateObject;
            });
            var first = upcoming[0];
            var diff = dayDiff(now, first.dateObject);
            if (diff === 0) {
                first.distance = 'är idag!';
            } else {
                first.distance = 'är om ' + diff + ' dagar';
            }
            self.first(first);
            self.upcoming(upcoming);
        });

    }
};

function dayDiff(first, second) {
    return parseInt((second - first) / (1000 * 60 * 60 * 24));
}

function parseDate(line) {
    var matches = line.match(/\d\d\d\d-\d\d-\d\d( \d\d?:\d\d)?/);
    if (matches && matches.length) {
        var gig = {};
        return matches[0];
    }
    return undefined;
}
});
require.register('pages/artist/bilder/template', function(require, exports, module) {module.exports = "<gallery params=\"jsonName: 'bilder-artist'\"></gallery>";
});
require.register('pages/artist/bilder/view-model', function(require, exports, module) {module.exports = {
    init: function () {
    }
};

});
require.register('pages/artist/discografi/template', function(require, exports, module) {module.exports = "<div data-bind=\"visible:loading\" class=\"animated fadeIn\">Läser in album...</div><!--ko if: !loading()--><div data-bind=\"if: albums().length === 0\">Inga album upplagda för tillfället. Återkom gärna senare!</div><div data-bind=\"foreach: albums\"><div class=\"card discography animated fadeIn\" data-bind=\"if: hasImage\"><div class=\"discoInfo\"><div class=\"discoYear\" data-bind=\"text: date\"></div><div horizontal layout justified><div class=\"discoTitle\" data-bind=\"text: title\"></div><div class=\"discoTrackCount\"><span data-bind=\"text: trackCount() + ' spår'\"></span></div></div></div><div style=\"background-size: 100%\" data-bind=\"style: {backgroundImage: image, width: width, height: height}\"></div><div class=\"discoLinks\" horizontal end-justified layout center><a href=\"\" target=\"_blank\" data-bind=\"visible: shopUrl, attr:{href: shopUrl}\"><img class=\"shoppingCart\" src=\"img/shopping-cart.png\" border=\"0\"></a> <a href=\"\" target=\"_blank\" data-bind=\"attr:{href: iTunesUrl}\"><img src=\"img/itunes.png\" border=\"0\"></a> <a href=\"\" target=\"_blank\" data-bind=\"attr:{href: spotifyUrl}\"><img src=\"img/spotify-logo-32x32-no-tagline.png\" border=\"0\"></a></div></div></div><!--/ko-->";
});
require.register('pages/artist/discografi/view-model', function(require, exports, module) {var request = require('data-request');

module.exports = {
    init: function () {
        var self = this;
        self.albums = ko.observableArray();
        this.loading = ko.observable(true);
        request.getJson('spotify_albums', function (albums) {
            self.loading(false);
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
                album.hasImage = ko.computed(function() {
                    return album.image() !== undefined;
                });
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
});
require.register('pages/artist/press/template', function(require, exports, module) {module.exports = "<div vertical layout center><b>Pressmeddelande</b> <a href=\"/img/130607_davidmiles.se_pressmeddelande.pdf\" target=\"_blank\">2013-06-07 David Miles Konserter sommaren 2013</a> <a href=\"/img/121016_davidmiles.se_pressmeddelande.pdf\" target=\"_blank\">2012-10-16 David Miles släpper nya skivan Tiden är ett jetplan!</a> <a href=\"/img/120625_davidmiles.se_pressmeddelande.pdf\" target=\"_blank\">2012-06-25 David Miles ger ut ny skiva hösten 2012!</a> <b class=\"pressImages\">Affisch (PDF)</b><div data-bind=\"foreach: posters\"><paper-shadow z=\"2\" class=\"card\"><a data-bind=\"attr: {href: url}\"><img data-bind=\"attr: {src: thumb}\"></a></paper-shadow></div><b class=\"pressImages\">Pressbilder</b><div data-bind=\"foreach: press\"><paper-shadow z=\"2\" class=\"card\"><a data-bind=\"attr: {href: url, 'data-title': downloadLink}\" data-lightbox=\"image-1\" data-title=\"\"><img data-bind=\"attr: {src: thumb}\"></a></paper-shadow></div></div>";
});
require.register('pages/artist/press/view-model', function(require, exports, module) {module.exports = {
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
        this.press = images;

        this.posters = [
            {
                thumb: 'img/affisch/david_miles_A3.jpg',
                url: 'img/affisch/david_miles_A3.pdf'
            }
        ];
    }
};
});
require.register('pages/artist/recensioner/template', function(require, exports, module) {module.exports = "<div class=\"reviews\" data-bind=\"foreach: items\"><!--ko if: hasImage--><img class=\"reviewAlbums\" src=\"\" data-bind=\"attr: {src: albumImage}\"><!--/ko--><!--ko if: hasText --><div><a href=\"\" target=\"_blank\" data-bind=\"attr: {href: link}, text: text\"></a></div><!--/ko--></div>";
});
require.register('pages/artist/recensioner/view-model', function(require, exports, module) {var request = require('data-request');

module.exports = {
    init: function () {
        var self = this;
        this.items = ko.observableArray();
        request.getJson('recensioner', function (items) {
            items.forEach(function(item) {
                item.hasImage = item.albumImage !== undefined;
                item.hasText = item.text !== undefined;
            });
            self.items(items);
        });
    }
};
});
require.register('pages/artist/shop/template', function(require, exports, module) {module.exports = "Shoppen öppnas i ett nytt fönster. <a href=\"http://davidmiles.tictail.com/\">Klicka här</a> för att öppna den igen.";
});
require.register('pages/artist/shop/view-model', function(require, exports, module) {module.exports = {
    init: function () {
        var win = window.open('http://davidmiles.tictail.com/', '_blank');
        win.focus();
    }
};
});
require.register('pages/artist/texter/template', function(require, exports, module) {module.exports = "<editable params=\"fileName: 'lyrics', textToEdit: allTexts, editMode: editMode\"></editable><div data-bind=\"foreach: lyrics, visible: !editMode()\"><div class=\"animated fadeIn\"><a href=\"\" data-bind=\"text: id, click: click, css: {'bold animated pulse': selected()}\"></a></div><div class=\"hiddenLyrics\" data-bind=\"html: text, css: {'visibleLyrics': selected}\"></div></div>";
});
require.register('pages/artist/texter/view-model', function(require, exports, module) {var request = require('data-request');
var utils = require('dm-utils');

module.exports = {
    init: function () {
        var self = this;
        this.lyrics = ko.observableArray();
        self.selected = ko.observable();
        self.allTexts = ko.observable('');
        self.editMode = ko.observable(false);
        request.getTxt('lyrics', function (allTexts) {
            self.allTexts(allTexts);
            var items = utils.parseTextToItems(allTexts);
            items.forEach(self.newLyricsItem.bind(self));
            self.lyrics(items);
        });

    },
    newLyricsItem: function (item) {
        item.selected = ko.observable(false);
        var self = this;
        item.click = function () {
            if (item.selected()) {
                item.selected(false);
            } else {
                self.lyrics().forEach(function (item) {
                    item.selected(false);
                });
                item.selected(true);
            }
        };
    }
}
;
});
require.register('pages/artist/video/template', function(require, exports, module) {module.exports = "<iframe-list params=\"items:videos, playIconClass: 'youtube'\"></iframe-list>";
});
require.register('pages/artist/video/view-model', function(require, exports, module) {var request = require('utils/request');
var dataRequest = require('data-request');
var apiKey = 'AIzaSyBKplqq_V9dmIO1y8oD73kaj5rwnRSS_d4';


module.exports = {
    init: function () {
        var self = this;
        this.videos = ko.observableArray();
        dataRequest.getJson('video-artist', function (ids) {
            var videos = ids.map(function (id) {
                var video = {
                    id: id,
                    iFrameUrl: 'https://www.youtube.com/embed/' + id + '?autoplay=1&autohide=1&origin=http://davidmiles.se',
                    image: 'url(http://i.ytimg.com/vi/' + id + '/mqdefault.jpg)',
                    title: ko.observable(),
                    width: '320px',
                    height: '180px',
                    fill: true
                };
                request('GET', 'https://www.googleapis.com/youtube/v3/videos?key=' + apiKey +
                    '&fields=items(snippet(title))&part=snippet&id=' + video.id).end(function (result) {
                    video.title(result.body.items[0].snippet.title);
                });
                return video;
            });
            self.videos(videos);
        });
    }
};

});
require.register('pages/trubadur/bilder/template', function(require, exports, module) {module.exports = "<gallery params=\"jsonName: 'bilder-trubadur'\"></gallery>";
});
require.register('pages/trubadur/bilder/view-model', function(require, exports, module) {module.exports = {
    init: function () {
    }
};

});
require.register('pages/trubadur/info/template', function(require, exports, module) {module.exports = "Här ska det finnas text om trubaduren";
});
require.register('pages/trubadur/info/view-model', function(require, exports, module) {var request = require('data-request');

module.exports = {
    init: function () {

    }
};
});
require.register('pages/trubadur/referenser/template', function(require, exports, module) {module.exports = "<div horizontal center-justified layout wrap data-bind=\"foreach: references\"><div vertical layout class=\"quote\"><div data-bind=\"text:text\" class=\"quoteText\"></div><div data-bind=\"text:id\" class=\"quoteSource\"></div></div></div>";
});
require.register('pages/trubadur/referenser/view-model', function(require, exports, module) {var request = require('data-request');
var utils = require('dm-utils');

module.exports = {
    init: function () {
        this.references = ko.observableArray();
        var self = this;
        self.referencesString = ko.observable('');
        request.getTxt('referenser', function (referencesString) {
            self.referencesString(referencesString);
            var items = utils.parseTextToItems(referencesString);
            items.forEach(function(item) {
                item.text = '”' + item.text + '”';
            });
            self.references(items);
        }.bind(this));
    }
};
});
require.register('pages/trubadur/video/template', function(require, exports, module) {module.exports = "<div vertical layout>Här kommer det snart finnas videor från Davids trubadurgig...</div>";
});
require.register('pages/trubadur/video/view-model', function(require, exports, module) {module.exports = {
    init: function () {

    }
};
});
window.cogwheels.addFeature({name: "pages", version: "0.0.0"});
//# sourceMappingURL=../maps/gears-4025184d.js.map
