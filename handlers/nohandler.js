const constants = require('./commonconstants')
const {sessionHandler, speechResponses, backtimer, SKILL_NAME} = constants('../')

module.exports = {
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
          sessionAttributes.addBreadcrumb(`No More Activity Types`)
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
  
        case 'Confirm Alarm Schedule':
          sessionAttributes.addBreadcrumb(`Say Goodbye`)
          speechText = speechResponses(sessionAttributes.intentType).parse('CFM_REMINDERS_CANCELLED')      
          speechText += speechResponses(sessionAttributes.intentType).parse('SAY_GOODBYE')      
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