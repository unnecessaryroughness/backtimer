'use strict';

const Alexa = require('ask-sdk');
const skillBuilder = Alexa.SkillBuilders.standard();

const backtimer = require('./lib/backtimer.js')
const speechResponses = require('./lib/speechresponses')
const sessionHandler = require('./lib/sessionhandler')
const alarmHandler = require('./lib/alarmhandler')

const SKILL_NAME = 'Backtimer';
const HELP_MESSAGE = 'You can ask backtimer to "plan a meal", or, you can ask backtimer to "plan this"... What can I help you with?';
const HELP_REPROMPT = 'What can I help you with?';
const STOP_MESSAGE = 'Goodbye!';
const UNHANDLED_MESSAGE = "I didn't understand that instruction. Did you mean to say, Add, before giving an ingredient name?"


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
  
    switch (previousBreadcrumb) {
      case 'Duration':
        sessionAttributes
          .addBreadcrumb(`Add Another Activity Type`)
          .addActivity()
          speechText = intentSpeechResponses.parse('REQ_ACTIVITY_NAME', ['next'])
          break;

      case 'No More Activity Types':
        sessionAttributes.addBreadcrumb(`Confirm Reminders`)
        speechText = speechResponses(sessionAttributes.intentType).parse('REQ_SET_REMINDERS_NOW')      
        break;
    
      default: 
        speechText = "previous breadcrumb was " + previousBreadcrumb 
        break;
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
  
    switch (previousBreadcrumb) {
      case 'Duration':
        sessionAttributes
          .addBreadcrumb(`No More Activity Types`)
          
        let schedule = backtimer(sessionAttributes.activityList)
        sessionAttributes.activityList = schedule.activities
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
        break;

      case 'No More Activity Types':
        sessionAttributes.addBreadcrumb(`Say Goodbye`)
        speechText = speechResponses(sessionAttributes.intentType).parse('SAY_GOODBYE')      
        break;
    
      default: 
        speechText = "You said No out of context. previous breadcrumb was " + previousBreadcrumb 
        break;
    }
    
    sessionHandler.updateSession(handlerInput, sessionAttributes)
  
    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard(SKILL_NAME, speechText)
      .getResponse();
  }
}


const NowHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && request.intent.name === 'NowIntent';
  },
  handle(handlerInput) {
    // call function to set timers
    return new Promise((resolve, reject) => {
      let request = handlerInput.requestEnvelope.request
      let sessionAttributes = sessionHandler.getSession(handlerInput)
      let intentSpeechResponses = speechResponses(sessionAttributes.intentType)
      let previousBreadcrumb = sessionAttributes.getNewestBreadcrumb() 
      let speechText = 'now placeholder'
      sessionAttributes.addBreadcrumb(`Set Alarms Immediately`)

      let {apiEndpoint, apiAccessToken} = handlerInput.requestEnvelope.context.System
  
      alarmHandler(sessionAttributes.activityList, apiEndpoint, apiAccessToken)
        .then(alarms => {
          console.log(JSON.stringify(alarms, null, 2))
          speechText = speechResponses(sessionAttributes.intentType).parse('CFM_REMINDERS_SET')  
          speechText += speechResponses(sessionAttributes.intentType).parse('SAY_GOODBYE')  
          resolve(handlerInput.responseBuilder
            .speak(speechText)
            .withSimpleCard(SKILL_NAME, speechText)
            .getResponse())
        })
        .catch(err => {
          console.log('in the catch routine...')
          console.log(JSON.stringify(err, null, 2))
          speechText = speechResponses(sessionAttributes.intentType).parse('CFM_REMINDERS_FAILED')  
          speechText += speechResponses(sessionAttributes.intentType).parse('SAY_GOODBYE')  
          resolve(handlerInput.responseBuilder
            .speak(speechText)
            .withSimpleCard(SKILL_NAME, speechText)
            .getResponse())
        })
    })
  }
}


const LaterHandler = {
  // write data to DDB that can be recovered later
}

const StartHandler = {
  // retrieve data from DDB
  // call function to set timers
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
      .speak('Sorry, an error occurred. Trust me, you don\'t want to know the details.')
      .reprompt('Sorry, an error occurred.')
      .getResponse();
  },
};

const UnhandledHandler = {
  // Modify this to understand breadcrumbs and offer context sensitive help
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
    NowHandler,
    HelpHandler,
    ExitHandler,
    SessionEndedRequestHandler, 
    UnhandledHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();

