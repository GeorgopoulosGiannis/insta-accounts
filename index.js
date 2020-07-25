const NewAccount = require('./accountGenerator');

const { IgApiClient } = require("instagram-private-api")

const newAcc = NewAccount();

const ig = new IgApiClient();

ig.state.generateDevice();
