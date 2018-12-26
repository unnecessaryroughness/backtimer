/*
    SPEECHDATA.JS 
    ============

    Purpose: 
      * Reads speech pattern templates from ./etc/config.ini via a configParser object  
      * Stores substitution variables to merge with speech pattern templates
      * Returns a JSON object including a function - parse - that will merge the speech template with 
          the subs and supplied variables to create a fully formed string of speech data. 

    Returns: 
        * Object: 
            - subs: 
              - nouns: (list of strings)
              - verbs: (list of strings)
            - parse: (function)
*/

const configParser = require("./configfileparser")

module.exports = (intentType) => {
  let timerSpeech = {
    subs: {
      nouns: [],
      verbs: [] 
    },
    parse (reqSpeech, varList=[]) {
      let base = configParser.get('AlexaSpeechPrompts', reqSpeech, "Speech Undefined")
      for (let [index, noun] of this.subs.nouns.entries()) {
        let regexp = new RegExp(`{{noun.${index}}}`, 'g')
        base = base.replace(regexp, noun)
      }
      for (const [index, verb] of this.subs.verbs.entries()) {
        let regexp = new RegExp(`{{verb.${index}}}`, 'g')
        base = base.replace(regexp, verb)
      }
      for (const [index, varItem] of varList.entries()) {
        let regexp = new RegExp(`{{var.${index}}}`, 'g')
        base = base.replace(regexp, varItem)
      }
      return base
    }
  }
  if (intentType === 'SetMealTimer') {
    timerSpeech.subs.nouns[0] = 'ingredient'
    timerSpeech.subs.nouns[1] = 'meal plan'
    timerSpeech.subs.verbs[0] = 'cook'
    timerSpeech.subs.verbs[1] = 'cooking'
  } else {
    timerSpeech.subs.nouns[0] = 'activity'
    timerSpeech.subs.nouns[1] = 'schedule'
    timerSpeech.subs.verbs[0] = 'complete'
    timerSpeech.subs.verbs[1] = 'running'
  }
  return timerSpeech
}
