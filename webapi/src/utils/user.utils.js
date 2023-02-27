function hideUserConfidentialData(user, needToken) {
    delete user._id;
    delete user.password;
    delete user.last_login;
}

module.exports = {
    hideUserConfidentialData
};