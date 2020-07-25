const cheerio = require('cheerio')
const axios = require('axios')

const RandomIdentity = async (country) =>{
	let gender = choose(["male", "female"])
	let url = "https://www.fakenamegenerator.com/gen-"+gender+"-us-"+country+".php";
	const html = await axios.get(url);
	const $ = await cheerio.load(html.data);

	// page = browser.get(URL)
	// address_div = page.soup.find(
	// "div",
	// { "class": "address" }
	// )
	// completename = address_div.find(
	// "h3"
	// )

	// extra_div = page.soup.find(
	// "div",
	// { "class": "extra" }
	// )

	// all_dl = page.soup.find_all(
	// "dl",
	// {'class':'dl-horizontal'}
	// )

	// birthday = all_dl[5].find("dd").contents[0]
	// logging.info("Birthday: {}".format(birthday))

	// return(completename.contents[0],gender, birthday)
	return $;
}

const choose = (choices)=> {
  let index = Math.floor(Math.random() * choices.length);
  return choices[index];
}

module.exports= RandomIdentity;
