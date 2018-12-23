const constants = require('./commonconstants')
const {sessionHandler, speechResponses, SKILL_NAME} = constants('../')

module.exports = {
    canHandle(handlerInput) {
      const request = handlerInput.requestEnvelope.request;
      return request.type === 'IntentRequest'
        && request.intent.name === 'NowIntent';
    },
    handle(handlerInput) {
      let request = handlerInput.requestEnvelope.request
      let sessionAttributes = sessionHandler.getSession(handlerInput)
      let intentSpeechResponses = speechResponses(sessionAttributes.intentType)
      let activityList = sessionAttributes.activityList
      let speechText = 'now placeholder'
      sessionAttributes.addBreadcrumb(`Confirm Alarm Schedule`)
  
      speechText = intentSpeechResponses.parse('REQ_PLAYBACK_REMINDERS_1', [activityList.length +1, (activityList.length > 1) ? "s" : ""])
      
      for (let activity of activityList) {
        let phrase = activity.startsecs > 0 ?  'REQ_PLAYBACK_REMINDERS_2b' : 'REQ_PLAYBACK_REMINDERS_2a'
        let mins = activity.startsecs/60
        speechText += intentSpeechResponses.parse(phrase, [activity.name, mins, (mins > 1) ? 's' : ''])
      }
  
      let longestMins = activityList[0].duration
      speechText += intentSpeechResponses.parse('REQ_PLAYBACK_REMINDERS_2c', [longestMins, (longestMins > 1) ? 's' : ''])
      speechText += intentSpeechResponses.parse('REQ_PLAYBACK_REMINDERS_3')
  
      return handlerInput.responseBuilder
        .speak(speechText)
        .reprompt(speechText)
        .withSimpleCard(SKILL_NAME, speechText)
        .getResponse();
    }
  }

