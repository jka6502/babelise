(function() {


	var elements		= document.getElementsByTagName('script'),
		element			= elements[elements.length - 1],
		url				= element.src;
		index			= url.lastIndexOf('/'),
		base			= url.substring(0, index) + '/node_modules',
		paramStart		= url.indexOf('?'),
		systemConfig	= '',
		stage			= 0;

	if (paramStart !== -1) {
		var params = {};
		url.substring(paramStart + 1).split(',').forEach(function(value) {
			var components = value.split('=');
			params[decodeURIComponent(components[0].trim())]
				= decodeURIComponent((components[1] || '').trim());
		});

		if (params.base) {
			base = params.base;
		}

		stage = params.stage || 0;
	}

	systemConfig += 'System.babelOptions = { stage: ' + stage + ' };';

	function inject(url, content) {
		document.write('<script data-babelise="true"'
			+ (url ? (' src="' + url + '"') : '') + '>'
			+ (content || '') + '</script>');
	}

	inject(base + '/babel-core/browser-polyfill.js');
	inject(base + '/es6-module-loader/dist/es6-module-loader.js');
	inject(base + '/systemjs/dist/system.js');

	inject(null, ''
		+ 'System.transpiler = "babel"; '
		+ systemConfig
		+ 'System.config({'
			+ 'paths: {'
				+ 'babel: "' + base + '/babel-core/browser.js"'
			+ '}'
		+ '});'

		// Leave no trace, like a ninja.
		+ 'Array.prototype.filter.call(document.getElementsByTagName("script"), function(tag) {'
			+ 'return (tag.getAttribute && tag.getAttribute("data-babelise"));'
		+ '}).map(function(tag) { tag.parentNode.removeChild(tag) });'
	);


})();