const fs = require('fs');
const NewAccount = require('./accountGenerator');
const fsPromises = fs.promises;
const { IgApiClient } = require("instagram-private-api")

const start = async () => {
    // fs.readFile('./assets/proxies-list.txt', 'utf8', (err, data) => {
    //     if (err) {
    //         return console.error('FAILED READING PROXIES', err)
    //     }
    //     return data;
    // });
    try {
        let proxyList = await fsPromises.readFile('./assets/proxies-list.txt')
        let newRandomAccount = NewAccount();
        let { username, password, email, name } = await newRandomAccount;
        const ig = new IgApiClient();
        ig.state.generateDevice();
        ig.state.proxyUrl = proxyUrl;
    } catch (e) {
        console.log('ERROR PREPARING REQUEST PARAMETERS', e)
    }
    try {
        // ig.account.create({
        //     username,
        //     password,
        //     email,
        //     name
        // })
    } catch (e) {
        console.error('ERROR on instagram private api account creation')
    }
}

start();
