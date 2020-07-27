const {readProxies,deleteProxiesFile,writeNewAccount,writeErrorLog} = require('../helpers/FileSystem');
const NewAccount = require('../helpers/accountGenerator');
const { IgApiClient } = require("instagram-private-api");
const ig = new IgApiClient();

const start = async (proxyArray = null, newRandomAccount = null, proxyIndex = 0) => {
    try {
        if(!newRandomAccount){
             newRandomAccount = await NewAccount().catch((err) => {
                console.log('ERROR from new accounts', err);
            });
        }
        if(!proxyArray){
            proxyArray = readProxies();
        }
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
            }).catch((err) => {
                console.log('ERROR FROM CREATE ACCOUNT', err)
                handleError(err, proxyArray, newRandomAccount, proxyIndex + 1)
            })
        } else {
            console.log('delete proxies')
            deleteProxiesFile(proxyArray);
        }
    } catch (e) {
        handleError(err, proxyArray, newRandomAccount, proxyIndex + 1)
    }
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

exports.start = start;
