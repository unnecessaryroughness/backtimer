const {configHandler, sessionHandler, speechResponses, alarmHandler} = require('./commonconstants')()
const skillName = configHandler.get('AlexaSkillSettings', 'SKILL_NAME', "[Skill Name]")

module.exports = {
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
            speechText = intentSpeechResponses.parse('REQ_ACTIVITY_NAME', ['next'])
            break;
  
        case 'No More Activity Types':
          sessionAttributes.addBreadcrumb(`Confirm Reminders`)
          speechText = intentSpeechResponses.parse('REQ_SET_REMINDERS_NOW')      
          break;
  
        case 'Confirm Alarm Schedule':
          return new Promise((resolve, reject) => {
            sessionAttributes.addBreadcrumb(`Set Alarms`)
            let {apiEndpoint, apiAccessToken} = handlerInput.requestEnvelope.context.System
        
            alarmHandler(sessionAttributes.activityList, sessionAttributes.waitSeconds, apiEndpoint, apiAccessToken)
              .then(alarms => {
                // console.log(JSON.stringify(alarms, null, 2))
                speechText = intentSpeechResponses.parse('CFM_REMINDERS_SET')  
                speechText += intentSpeechResponses.parse('SAY_GOODBYE')  
                resolve(handlerInput.responseBuilder
                  .speak(speechText)
                  .withSimpleCard(skillName, speechText)
                  .getResponse())
              })
              .catch(err => {
                // console.log(JSON.stringify(err, null, 2))
                switch (parseInt(err[err.length-1].status)) {
                  case 401:
                    speechText = intentSpeechResponses.parse('CFM_REMINDERS_FAILED_UNAUTHORIZED')  
                    break;
                  case 403: 
                    speechText = intentSpeechResponses.parse('CFM_REMINDERS_FAILED_UNSUPPORTED')  
                    break;
                  default:
                    speechText = intentSpeechResponses.parse('CFM_REMINDERS_FAILED_DEFAULT')  
                }
                
                speechText += intentSpeechResponses.parse('SAY_GOODBYE')  
                
                resolve(handlerInput.responseBuilder
                  .speak(speechText)
                  .withSimpleCard(skillName, speechText)
                  .getResponse())
              })
          })
          break;
  
        default: 
          speechText = intentSpeechResponses.parse(`YES_OUT_OF_CONTEXT`, [], 'AlexaUnhandledPrompts')
          break;
      }
        
      sessionHandler.updateSession(handlerInput, sessionAttributes)
    
      return handlerInput.responseBuilder
        .speak(speechText)
        .reprompt(speechText)
        .withSimpleCard(skillName, speechText)
        .getResponse();
    }
  }
  