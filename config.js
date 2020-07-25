
const Config = {
    "bot_type" : 2, //change to 2 to use python requests
    "use_custom_proxy" : false, //default is False change to True to use a file containing multiple proxies of yours.
    "use_local_ip_address" : false, //default is False chnage to True to user your computers ip directly.
    "amount_of_account": 1, //amount of account you want to create make sure it doesnt exceed 50 for better performance
    "amount_per_proxy": 1, //this would be amont of account used if you have a you are using multiple proxies
    "proxy_file_path" :  "/assets/proxies.txt",
    "email_domain": "gmail.com",
    "country": "gr",
    "activation_email_addr": "xxxxxxxxxxxxxxxx",
    "activation_email_pass": "xxxxxxxxxxxxxxxx",
    "activation_email_serv": "xxxxxxxxxxxxxxxx",
    "activation_email_spor": 993,
}

module.exports = Config;