import React from 'react';
const base64 = require('base-64');

getHeader(auth_user) {
  let headers = new Headers();
  headers.append("Authorization", "Basic " + base64.encode(auth_user.username+":"+auth_user.password));
  return headers
}

/**
 * returns
 * @param setState setState function from calling class
 * @param auth_user User type, has username and password
 * @param target_user User type, has username
 * @
 */
// auth_user and target_user are user instances, not string
getFollowerInfo(setState, auth_user, target_user, following) {
    console.log(`Fetching follw`+{following?`er`:`ing`}+` info of `+ target_user.username);

    const headers = getHeader(auth_user);

    const query = following? '/following': '/followers'
    fetch(`https://api.github.com/users/` + target_user.username + query, {
        headers: headers
      })
    .then(response => response.json())
    .then(
        users => {
            for (const u in users){
              this._isFollowing(users[u].login, u)
              users[u].follow = true
            }
            this.setState({
                username: username,
                users: users,
                refreshing: false,
            });
        }
    );
}
