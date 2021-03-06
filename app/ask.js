'use strict';

let router = require('express').Router(),
    questions = require('../config/questions.json'),
    verify = require('./verify'),
    app;

module.exports = function(expressApp) {
    app = expressApp;

    router.post('/', verify, function(req, res, next) {
        console.log('New request for the bridge keeper:\n', req.body);

        if (req.body.request.type === 'LaunchRequest') {

            res.json(stopTravelerAndAskName());

        } else if (req.body.request.type === 'IntentRequest' &&
                   req.body.request.intent.name === 'Cross') {

            res.json(stopTravelerAndAskName());

        } else if (req.body.request.type === 'IntentRequest' &&
                   req.body.request.intent.name === 'GiveAnswer') {

            res.json(respondToAnswer(
                req.body.session.attributes.question,
                req.body.request.intent.slots.Answer.value
            ));

        } else if (req.body.request.type === 'SessionEndedRequest') {

            if (req.body.request.reason === 'ERROR') {
                console.error('Alexa ended the session due to an error');
            }
            // Per Alexa docs, we shouldn't send ANY response here... weird.

        } else {
            console.error('Intent not implemented: ', req.body);
            res.status(504).json({ message: 'Intent Not Implemented' });
        }
    });

    return router;
};

function stopTravelerAndAskName() {
    return  {
        version: app.get('version'),
        sessionAttributes: {
            question: 'name'
        },
        response: {
            outputSpeech: {
                type: 'SSML',
                ssml: '<speak>Stop! Who would cross the Bridge of Death must answer me these questions three, ere the other side he see. What <break time="1s"/> is your name?</speak>'
            },
            shouldEndSession: false
        }
    };
}

function respondToAnswer(questionId, answer) {
    if (!determineCorrectness(questionId, answer)) {

        return {
            version: app.get('version'),
            sessionAttributes: {},
            response: {
                outputSpeech: {
                    type: 'SSML',
                    ssml: '<speak>Incorrect! <break time="1s"/> You will now be cast into the gorge of eternal peril.</speak>'
                },
                shouldEndSession: true
            }
        };

    } else if (questionId === 'name') {

        return {
            version: app.get('version'),
            sessionAttributes: {
                question: 'quest'
            },
            response: {
                outputSpeech: {
                    type: 'SSML',
                    ssml: '<speak>What <break time="1s"/> is your quest?</speak>'
                },
                shouldEndSession: false
            }
        };

    } else if (questionId === 'quest') {

        let nextQuestion = Math.floor(Number('0.' + require('crypto').randomBytes(10).toString('hex').replace(/[^0-9]/g, '')) * questions.length);

        return {
            version: app.get('version'),
            sessionAttributes: {
                question: nextQuestion
            },
            response: {
                outputSpeech: {
                    type: 'SSML',
                    ssml: '<speak>' + questions[nextQuestion].question + '</speak>'
                },
                shouldEndSession: false
            }
        };

    } else {

        return {
            version: app.get('version'),
            sessionAttributes: {},
            response: {
                outputSpeech: {
                    type: 'SSML',
                    ssml: '<speak>Right. <break time="1s"/> Off you go.</speak>'
                },
                shouldEndSession: true
            }
        };

    }
}

function determineCorrectness(questionId, answer) {
    console.log('Did they answer correctly?', questionId, answer);

    if (questionId === 'name') {
        return /\b(lancelot)|(robin)|(gallahad)|(arthur)\b/.test(answer.toLowerCase());
    } else if (questionId === 'quest') {
        return /\bgrail\b/.test(answer.toLowerCase());
    } else {
        let question = questions[Number(questionId)];
        if (!question) {
            console.log('Could not find question.');
            return false;
        } else {
            let re = new RegExp(question.answer);
            console.log('Random question regex:', re);
            return re.test(answer.toLowerCase());
        }
    }
}
