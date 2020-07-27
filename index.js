const Config = require('./config');
const browserBot = require('./bots/browserBot');
const requestBot = require('./bots/requestBot');


process.on('unhandledRejection', (error, promise) => {
    console.log(' Oh Lord! We forgot to handle a promise rejection here: ', promise);
    console.log(' The error was: ', error);
});

const init = async () => {
    try {
        if (Config.bot_type == 2) {
            requestBot.start();
        } else {
            browserBot.start();
        }
    } catch (e) {
        console.log('init error', e)
    }

};

init();


