'use strict';

const Alexa = require('ask-sdk');
const skillBuilder = Alexa.SkillBuilders.standard();
const Axios = require('axios')

const backtimer = require('./backtimer.js')
const speechResponses = require('./speechresponses')
const sessionHandler = require('./sessionhandler')

const SKILL_NAME = 'Backtimer';
const HELP_MESSAGE = 'You can say "plan a meal", or, you can say "exit"... What can I help you with?';
const HELP_REPROMPT = 'What can I help you with?';
const STOP_MESSAGE = 'Goodbye!';
const UNHANDLED_MESSAGE = "I didn't understand that instruction. Did you mean to say, Add, before giving an ingredient name?"
const REMINDER_ENDPOINT = '/v1/alerts/reminders'


// const callAPI = (token, url, payload = null) => new Promise((resolve, reject) => {
//   if (!token) reject(new Error('Error calling URL - user is not logged in'))
//   if (!url) reject(new Error('Error calling URL - missing URL string'))
//   let config = {
//     url: url,
//     method: 'post',
//     headers: {'Authorization': 'bearer ' + token, 
//               'Content-Type': 'application/json'},
//     data: payload
//   }
//   console.log('API Call Configuration -->', config)
//   Axios.request(config)
//     .then((response) => resolve(response))
//     .catch((error) => reject(error))
// })



// const SetAlarmHandler = {
//     canHandle(handlerInput) {
//         const request = handlerInput.requestEnvelope.request;
//         return request.type === 'LaunchRequest'
//           || (request.type === 'IntentRequest'
//           && request.intent.name === 'setAlarm')
//     },
//     handle(handlerInput) {
//       let currentTime = new Date();
//       let useBody = {
//           requestTime : currentTime.toISOString(),
//           trigger: {
//                type : "SCHEDULED_RELATIVE",
//                offsetInSeconds : 30,
//           },
//           alertInfo: {
//                spokenInfo: {
//                    content: [{
//                        locale: "en-US", 
//                        text: "test the reminder function"
//                    }]
//                }
//            },
//            pushNotification : {                            
//                 status : "ENABLED"         
//            }
//         }
//       let endpoint = handlerInput.requestEnvelope.context.System.apiEndpoint  
      
//       callAPI(handlerInput.requestEnvelope.context.System.apiAccessToken, endpoint + REMINDER_ENDPOINT, useBody)
//         .then(apiResult => {
//           console.log('successfully added reminder', apiResult)
//         })
//         .catch(apiErr => {
//           console.log('oh bugger - an error occurred ->', apiErr)
//         })

//       return handlerInput.responseBuilder
//         .speak('I have attempted to add a reminder')
//         .withSimpleCard(SKILL_NAME, 'reminder requested')
//         .getResponse();
//     }
// };


const SetBacktimerHandler = {
  canHandle(handlerInput) {
    let request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && ['SetMealTimer','SetBackTimer'].includes(request.intent.name);
  },
  handle(handlerInput) {
    let request = handlerInput.requestEnvelope.request;
    let sessionAttributes = sessionHandler.getSession(handlerInput)
    
    sessionAttributes
      .reset(request.intent.name)
      .addBreadcrumb('Init')
    
    let speechText = speechResponses(sessionAttributes.intentType).parse('REQ_ACTIVITY_NAME', ['first'])

    sessionHandler.updateSession(handlerInput, sessionAttributes)

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard(SKILL_NAME, speechText)
      .getResponse();
  }
}


const ActivityTypeHandler = {
  canHandle(handlerInput) {
    let request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && request.intent.name === 'ActivityTypeIntent'
  },
  handle(handlerInput) {
    let request = handlerInput.requestEnvelope.request
    let sessionAttributes = sessionHandler.getSession(handlerInput)
    let intentSpeechResponses = speechResponses(sessionAttributes.intentType)
    let activityFound = request.intent.slots.ActivityType.value
  
    sessionAttributes
      .updateActivity(activityFound)
      .addBreadcrumb(`Activity Type`)
    
    sessionHandler.updateSession(handlerInput, sessionAttributes)

    let speechText = intentSpeechResponses.parse('REQ_ACTIVITY_DURATION', [activityFound])

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard(SKILL_NAME, speechText)
      .getResponse()
  }
}


