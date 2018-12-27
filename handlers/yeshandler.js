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
          speechText = speechResponses(sessionAttributes.intentType).parse('REQ_SET_REMINDERS_NOW')      
          break;
  
        case 'Confirm Alarm Schedule':
          return new Promise((resolve, reject) => {
            sessionAttributes.addBreadcrumb(`Set Alarms`)
            let {apiEndpoint, apiAccessToken} = handlerInput.requestEnvelope.context.System
        
            alarmHandler(sessionAttributes.activityList, apiEndpoint, apiAccessToken)
              .then(alarms => {
                console.log(JSON.stringify(alarms, null, 2))
                speechText = speechResponses(sessionAttributes.intentType).parse('CFM_REMINDERS_SET')  
                speechText += speechResponses(sessionAttributes.intentType).parse('SAY_GOODBYE')  
                resolve(handlerInput.responseBuilder
                  .speak(speechText)
                  .withSimpleCard(skillName, speechText)
                  .getResponse())
              })
              .catch(err => {
                console.log('in the catch routine...')
                console.log(JSON.stringify(err, null, 2))
                speechText = speechResponses(sessionAttributes.intentType).parse('CFM_REMINDERS_FAILED')  
                speechText += speechResponses(sessionAttributes.intentType).parse('SAY_GOODBYE')  
                resolve(handlerInput.responseBuilder
                  .speak(speechText)
                  .withSimpleCard(skillName, speechText)
                  .getResponse())
              })
          })
          break;
  
        default: 
          speechText = "You said Yes out of context. Previous breadcrumb was " + previousBreadcrumb 
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
  