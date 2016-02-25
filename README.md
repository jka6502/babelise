# Babelise

Babelise your browser code, automagically!

**NOTE**: As of node >= 4, the included npm creates a flat `node_modules`
structure, so the `flat` page parameter must be supplied to work correctly:

``` html
<script src='./node_modules/babelise/bablise.js?flat'></script>
```

Additionally, babel 6 does not support dynamic transpilation in the browser,
so babelise is restricted to babel 5 until I can find an alternative approach.

Babelise injects the required scripts and configuration from the
[Babel](http://babeljs.io/) project, allowing transpiling of ES6+ to ES5,
directly in the browser.

It also injects the [ES6 module loader](https://www.npmjs.com/package/es6-module-loader)
shim and [systemjs](https://www.npmjs.com/package/systemjs) AMD and CommonJS
module loader, to enable ES6 module functionality.

In combination, the included scripts allow usage of almost all of EcmaScript 6,
and some EcmaScript 7 functionality, right now, in EcmaScript 5 compliant
browsers!

Of course, all the hard work has been achieved by the authors of the
aforementioned projects - babelise just makes it that teensy bit easier to use.


## Usage

Install the module.

```sh
npm install babelise
```

Create a html page.  Reference the `babelise/babelise.js` script in your page
header, before any ES6+ scripts.  For inline scripts, wrap them in a
`<script type='module'> // ... </script>` tag.

```html
<script src='node_modules/babelise/babelise.js'></script>

<script type='module'>
	// ES6 - Wahoo!
	import { Foo } from 'Bar';

	let [a, b, c] = Foo.method((d) => { console.log(d); });
</script>
```

Start a http server, to serve your page (Note: this is required as the module
shim uses XMLHttpRequest - so `file:` url's cannot be used).  Something like
[node-static](https://www.npmjs.com/package/node-static), or python's built in
`python -m SimpleHTTPServer` should do the trick.

Open your web browser, visit the page, and witness the future!


## Additional options

Options can be supplied to `babelise` as url parameters in the script tag.

```html
<script src='node_modules/babelise/babelise.js?stage=1'></script>

<script type='module'>
	async function procrastinate() {
		await new Foo().doTheThing();
		console.log('The thing is done');
	}

	procrastinate();
	console.log('The thing is not done yet...');
</script>	
```

The following options may be supplied:

* base - The base url or path that the required npm modules are exposed on.
* stage - Select an experimental stage, to enable a subset of Babel features.
* flat - Expect a flat `node_modules` structure, required in node.js >= 4.

By default, stage 0 and above will be enabled - so all features are available.


## Running the test suite

Run the test suite in the usual fashion.

```sh
npm test
```

And visit the testem page with your browser of choice.

## Contributing

All PR's, suggestions, bug reports, or general feedback welcome!
