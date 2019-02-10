"use strict";
const request = require('request-promise');
const messages = require('elasticio-node').messages;

const API_BASE_URI = 'https://petstore.elastic.io/v2';

exports.process = processAction;

/**
 * Executes the action's logic by sending a request to the Petstore API and emitting response to the platform.
 * The function returns a Promise sending a request and resolving the response as platform message.
 *
 * @param msg incoming messages which is empty for triggers
 * @param cfg object to retrieve triggers configuration values, such as apiKey and pet status
 * @returns promise resolving a message to be emitted to the platform
 */
function processAction(msg, cfg) {

    const requestOptions = {
        uri: `${API_BASE_URI}`,
        headers: {
            '': cfg
        },
        body: pet,
        json: true
    };

    // return the promise that sends a request to the Petstore API
    return request.post(requestOptions)
        .then((response) => messages.newMessageWithBody(response));
}