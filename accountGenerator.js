const config = require('./config')
const RandomIdentity = require('./RandomIdentity')

const NewAccount = async () => {
	try {
		let account_info = {};
		let { identity, gender, birthday } = await RandomIdentity(country = config['country'])
		account_info['name'] = identity;
		account_info['username'] = generateUsername(account_info['name']);
		account_info['password'] = generatePassword();
		account_info['email'] = generateEmail(account_info['username'])
		account_info['gender'] = gender;
		account_info['birthday'] = birthday;
		return account_info;
	} catch (e) {
		console.error('Error while generating new account ', e);
	}

}

const generateEmail = (username) => {
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
