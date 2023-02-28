function hideCardMongoData(card) {
    delete card._id;
}

module.exports = {
    hideCardMongoData
};