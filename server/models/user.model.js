'use strict';

/** entity
 *  User
 * 
 * @roles:
 * employee,
 * employer
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
	role: {type: String, default: 'employee'}, // see @roles
	name: {type: String, default: 'User Name'},
	age: {type: Number, default: 18},
	description: {type: String, default: 'User description'}
});

const User = mongoose.model('User', UserSchema);

module.exports = User;