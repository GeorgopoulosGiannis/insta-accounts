const config = require('./config')
const RandomIdentity = require('./RandomIdentity')

const NewAccount = () => {
	return new Promise(async (resolve, reject) => {
		try {
			console.log('inside newaccount')
			let account_info = {};
			let { identity, gender, birthday } = await RandomIdentity(country = config['country'])
			account_info['name'] = identity;
			account_info['username'] = generateUsername(account_info['name']);
			account_info['password'] = generatePassword();
			account_info['email'] = generateEmail(account_info['username'])
			account_info['gender'] = gender;
			account_info['birthday'] = birthday;
			resolve(account_info);
		} catch (e) {
			reject(e)
			console.error('Error while generating new account ', e);
		}
	})
}

const generateEmail = (username) => {
	username = username.replace('.', '');
	return (username + "@" + config["email_domain"])
}


const generatePassword = () => {
	return Math.random().toString(36).slice(-8);
}


const generateUsername = (identity) => {
	n = Math.random(1, 99)
	//n regex remove spaces
	name = identity.toLowerCase().replace(/\s/g, '');
	newUsername = name + n
	if (newUsername.length > 20) {
		newUsername = newUsername.substring(0, 20)
	}
	return newUsername;
}

module.exports = NewAccount;
