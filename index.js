const fs = require('fs');
const NewAccount = require('./accountGenerator');

const { IgApiClient } = require("instagram-private-api")

const start = async () => {
    let proxyList = fs.read('./assets/proxies-list.txt');
    let newRandomAccount = NewAccount();
    let { username, password, email, name } = await newRandomAccount;
    await proxyList;
    console.log(proxyList);
    const ig = new IgApiClient();
    ig.state.generateDevice();
    ig.state.proxyUrl = proxyUrl;
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
