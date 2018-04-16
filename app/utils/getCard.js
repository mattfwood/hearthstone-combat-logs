const cards = require('../data/compiledCardData');

const getCard = id => {
  const card = cards.find(card => card.cardId === id);

  console.log(card);
};

getCard('FP1_020');
