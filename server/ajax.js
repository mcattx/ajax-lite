var JSONPID = 0,
	key,
	value,
	jsonType = 'application/json',
	htmlType = 'text/html';

var document = window.document, 
	slice = Array.prototype.slice,
	emptyFn = function() {};

var defaultSetting = {
	type: 'get',
	dataType: 'json',
	beforeSend: emptyFn,
	success: emptyFn,
	error: emptyFn,
	complete: emptyFn,
	context: null,
	xhr: null,
	mineTypeMap: {
		script: 'text/javascript, application/javascript',
		json: jsonType,
		xml: 'application/xml, text/xml',
		html: htmlType,
		text: 'text/plain'
	},
	crossDomain: false,
	timeOut: 0
}


/**
 *	 some util functions
 */

function _extend(target, source) {
	for(var k in source) {
		if (source[k] !== undefined) {
			target[k] = source[k];
		}
	}
	return target;
}

/**
 *   ============================================
 */

/**
 * 	 some logical functions
 */

function _createXHR() {
	if (window.XMLHttpRequest) {
		return new XMLHttpRequest();
	} else {
		var versions = ['Microsoft', 'msxml3', 'msxml2', 'msxml1'];
		for(var i = 0; i < versions.length; i++) {
			try {
				var version = versions[i] + '.XMLHTTP';
				return new ActiveXObject(version);
			} catch(e) {

			}
		}
	}
}

function _ajaxBeforeSend(xhr, settings) {
	var context = settings.context;
	if (settings.beforeSend.call(context, xhr, settings) === false) {
		return false;
	}
}

function _ajaxSuccess(data, xhr, settings) {
	var context = settings.context,
		status = 'success';
	settings.success.call(context, data, status, xhr);

}

function _ajaxError(error, type, xhr, settings) {
	var context = settings.context;
	settings.error.call(context, xhr, type, error);

}

function _ajaxComplete(status, xhr, settings) {
	var context = settings.context;
	settings.complete.call(context, xhr, status);
}

function _ajaxStop() {

}

function _serializeData(options) {
	//if (typeof (options.data) === 'object') {}
}

/**
 *   ============================================
 */

var ajax = function(options) {
	var _options = options;
	options = _extend(options, defaultSetting);
	var settings = _extend({}, options || {}),
		abortTimeout,
		protocol = /^([\w-]+:)\/\//.test(settings.url) ? RegExp.$1 : window.location.protocol,
		xhr = settings.xhr,
		async = settings.async === undefined ? true : settings.async,
		mine = settings.mineTypeMap[settings.dataType],
		baseHeaders = {};
	
	xhr = _createXHR();

	xhr.onreadystatechange = function() {
		if (xhr.readyState === 4) {
			clearTimeout(abortTimeout);
			if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304 || (xhr.status == 0 && protocol == 'file:')) {
				_ajaxSuccess(xhr.responseText, xhr, settings);
			}
		} else {
			_ajaxError(null, 'error', xhr, settings);
		}
	}

	xhr.open(settings.type, settings.url, async);
	//设置请求头
	if (!settings.crossDomain) {
		baseHeaders['X-Request-With'] = 'XMLHttpRequest';
	}

	if (settings.contentType || (settings.data && settings.type.toLowerCase() != 'get')) {
		baseHeaders['Content-Type'] = (settings.contentType || 'application/x-www-form-urlencoded');
	}

	settings.headers = _extend(baseHeaders, settings.headers || {});

	xhr.send(settings.data ? settings.data : null);


	
}











