var Promise = require("promise");
var request = require("request");
var cheerio = require("cheerio");
var fs = require("fs");

var promiseList = [];
var indivPromisesList = [];
var hotelsList = [];
var scrapingRound = 1;
// var proxyUrl = 'https://lit-plateau-31117.herokuapp.com/';

function createPromise() {
  let url = "https://www.relaischateaux.com/fr/site-map/etablissements";
  promiseList.push(fillHotelsList(/*proxyUrl + */ url));
  console.log("Page of french Relais et Chateaux hotels added to the list");
}

function createIndividualPromises() {
  return new Promise(function(resolve, reject) {
    if (scrapingRound === 1) {
      for (var i = 0; i < Math.trunc(hotelsList.length / 2); i++) {
        let hotelURL = hotelsList[i].url;
        indivPromisesList.push(fillHotelInfo(/*proxyUrl + */ hotelURL, i));
        console.log("Added url of " + i + "th hotel to the promises list");
      }
      resolve();
      scrapingRound++;
    } else if (scrapingRound === 2) {
      for (i = hotelsList.length / 2; i < Math.trunc(hotelsList.length); i++) {
        let hotelURL = hotelsList[i].url;
        indivPromisesList.push(fillHotelInfo(/*proxyUrl + */ hotelURL, i));
        console.log("Added url of " + i + "th hotel to the promises list");
      }
      resolve();
      scrapingRound++;
    }
  });
}

function fillHotelsList(url) {
  //Fills hotelsList with a Hotel object with their URL, name and chefname
  return new Promise(function(resolve, reject) {
    request(url, function(err, res, html) {
      if (err) {
        console.log(err);
        return reject(err);
      } else if (res.statusCode !== 200) {
        //200 means request succesfull
        err = new Error("Unexpected status code : " + res.statusCode);
        err.res = res;
        return reject(err);
      }
      var $ = cheerio.load(html);

      $('h3:contains("France")')
        .next()
        .find("li")
        .each(function() {
          let data = $(this);
          let url = String(
            data
              .find("a")
              .first()
              .attr("href")
          );
          let name = data
            .find("a")
            .first()
            .text();
          name = name.replace(/\n/g, "");
          let chefname = String(
            data
              .find('a:contains("Chef")')
              .text()
              .split(" - ")[1]
          );
          chefname = chefname.replace(/\n/g, "");
          hotelsList.push({
            name: name.trim(),
            postalCode: "",
            chef: chefname.trim(),
            url: url,
            imageUrl: "",
            priceRange: "",
            description: "",
            address: ""
          });
        });
      resolve(hotelsList);
    });
  });
}

function fillHotelInfo(url, index) {
  //Going to the Hotel's adress to get the postal code
  return new Promise(function(resolve, reject) {
    request(url, function(err, res, html) {
      if (err) {
        console.error(err);
        return reject(err);
      } else if (res.statusCode !== 200) {
        err = new Error("Unexpected status code : " + res.statusCode);
        err.res = res;
        console.log(err.message);
        return reject(err);
      }

      const $ = cheerio.load(html);

      $('span[itemprop="postalCode"]')
        .first()
        .each(function() {
          let data = $(this);
          let pc = data.text();
          hotelsList[index].postalCode = String(pc.split(",")[0]).trim();
        });

      $(".richTextMargin")
        .first()
        .each(function() {
          let data = $(this);
          let desc = data.text();
          hotelsList[index].description = desc.trim();
        });

      $('meta[itemprop="priceRange"]')
        .first()
        .each(function() {
          let data = $(this);
          let pricerange = String(data.attr("content"));
          hotelsList[index].priceRange = pricerange;
        });

      $('span[itemprop="addressLocality"]')
        .first()
        .each(function() {
          let data = $(this);
          let address = data.text();
          hotelsList[index].address = address;
        });

      $("head")
        .find('meta[property="og:image"]')
        .first()
        .each(function() {
          let data = $(this);
          let imageurl = String(data.attr("content"));
          hotelsList[index].imageUrl = imageurl;
        });
      console.log("Added postal code and price of " + index + "th hotel");
      resolve(hotelsList);
    });
  });
}

function saveHotelsInJson() {
  return new Promise(function(resolve, reject) {
    try {
      console.log("Trying to write the hotel's JSON file");
      var jsonHotels = JSON.stringify(hotelsList);
      fs.writeFile(
        "../JSONFiles/RelaisChateaux.json",
        jsonHotels,
        function doneWriting(err) {
          if (err) {
            console.log(err);
          }
        }
      );
    } catch (error) {
      console.error(error);
    }
    resolve();
  });
}

createPromise();
var prom = promiseList[0];
prom
  .then(createIndividualPromises)
  .then(() => {
    return Promise.all(indivPromisesList);
  })
  .then(createIndividualPromises)
  .then(() => {
    return Promise.all(indivPromisesList);
  })
  .then(saveHotelsInJson)
  .then(() => {
    console.log("Successfuly saved hotels JSON file");
  });

module.exports.getHotelsJSON = function() {
  // fs.readFile("RelaisChateaux.json", 'utf8', function doneReading(error, data) {
  //     if (error) { return console.error(error) }
  //     console.log(JSON.parse(data));
  //     return JSON.parse(data);
  // });
  //Using Sync because we must be sure that the file has been read before exporting it
  return JSON.parse(fs.readFileSync("../JSONFiles/RelaisChateaux.json"));
};
