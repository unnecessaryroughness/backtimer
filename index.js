'use strict';

const Alexa = require('ask-sdk');
const skillBuilder = Alexa.SkillBuilders.standard();
const Axios = require('axios')

const SKILL_NAME = 'Test Alarm';
const HELP_MESSAGE = 'You can say set alarm, or, you can say exit... What can I help you with?';
const HELP_REPROMPT = 'What can I help you with?';
const STOP_MESSAGE = 'Goodbye!';

const REMINDER_ENDPOINT = '/v1/alerts/reminders'


const callAPI = (token, url, payload = null) => new Promise((resolve, reject) => {
  if (!token) reject(new Error('Error calling URL - user is not logged in'))
  if (!url) reject(new Error('Error calling URL - missing URL string'))
  let config = {
    url: url,
    method: 'post',
    headers: {'Authorization': 'bearer ' + token, 
              'Content-Type': 'application/json'},
    data: payload
  }
  console.log('API Call Configuration -->', config)
  Axios.request(config)
    .then((response) => resolve(response))
    .catch((error) => reject(error))
})



const SetAlarmHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'LaunchRequest'
          || (request.type === 'IntentRequest'
          && request.intent.name === 'setAlarm')
    },
    handle(handlerInput) {
      let currentTime = new Date();
      let useBody = {
          requestTime : currentTime.toISOString(),
          trigger: {
               type : "SCHEDULED_RELATIVE",
               offsetInSeconds : 30,
          },
          alertInfo: {
               spokenInfo: {
                   content: [{
                       locale: "en-US", 
                       text: "test the reminder function"
                   }]
               }
           },
           pushNotification : {                            
                status : "ENABLED"         
           }
        }
      let endpoint = handlerInput.requestEnvelope.context.System.apiEndpoint  
      
      callAPI(handlerInput.requestEnvelope.context.System.apiAccessToken, endpoint + REMINDER_ENDPOINT, useBody)
        .then(apiResult => {
          console.log('successfully added reminder', apiResult)
        })
        .catch(apiErr => {
          console.log('oh bugger - an error occurred ->', apiErr)
        })

      return handlerInput.responseBuilder
        .speak('I have attempted to add a reminder')
        .withSimpleCard(SKILL_NAME, 'reminder requested')
        .getResponse();
    }
};

const HelpHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(HELP_MESSAGE)
      .reprompt(HELP_REPROMPT)
      .getResponse();
  },
};

const ExitHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && (request.intent.name === 'AMAZON.CancelIntent'
        || request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(STOP_MESSAGE)
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak('Sorry, an error occurred.')
      .reprompt('Sorry, an error occurred.')
      .getResponse();
  },
};

exports.handler = skillBuilder
  .addRequestHandlers(
    SetAlarmHandler,
    HelpHandler,
    ExitHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();

