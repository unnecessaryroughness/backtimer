/*
    SPEECHDATA.JS 
    ============

    Purpose: 
        * Returns a JSON object containing the speech pattern text for the relevant intent
        * JSON object includes a function - parse - that will merge the speech template with 
          the subs and supplied variables to create a fully formed string of speech data. 

    Returns: 
        * Object: 
            - subs: 
              - nouns: (list of strings)
              - verbs: (list of strings)
            - SPEECH_CONSTANT_1: 
              - base:  (string)
            - SPEECH_CONSTANT_2: 
              - base:  (string)
            ...
            - parse: (function)
*/

module.exports = (intentType) => {
  let timerSpeech = {
    subs: {
      nouns: [],
      verbs: [] 
    },
    speeches: {
      REQ_FIRST_ACTIVITY: "Ok. What is your first {{noun.0}}?",
      REQ_FIRST_DURATION: "And how long will {{var.0}} take to {{verb.0}}?",
      REQ_ADD_ANOTHER_PROMPT: "Ok. Would you like to add another {{noun.0}}?"
    },
    parse (reqSpeech, varList=[]) {
      let base = (this.speeches[reqSpeech]) ? this.speeches[reqSpeech] : "Speech Undefined"
      for (let [index, noun] of this.subs.nouns.entries()) {
        base = base.replace(`{{noun.${index}}}`, noun)
      }
      for (const [index, verb] of this.subs.verbs.entries()) {
        base = base.replace(`{{verb.${index}}}`, verb)
      }
      for (const [index, varItem] of varList.entries()) {
        base = base.replace(`{{var.${index}}}`, varItem)
      }
      return base
    }
  }
  if (intentType === 'SetMealTimer') {
    timerSpeech.subs.nouns[0] = 'ingredient'
    timerSpeech.subs.nouns[1] = 'meal plan'
    timerSpeech.subs.verbs[0] = 'cook'
  } else {
    timerSpeech.subs.nouns[0] = 'activity'
    timerSpeech.subs.nouns[1] = 'schedule'
    timerSpeech.subs.verbs[0] = 'complete'
  }
  return timerSpeech
}
