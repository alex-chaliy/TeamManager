/** 
 * @name: Num Service
 *
 * @description:
 * number methods
 */

/**
 * @description: calculates random number
 * @takes
 *   min: number,
 *   max: number
 * @returns number
 */
function getRand( min, max ) {
	/** Error Safety */
		min = +min || 0;
		max = +max || 100;
	/** end - Error Safety */
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** Tests */
	// tests here
/** end - Tests */

let NumService = {
	getRand: getRand
}

module.exports = NumService;