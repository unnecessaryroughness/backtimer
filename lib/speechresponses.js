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
      REQ_ACTIVITY_NAME: "Ok. What is your {{var.0}} {{noun.0}}? Say: 'Add', followed by your {{noun.0}} name",
      REQ_ACTIVITY_DURATION: "And how long in minutes will {{var.0}} take to {{verb.0}}?",
      REQ_ACTIVITY_CONFIRMATION: "Ok, I have {{var.0}} {{verb.1}} for {{var.1}} minutes. ",
      REQ_ADD_ANOTHER_PROMPT: "Would you like to add another {{noun.0}}?",
      TELL_LONGEST_ACTIVITY: "Ok. The longest {{noun.0}} to {{verb.0}}, is {{var.0}}, that will take {{var.1}} minutes. ",
      TELL_SECOND_STARTER: "After starting {{var.0}}, you should wait {{var.1}} minutes, and then start {{var.2}}. ",
      TELL_SUBSEQUENT_STARTER: "Then wait {{var.0}} more minutes, before starting {{var.1}}. ",
      TELL_FOOTER: "If you follow these instructions then everything should be completed at the same time. ",
      REQ_SET_REMINDERS: "Would you like me to set reminders for the start of each {{noun.0}}? ",
      REQ_SET_REMINDERS_NOW: "Would you like me to set the reminders immediately, or later? ",
      REQ_PLAYBACK_REMINDERS_1: "Ok. I will set {{var.0}} reminder{{var.1}} for you. ",
      REQ_PLAYBACK_REMINDERS_2a: "{{var.0}} immediately. ",
      REQ_PLAYBACK_REMINDERS_2b: "{{var.0}} in {{var.1}} minute{{var.2}}. ",
      REQ_PLAYBACK_REMINDERS_3: "Is that Ok? ",
      CFM_REMINDERS_SET: "Your reminders have been set. ",
      CFM_REMINDERS_FAILED: "Sorry, I was unable to set at least one of your reminders. ",
      CFM_REMINDERS_CANCELLED: "Ok, I will not set any reminders for you at this time. ",
      SAY_GOODBYE: "Thank you for using backtimer. Goodbye. "
    },
    parse (reqSpeech, varList=[]) {
      let base = (this.speeches[reqSpeech]) ? this.speeches[reqSpeech] : "Speech Undefined"
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
