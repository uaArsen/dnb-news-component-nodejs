"use strict";
const request = require('request-promise');

module.exports = verify;

/**
 * Executes the verification logic by sending a simple to the Petstore API using the provided apiKey.
 * If the request succeeds, we can assume that the apiKey is valid. Otherwise it is not valid.
 *
 * @param credentials object to retrieve apiKey from
 *
 * @returns Promise sending HTTP request and resolving its response
 */
function verify(credentials) {

    // access the value of the apiKey field defined in credentials section of component.json
    const username = credentials.username;
    const password = credentials.password;

    if (!username) {
        throw new Error('DNB Username is missing');
    }

    if (!password) {
        throw new Error('DNB Password is missing');
    }


    // sending a request to the most simple endpoint of the target API
    const requestOptions = {
        uri: 'https://direct.dnb.com/Authentication/V2.0/',
        headers: {
            'x-dnb-user': username,
            'x-dnb-pwd': password
        }
    };

    // if the request succeeds, we can assume the api key is valid
    return request.post(requestOptions).then(
        function (parsedBody) {
            let token = parsedBody.AuthenticationDetail.Token;
            if (!token) {
                throw new Error('Failed to obtain token, response from dnb: ' + parsedBody.toString());
            }
            credentials.token = token;
            credentials.obtain_datetime = new Date();
        }
    )
}