/*
    SESSIONHANDLER.JS 
    ============

    Purpose: 
        * Defines a function that gets the session object for the current Alexa session
        * Initialises the session object with a default object if the session object is empty
        * Defines a function that updates the session object for the current Alexa session
        
    Functions: 
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

let sessionAttributesTemplate = {
    activityList: [{name: '', duration: ''}],
    intentType: '',
    breadcrumbs: [],
    updateActivity (activityName, activityDuration) {
        console.log(JSON.stringify(this.activityList))
        if (activityName) this.activityList[this.activityList.length -1].name = activityName
        if (activityDuration) this.activityList[this.activityList.length -1].duration = activityDuration
        return this
    },
    addActivity () {
        this.activityList.push({name: '', duration: ''})
        return this
    },
    reset (intentType) {
        this.activityList = [{}]
        this.intentType = intentType
        return this
    },
    addBreadcrumb (breadcrumb) {
        this.breadcrumbs.push(breadcrumb)
        return this
    },
    getNewest () {
        return this.activityList[this.activityList.length -1] 
    },
    getNewestBreadcrumb () {
        return this.breadcrumbs[this.breadcrumbs.length -1]
    },
    stringify () {
       return JSON.stringify(this.activityList, null, 2)
    }
}

const getSession = (handlerInput) => {
    let sessionAttributes = handlerInput.attributesManager.getSessionAttributes()
    if (!sessionAttributes.activityIndex) {
        sessionAttributes = sessionAttributesTemplate
    }
    return sessionAttributes
}

const updateSession = (handlerInput, sessionAttributes) => {
    handlerInput.attributesManager.setSessionAttributes(sessionAttributes)
}

module.exports = {
    getSession,
    updateSession
}