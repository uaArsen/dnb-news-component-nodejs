"use strict";
const request = require('request-promise');
const messages = require('elasticio-node').messages;
const UPDATE_TIME = 300000;

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

    let obtain_datetime = cfg.obtain_datetime;
    if (Math.abs(new Date() - obtain_datetime <= UPDATE_TIME)) {
      updateToken(cfg);
    }
    let token = cfg.token;
    const requestOptions = {
        uri: createURIFromCfg(cfg),
        headers: {
            'Authorization': token
        },
        body: createBodyFromCfg(cfg),
        json: true
    };

    // return the promise that sends a request to the Petstore API
    return request.get(requestOptions)
        .then((response) => messages.newMessageWithBody(response));
}

function createURIFromCfg(cfg) {
    return 'https://direct.dnb.com/' + cfg.version + '/organizations/' + cfg.DUNS + '/products/' + cfg.prdofuctID;
}

function createBodyFromCfg(cfg) {

    return {
        'ApplicationTransactionID': cfg.ApplicationTransactionID,
        'TransactionTimestamp': cfg.TransactionTimestamp,
        'SubmittingOfficeID': cfg.SubmittingOfficeID,
        'TradeUpIndicator': cfg.TradeUpIndicator,
        'PublishedFromDate': cfg.PublishedFromDate,
        'PublishedToDate': cfg.PublishedToDate,
        'NewsCategoryText-n': cfg.NewsCategoryTexts,
        'SocialMediaPlatformName-n': cfg.SocialMediaPlatformNames,
        'ArchiveProductOptOutIndicator': cfg.ArchiveProductOptOutIndicator,
        'ExtendArchivePeriodIndicator': cfg.ExtendArchivePeriodIndicator,
        'PortfolioAssetContainerID': cfg.PortfolioAssetContainerID,
        'CustomerReferenceText-n': cfg.CustomerReferenceTexts,
        'CustomerBillingEndorsementText': cfg.CustomerBillingEndorsementText
    };
}

function updateToken(cfg) {

    const requestOptions = {
        uri: 'https://direct.dnb.com/Authentication/V2.0/',
        headers: {
            'x-dnb-user': cfg.username,
            'x-dnb-pwd': cfg.password
        }
    };
    return request.post(requestOptions).then(
        function (parsedBody) {
            let token = parsedBody.AuthenticationDetail.Token;
            if (!token) {
                throw new Error('Failed to obtain token, response from dnb: ' + parsedBody.toString());
            }
            cfg.token = token;
            cfg.obtain_datetime = new Date();
        });
}

