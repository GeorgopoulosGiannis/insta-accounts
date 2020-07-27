const fs = require('fs');
const puppeteer = require('puppeteer');
const exec = require('child_process').exec;
const Config = require('./config');
const NewAccount = require('./accountGenerator');
const { IgApiClient } = require("instagram-private-api");
const { exception } = require('console');
const PROXIES_FILE_PATH = './assets/proxies-list.txt';
const NEW_ACCOUNTS_FILE_PATH = './assets/new-accounts.txt';
const ERROR_LOG_FILE_PATH = './assets/error-log.txt';
const CREATE_ACCOUNT_URL = 'https://www.instagram.com/accounts/emailsignup/'

process.on('unhandledRejection', (error, promise) => {
    console.log(' Oh Lord! We forgot to handle a promise rejection here: ', promise);
    console.log(' The error was: ', error);
});

const init = async () => {
    try {
       let newRandomAccount = await NewAccount().catch((err) => {
            console.log('ERROR from new accounts', err);
        });
        if (Config.bot_type == 2) {
            let proxyArray = readProxies();
            start(proxyArray, newRandomAccount);
        } else {
            startPuppeteer(newRandomAccount)
        }

    } catch (e) {
        console.log('init error', e)
    }

};

const readProxies = () => {
    let proxyFileData = fs.readFileSync(PROXIES_FILE_PATH, 'utf8');
    proxyArray = proxyFileData.split(/\r?\n/);
    return proxyArray;
}
const deleteProxiesFile = (proxyArray) => {
    fs.unlink(PROXIES_FILE_PATH, function (err) {
        console.log(err)
    })
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
const startPuppeteer = async (newRandomAccount) => {
    const instagramPage = firstStep(newRandomAccount);
    
}

const firstStep = async (newRandomAccount)=>{
    const browser = await launchPuppeteerBrowser();
    const page = await getNewPage(browser);
    await navigateToInstagramPage(page);
    await fillSignupInfo(page,newRandomAccount);
    await fillBirthdayPage(page);
    await closePopupConfirmation(page);
    return page;
}

const launchPuppeteerBrowser = async ()=>{
    const browser = await puppeteer.launch({
        headless: false,
        args: [
            '--proxy-server=socks5://127.0.0.1:9050'
        ],
    });
    return browser;
}
const getNewPage = async (browser)=>{
    const page = await browser.newPage();
    return page;
}

const navigateToInstagramPage = async (page)=>{
    await page.goto(CREATE_ACCOUNT_URL).catch((err) => {
        exec('(echo authenticate \'""\'; echo signal newnym; echo quit) | nc localhost 9051', (error, stdout, stderr) => {
            if (stdout.match(/250/g).length === 3) {
                console.log('Success: The IP Address has been changed.');
            } else {
                console.log('Error: A problem occured while attempting to change the IP Address.');
            }
        })
        browser.close();
    });
}
const fillSignupInfo = async (page,{ username, password, email, name })=>{
    await page.waitForSelector('input[name="emailOrPhone"]')
    await page.type('input[name="emailOrPhone"]', email)
    await page.type('input[name="fullName"]', name)
    await page.type('input[name="username"]', username)
    await page.type('input[name="password"]', password)
    await page.click('button[type=submit]')
}

const fillBirthdayPage = async (page)=>{
    await page.waitForSelector('select[title="Month:"]')

    await page.click('select[title="Month:"]')
    await page.select('select[title="Month:"]','5')

    await page.click('select[title="Day:"]')
    await page.select('select[title="Day:"]','15')

    await page.click('select[title="Year:"]')
    await page.select('select[title="Year:"]','1980')
    
    await page.click('button[type="button"]')
    await page.waitFor(4000)
}

const closePopupConfirmation = async(page)=>{
    await page.waitForSelector('div[role="presentation"]')
    await page.evaluate(() => {
        document.querySelector('svg[aria-label="Close"]').parentElement.parentElement.click();
        for(var i=0;i<document.querySelectorAll('button[type="button"]').lenght;i++){
            console.log(document.querySelectorAll('button[type="button"]')[i].textContent)
        }
        setTimeout(function(){
            for(let l =0;l<document.querySelectorAll('button[type="button"]').length;l++){
                if(document.querySelectorAll('button[type="button"]')[l].textContent =="Next"){
                    document.querySelectorAll('button[type="button"]')[l].click()}
                }
            },2000)
     });
    await page.waitForSelector('input[aria-label="Confirmation Code"]');
}

const ig = new IgApiClient();
init();


