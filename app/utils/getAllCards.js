const axios = require('axios');
const fs = require('fs');

const cardData = require('../data/allCardData');

const getAllCards = () => {
  axios.defaults.headers.common['X-Mashape-Key'] =
    'hiDNPnZIZ5mshn7mb4HvG6dtL0NZp1P4wUujsnE9Ch9dOsWVF2';
  axios
    .get('https://omgvamp-hearthstone-v1.p.mashape.com/cards?collectible=1')
    .then(res => {
      console.log(res);
      return fs.writeFile('allCardData.json', JSON.stringify(res.data), (err) => {
        if (err) throw err;
        return 'File saved!';
      });
    })
    .catch(error => {
      console.error(error);
      throw new Error(error);
    });
};

const compileCardGroups = () => {
  const compiledCards = [];

  Object.keys(cardData).forEach(key => {
    compiledCards.push(...cardData[key]);
  });

  fs.writeFile('compiledCardData.js', `module.exports = ${JSON.stringify(compiledCards)}`, (err) => {
    if (err) throw err;
    return 'Cards Compiled!';
  });
};

// getAllCards();
compileCardGroups();
