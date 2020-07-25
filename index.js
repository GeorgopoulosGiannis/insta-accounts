const fs = require('fs');
const NewAccount = require('./accountGenerator');
const { IgApiClient } = require("instagram-private-api");
const PROXIES_FILE_PATH = './assets/proxies-list.txt';
const NEW_ACCOUNTS_FILE_PATH = './assets/new-accounts.txt';
const ERROR_LOG_FILE_PATH = './assets/error-log.txt';


process.on('unhandledRejection', (error, promise) => {
    console.log(' Oh Lord! We forgot to handle a promise rejection here: ', promise);
    console.log(' The error was: ', error);
});

const readProxies = () => {
    let proxyFileData = fs.readFileSync(PROXIES_FILE_PATH, 'utf8');
    proxyArray = proxyFileData.split(/\r?\n/);
    return proxyArray;
}
const writeUsedProxies = (proxyArray) => {
    let file = fs.createWriteStream(PROXIES_FILE_PATH);
    file.on('error', function (err) { console.log('ERRROR WRITING FILE', err) });
    proxyArray.forEach(function (proxy) {
        if (proxy.indexOf(':used') > -1) {
            file.write(proxy + '\n');
        }
    });
    file.end();
}

const writeNewAccount = (account, res) => {
    if (res.account_created) {
        if (typeof (account) == 'object') {
            JSON.stringify(account)
        }
        if (typeof (res) == 'object') {
            JSON.stringify(res)
        }
        fs.appendFileSync(NEW_ACCOUNTS_FILE_PATH, account + '\n' + res, function (err) {
            if (err) throw err;
            console.log('saved')
        });
    }
}
const writeErrorLog = (message, code, body) => {
    fs.appendFileSync(ERROR_LOG_FILE_PATH, message + ' ' + code + '-' + body + '\n', function (err) {
        if (err) throw err;
        console.log('saved error')
    });
}

const handleError = async (err, proxyArray, newRandomAccount, proxyIndex) => {
    if (err.response && err.response.statusCode == 400 && err.name == 'IgCheckpointError') {
        console.log('IgCheckpointError')
        await ig.challenge.auto(true); // error here

    }
    if (err.response && err.response.statusCode > 300) {
        writeErrorLog(err.response.statusMessage, err.response.statusCode, JSON.stringify(err.response.body));
    }
    if (err.response && err.response.statusCode == 400) {
        newRandomAccount = await NewAccount().catch((err) => {
            console.log('ERROR from new accounts', err);
        });
        start(proxyArray, newRandomAccount, proxyIndex + 1);
    } else {
        start(proxyArray, newRandomAccount, proxyIndex + 1);
    }

}

const start = async (proxyArray, newRandomAccount, proxyIndex = 0) => {
    try {
        let { username, password, email, name } = newRandomAccount;
        ig.state.generateDevice();
        if (proxyArray[proxyIndex]) {
            ig.state.proxyUrl = "http://" + proxyArray[proxyIndex];
            proxyArray[proxyIndex] = proxyArray[proxyIndex] + 'used'
            ig.account.create({
                username,
                password,
                email,
                name
            }).then(async (res) => {
                writeNewAccount(newRandomAccount, res);
                newRandomAccount = await NewAccount().catch((err) => {
                    console.log('ERROR from new accounts', err);
                    handleError(err, proxyArray, newRandomAccount, proxyIndex + 1)
                });
                start(proxyArray, newRandomAccount, proxyIndex + 1);
                console.log('SUCCESS CREATE')
            }).catch((err) => {
                console.log('ERROR FROM CREATE ACCOUNT', err)
                handleError(err, proxyArray, newRandomAccount, proxyIndex + 1)
            })
        } else {
            console.log('writeUsedProxies')
            writeUsedProxies(proxyArray);
        }

    } catch (e) {
        handleError(err, proxyArray, newRandomAccount, proxyIndex + 1)
    }
}


const init = async () => {
    try {
        let proxyArray = readProxies();
        let newRandomAccount = await NewAccount().catch((err) => {
            console.log('ERROR from new accounts', err);
        });
        start(proxyArray, newRandomAccount);
    } catch (e) {
        console.log('init error', e)
    }

};

const ig = new IgApiClient();
init();

