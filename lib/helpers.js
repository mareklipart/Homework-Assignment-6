const crypto = require('crypto');
const config = require('./config');
const https = require('https');
const querystring = require('querystring');

//---------------- hash the string

const helpers = {};

helpers.hash = string => {
    if (typeof(string) == 'string' && string.length > 0) {
        const hushedString = crypto.createHmac('sha256', config.hashingSecret).update(string).digest('hex');
        return hushedString;
    } else {
        return false;
    };
};

//---------------- parse json to object

helpers.parseJsonToObject = str => {
    try {
        const obj = JSON.parse(str);
        return obj;
    } catch (e) {
        return {};
    }
};

//---------------- create random string

helpers.createNewString = strLength => {
    strLength = typeof(strLength) == 'number' && strLength > 0 ? strLength : false;

    if (strLength) {
        const possibleCharacters = 'abcdefghijklmnopqrstuwxyz0123456789';
        let str = '';
        for (i=1; i<=strLength; i++) {
            const randomChar = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
            str += randomChar;
        };
        return str;
    } else {
        return false;
    };
};

//---------------- send email via mailgun

helpers.sendMailgun = (email, text, callback) => {
    
    email = typeof(email) == 'string' && email.trim().length > 0 ? email.trim() : false;
    text = typeof(text) == 'string' && text.trim().length > 0 ? text : false;

    if(email && text) {

        const payload = {
            'from': config.mailgun.dns,
            'to': email,
            'subject': 'order receipt',
            'text': text
        };

        const stringPayload = querystring.stringify(payload);
 
        const requestDetails = {
            'protocol': 'https:',
            'method': 'POST',
            'hostname': 'api.mailgun.net',
            'path': `/v3/${config.mailgun.domainName}.mailgun.org/messages`,
            'auth': `${config.mailgun.authName}:${config.mailgun.authKey}`,
            'headers': {'Content-Type': 'application/x-www-form-urlencoded'}
        };

        const req = https.request(requestDetails, res => {

            const status = res.statusCode;

            if (status == 200 || status == 201) {
                callback(false);
            } else {
                callback('Status code returned was ' + status);
            };
        });

        req.on('error', e => {
            callback(e);
        });

        req.write(stringPayload);
        req.end();

    } else {
        callback('Given parameters are missing or invalid');
    };
};

//---------------- create order charge with stripe

helpers.createCharge = (amount, callback) => {
    
    amount = typeof(amount) == 'number' && amount > 0.5 ? amount : false;

    if(amount) {

        const requestDetails = {
            'amount': amount,
            'currency': 'usd',
            'protocol': 'https:',
            'hostname': 'api.stripe.com',
            'path': '/v1/charges',
            'source': 'tok_mastercard',
            'auth': config.stripe.api_key,
            'headers': {'Content-Type': 'application/x-www-form-urlencoded'}
        };

        const req = https.request(requestDetails, res => {

            const status = res.statusCode;

            if (status == 200 || status == 201) {
                callback(false);
            } else {
                callback('Status code returned was ' + status);
            };
        });

        req.on('error', e => {
            callback(e);
        });

        req.end();

    } else {
        callback('Given parameters are missing or invalid');
    };
};

//---------------- validate an email

helpers.validateEmail = email => {

    const pattern = '^[a-z0-9](\.?[a-z0-9_-]){0,}@[a-z0-9-]+\.([a-z]{1,6}\.)?[a-z]{2,6}$';

    if(email.match(pattern) !== null ) {
        return true;
    };
};


module.exports = helpers;