const ActivityDurationHandler = {
  canHandle(handlerInput) {
    let request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && request.intent.name === 'ActivityDurationIntent'
  },
  handle(handlerInput) {
    let request = handlerInput.requestEnvelope.request
    let sessionAttributes = sessionHandler.getSession(handlerInput)
    let intentSpeechResponses = speechResponses(sessionAttributes.intentType)
    let minutesFound = request.intent.slots.Minutes.value
  
  sessionAttributes 
    .updateActivity(null, minutesFound)
    .addBreadcrumb(`Duration`)
  
  sessionHandler.updateSession(handlerInput, sessionAttributes)
  
  let {name, duration} = sessionAttributes.getNewest()
  let speechText = intentSpeechResponses.parse('REQ_ACTIVITY_CONFIRMATION', [name, duration]) + 
                    intentSpeechResponses.parse('REQ_ADD_ANOTHER_PROMPT') 
  
    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard(SKILL_NAME, speechText)
      .getResponse()
  }
}


const YesHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && request.intent.name === 'AMAZON.YesIntent';
  },
  handle(handlerInput) {
    let request = handlerInput.requestEnvelope.request
    let sessionAttributes = sessionHandler.getSession(handlerInput)
    let intentSpeechResponses = speechResponses(sessionAttributes.intentType)
    let previousBreadcrumb = sessionAttributes.getNewestBreadcrumb() 
    let speechText = 'placeholder'
  
    if (previousBreadcrumb === 'Duration') {
      sessionAttributes
        .addBreadcrumb(`Add Another Activity Type`)
        .addActivity()
      
      speechText = intentSpeechResponses.parse('REQ_ACTIVITY_NAME', ['next'])
    } else {
      // sessionAttributes.addBreadcrumb(`Confirm Reminders`)
      // speechText = speechResponses(sessionAttributes.intentType).parse('TELL_LONGEST_ACTIVITY', ['test activity', '5'])      
    }
    
    sessionHandler.updateSession(handlerInput, sessionAttributes)
  
    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard(SKILL_NAME, speechText)
      .getResponse();
  }
}


const NoHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && request.intent.name === 'AMAZON.NoIntent';
  },
  handle(handlerInput) {
    let request = handlerInput.requestEnvelope.request
    let sessionAttributes = sessionHandler.getSession(handlerInput)
    let intentSpeechResponses = speechResponses(sessionAttributes.intentType)
    let previousBreadcrumb = sessionAttributes.getNewestBreadcrumb() 
    let speechText = 'placeholder'
  
    if (previousBreadcrumb === 'Duration') {
      sessionAttributes
        .addBreadcrumb(`No More Activity Types`)
        
      let schedule = backtimer(sessionAttributes.activityList)
      let longest = schedule.longestActivity
      
      console.log(schedule)

      speechText =  intentSpeechResponses.parse('TELL_LONGEST_ACTIVITY', [longest.name, longest.duration])
      if (schedule.activities.length > 1) {
        let second = schedule.activities[1]
        speechText += intentSpeechResponses.parse('TELL_SECOND_STARTER', [longest.name, second.countdown, second.name])
      }
      if (schedule.activities.length > 2) {
        for (let i = 2; i < schedule.activities.length; i++) {
          let current = schedule.activities[i]
          speechText += intentSpeechResponses.parse('TELL_SUBSEQUENT_STARTER', [current.countdown, current.name])
        }
      }
      speechText += intentSpeechResponses.parse('TELL_FOOTER')
      speechText += intentSpeechResponses.parse('REQ_SET_REMINDERS')
    } else {
      // sessionAttributes.addBreadcrumb(`Confirm Reminders`)
      // speechText = speechResponses(sessionAttributes.intentType).parse('TELL_LONGEST_ACTIVITY', ['test activity', '5'])      
    }
    
    sessionHandler.updateSession(handlerInput, sessionAttributes)
  
    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard(SKILL_NAME, speechText)
      .getResponse();
  }
}




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

const UnhandledHandler = {
  canHandle(handlerInput) {
    return true
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(UNHANDLED_MESSAGE)
      .reprompt(UNHANDLED_MESSAGE)
      .getResponse();
  },
};


exports.handler = skillBuilder
  .addRequestHandlers(
    SetBacktimerHandler,
    ActivityTypeHandler,
    ActivityDurationHandler,
    YesHandler,
    NoHandler,
    HelpHandler,
    ExitHandler,
    SessionEndedRequestHandler, 
    UnhandledHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();

