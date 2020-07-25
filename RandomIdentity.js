const cheerio = require('cheerio')
const axios = require('axios')

const RandomIdentity = async (country) => {
	try {
		let gender = choose(["male", "female"])
		let url = "https://www.fakenamegenerator.com/gen-" + gender + "-us-" + country + ".php";
		const html = await axios.get(url);
		const $ = await cheerio.load(html.data);
		let identity = $('div[class=address]').find('h3').text();
		let birthday = $($('div[class=extra]').find('dl[class=dl-horizontal]')[4], 'dd').text();
		// first regex removes carriage return and second removes extra spaces
		birthday = birthday.replace(/[\n\r]+/g, '').replace(/\s{2,10}/g, ' ');

		return { identity, gender, birthday }
	}
	catch (e) {
		console.error('Error while getting random identity from fakenamegenerator', e);
	}
}

const choose = (choices) => {
	let index = Math.floor(Math.random() * choices.length);
	return choices[index];
}

module.exports = RandomIdentity;
