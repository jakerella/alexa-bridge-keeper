'use strict';

let router = require('express').Router(),
    questions = require('../config/questions.json'),
    verify = require('./verify'),
    app;

module.exports = function(expressApp) {
    app = expressApp;

    router.post('/', verify, function(req, res, next) {
        console.log('New request for the bridge keeper from ', req.body.session.user.userId);

        if (req.body.request.type === 'LaunchRequest') {

            return res.json(stopTravelerAndAskName());

        } else if (req.body.request.type === 'IntentRequest' &&
                   req.body.request.intent.name === 'Cross') {

            return res.json(stopTravelerAndAskName());

        } else if (req.body.request.type === 'IntentRequest' &&
                   req.body.request.intent.name === 'GiveAnswer') {

            return res.json(respondToAnswer(
                req.body.session.attributes.question,
                req.body.request.intent.slots.Answer.value
            ));

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
                    ssml: 'What <break time="1s"/> is your quest?'
                },
                shouldEndSession: false
            }
        };
    } else if (questionId === 'quest') {
        let nextQuestion = Math.floor(Math.random() * questions.length);
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
    if (questionId === 'name') {
        return answer.test(/\b(lancelot)|(robin)|(gallahad)|(arthur)\b/);
    } else if (questionId === 'quest') {
        return answer.test(/\bgrail\b/);
    } else {
        let question = questions[Number(questionId)];
        if (!question) {
            return false;
        } else {
            let re = new RegExp(question.answer);
            return answer.toLowerCase().test(re);
        }
    }
}
