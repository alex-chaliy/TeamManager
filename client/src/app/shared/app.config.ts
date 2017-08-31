import * as process from 'process';

export let ApiServer = 'http://' + (process.env.NODE_ENV == 'DEV' ? 'localhost' : '77.220.213.35') + ':3030/';
console.log('\n Api Server is: ', ApiServer);

function logDev() {
	console.warn('\n if you want be in DEVELOPMENT mode & run your app on localhost: ' +  '\n\n set NODE_ENV=DEV \n');
}
function logProd() {
    console.warn('PRODUCTION mode is now.');
	console.warn( 'NODE_ENV = ', process.env.NODE_ENV );
}
process.env.NODE_ENV == 'DEV' && logDev;
process.env.NODE_ENV != 'DEV' && logProd;