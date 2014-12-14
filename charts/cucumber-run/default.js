/* global cogwheels */

cogwheels.start({

	'open-gateway': {
		url: 'http://localhost:3000',
		socketIO: {
			'transports': ['websocket'],
			'reconnection delay': 1500,
			'force new connection': true,
			'connection timeout': 2000,
			'max reconnection attempts': 5
		}
	},

	'layout-engine': {
		disabled: true
	}

});
