const config = require('./config')
const RandomIdentity = require('./RandomIdentity')

const NewAccount = async () => { 
	let account_info = {},identity,gender,birthday;
	let a = await RandomIdentity(country=config['country'])
	account_info['name']=identity;
	account_info['username']=username(account_info['name']);
	account_info['password']=generatePassword();
	account_info['email']=genEmail(account_info['username'])
	account_info['gender']=gender;
	account_info['birthday']=birthday;
	return account_info;
}

const  genEmail = (username) =>{
	return (username + "@" + Config["email_domain"])
}


const generatePassword = ()=>{
	return Math.random().toString(36).slice(-8);
}


const username = (identity) =>{
	n = str(random.randint(1,99))
	name = str(identity).lower().replace(" ","")
	username = name + n
	logging.info("Username: {}".format(username))
	return(username)
}

module.exports = NewAccount;
