function hideUserConfidentialData(user) {
    delete user._id;
    delete user.password;
    delete user.last_login;
    delete user.drop_points;
    delete user.last_drop_points_update;
}

module.exports = {
    hideUserConfidentialData
};