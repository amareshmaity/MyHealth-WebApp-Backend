// auth service map (it is basically a hash map)
// it is used to create session cookies for a particular user and browser will store it
// it is also used to get user information to verify login information

const sessionIdToUserMap = new Map();

// funciton to set user and session id
function setUser(id, user){
    sessionIdToUserMap.set(id, user);
}

// function to get user via session id from sessionIdToUserMap
function getUser(id){
    return sessionIdToUserMap.get(id);
}

module.exports = {
    setUser,
    getUser,
}