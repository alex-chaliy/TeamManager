/** 
 * String Service
 *
 * Description:
 * string methods
 */

/**
 * @takes string
 * 
 * @returns string
 */
function saltGenerate( length ) {
	/** Error Safety */
		length = +length || 1;
	/** end - Error Safety */

	let s = '';
	let abd = 'abcdefghijklmnopqrstuvwxyz0123456789';
	let aL = abd.length;
	while(s.length < length)
		s += abd[Math.random() * aL|0];
	return s;
}

/** Tests */
	// tests here
/** end - Tests */

let StringService = {
	saltGenerate: saltGenerate
}

module.exports = StringService;