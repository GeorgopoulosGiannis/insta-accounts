const fs = require('fs');
const NewAccount = require('./accountGenerator');
const { IgApiClient } = require("instagram-private-api");
const PROXIES_FILE_PATH = './assets/proxies-list.txt';
const NEW_ACCOUNTS_FILE_PATH = './assets/new-accounts-txt';

let proxyArray;
let newRandomAccount;

const readProxies = () => {
    let proxyFileData = fs.readFileSync(PROXIES_FILE_PATH, 'utf8');
    proxyArray = proxyFileData.split(/\r?\n/);
}
const writeUsedProxies = () => {
    let file = fs.createWriteStream(PROXIES_FILE_PATH);
    file.on('error', function (err) { console.log('ERRROR WRITING FILE', err) });
    proxyArray.forEach(function (proxy) {
        if (proxy.indexOf(':used') == -1) {
            file.write(proxy + '\n');
        }
    });
    file.end();
    console.error('ERROR on instagram private api account creation')
}

const writeNewAccount = (account, res) => {
    let file = fs.createWriteStream(NEW_ACCOUNTS_FILE_PATH);
    file.on('error', function (err) { console.log('ERRROR WRITING FILE', err) });
    file.write(account + '\n' + res)
    file.end();
}

const start = async (proxyIndex = 0) => {
    try {
        let { username, password, email, name } = newRandomAccount;
        const ig = new IgApiClient();
        ig.state.generateDevice();
        console.log(proxyArray)
        if (proxyArray[proxyIndex]) {
            ig.state.proxyUrl = "http://" + proxyArray[proxyIndex];
            proxyArray[proxyIndex] = proxyArray[proxyIndex] + ':used'

            ig.account.create({
                username,
                password,
                email,
                name
            }).then(async (res) => {
                writeNewAccount(newRandomAccount, res);
                newRandomAccount = await NewAccount();
                start(proxyIndex + 1);
                console.log('SUCCESS CREATE ------->', res);
            }).catch((err) => {
                start(proxyIndex + 1);
                console.log('ERROR CREATE ------->', err);
            })
        } else {
            writeUsedProxies();
        }

    } catch (e) {
        console.log('ERROR ----->', e)
    }
}


(async function init() {
    readProxies();
    newRandomAccount = await NewAccount();
    start();
})();


