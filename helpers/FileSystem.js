const fs = require('fs');
const {PROXIES_FILE_PATH,ERROR_LOG_FILE_PATH,NEW_ACCOUNTS_FILE_PATH} = require('../helpers/CONSTANTS');

const deleteProxiesFile = (proxyArray) => {
    fs.unlink(PROXIES_FILE_PATH, function (err) {
        console.log(err)
    })
}

const readProxies = () => {
    let proxyFileData = fs.readFileSync(PROXIES_FILE_PATH, 'utf8');
    proxyArray = proxyFileData.split(/\r?\n/);
    return proxyArray;
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
    fs.appendFileSync(ERROR_LOG_FILE_PATH, message + ' ' + code + '-' + body + '----' + new Date().toDateString() + '\n', function (err) {
        if (err) throw err;
        console.log('saved error')
    });
}

exports.deleteProxiesFile = deleteProxiesFile;
exports.readProxies = readProxies;
exports.writeNewAccount = writeNewAccount;
exports.writeErrorLog = writeErrorLog;