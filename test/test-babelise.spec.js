import { testImport } from 'es6-import';
import should from '../node_modules/should/should.min';

/**
 * A mock Document, for options testing.
 */
class Mocument {

	constructor({ params = undefined, url = '/' }) {
		this.content	= '';
		this.url		= url;

		this.params		= params
			? '?' + [ for (key of Object.keys(params)) `${key}=${params[key]}` ].join('&')
			: '';
	}

	getElementsByTagName() {
		return [{ src: this.url + this.params }];
	}

	write(content) {
		this.content += content;
	}

	clear() {
		this.content = '';
	}

	async use(callback) {

		// Replace getElementByTagNames and write on document.
		var oldGetElementsByTagName	= document.getElementsByTagName;
		var oldWrite				= document.write;

		document.getElementsByTagName	= this.getElementsByTagName.bind(this);
		document.write					= this.write.bind(this);

		var result = callback();
		if (result) { await result; }

		document.getElementsByTagName	= oldGetElementsByTagName;
		document.write					= oldWrite;
	}

}


/**
 * The scripts loaded by babelise have their own test suites - this is a silly
 * cursory test that those scripts are loaded successfully, that some ES6 only
 * functionality works, and that imports resolve correctly.
 */
describe('babelise', () => {

	var babelise;

	// Load the babelise script, and build a function from its source, so we can
	// rerun it on a Mocument at will.
	before((done) => {
		var moc = new Mocument({});
		moc.use(() => {
			return System.load('../babelise').then((module) => {
				babelise = new Function(module.source);
				done();
			});
		});
	});

	it('should load successfully and enable ES6+ via Babel!', () => {
		// This is kinda implicit...  If this test is executed, the scripts will
		// already have loaded successfully.
		let everything = !this;
		everything.should.be.true;
	});


	it('should correctly allow importing of other modules', () => {
		testImport.should.equal('Success!');
	});

	it('should adjust base paths when supplied with a base param', (done) => {
		var moc = new Mocument({ url: 'WRONG', params: { base: 'RIGHT' } });

		moc.use(() => {
			babelise();
			moc.content.should.not.match(/WRONG/);
			moc.content.should.match(/RIGHT/);
			done();
		});

	});

	it('should enable all stages when no stage option is passed', (done) => {
		var moc = new Mocument({});

		moc.use(() => {
			babelise();
			moc.content.should.match(/stage: 0/);
			done();
		});

	});

	it('should supply a stage option to Babel when stage is passed', (done) => {
		var moc = new Mocument({ params: { stage: 3 } });

		moc.use(() => {
			babelise();
			moc.content.should.match(/stage: 3/);
			done();
		});

	});

});


describe('once initialised', () => {

	it('should make friends and influence people', () => {
		var [a, b] = [1, 7];
		var [c, d] = [b, a];
		d.should.equal(a);
		c.should.equal(b);
	});


	it('should do science', () => {
		var x = 8;
		{
			let x = 'blah';
			x.should.equal('blah');
		}
		x.should.equal(8);
	});

	it('should be magic', () => {
		function* generate() {
			yield 6;
			return 'a string';
		}

		var a = generate();

		a.next().value.should.equal(6);
		a.next().value.should.equal('a string');
	});


	it('should consume 1.21 gigawatts', (done) => {
		var a = 2;

		async function procrastinate() {
			a = await System.import('es6-import');
			a.testImport.should.equal('Success!');
			done();
		}

		procrastinate();

		a.should.equal(2);
	});


});

