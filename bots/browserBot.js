const puppeteer = require('puppeteer');
const exec = require('child_process').exec;
const NewAccount = require('../helpers/accountGenerator');
const { exception } = require('console');


const start = async (newRandomAccount = null) => {
    if(!newRandomAccount){
        newRandomAccount = await NewAccount().catch((err) => {
           console.log('ERROR from new accounts', err);
       });
   }
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
    try{
        const browser = await puppeteer.launch({
            headless: false,
            args: [
                '--proxy-server=socks5://127.0.0.1:9050'
            ],
        });
        return browser;
    }catch(e){
        throw new exception(e.message);
    }
    
}
const getNewPage = async (browser)=>{
    try{
        const page = await browser.newPage();
        return page;
     }catch(e){
        throw new exception(e.message);
    }
}

const navigateToInstagramPage = async (page)=>{
    try{
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
        return true;
    }catch(e){
        throw new exception(e.message);
    }
    
}
const fillSignupInfo = async (page,{ username, password, email, name })=>{
    try {
        await page.waitForSelector('input[name="emailOrPhone"]')
        await page.type('input[name="emailOrPhone"]', email)
        await page.type('input[name="fullName"]', name)
        await page.type('input[name="username"]', username)
        await page.type('input[name="password"]', password)
        await page.click('button[type=submit]')
        return true;

    } catch(e){
        throw new exception(e.message);
    }
}

const fillBirthdayPage = async (page)=>{
    try {
        await page.waitForSelector('select[title="Month:"]')

        await page.click('select[title="Month:"]')
        await page.select('select[title="Month:"]','5')
    
        await page.click('select[title="Day:"]')
        await page.select('select[title="Day:"]','15')
    
        await page.click('select[title="Year:"]')
        await page.select('select[title="Year:"]','1980')
        
        await page.click('button[type="button"]')
        await page.waitFor(4000)
        return true;
    } catch(e){
        throw new exception(e.message);
    }
   
}

const closePopupConfirmation = async(page)=>{
    try {
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
        await page.waitForSelector('input[aria-label="Confirmation Code"]')
        return true;
    
    } catch(e){
        throw new exception(e.message);
    }
}


exports.start = start;