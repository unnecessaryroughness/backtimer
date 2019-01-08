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

function sessionAttributesTemplate () {
    this.activityList = [{name: '', duration: ''}]
    this.intentType = ''
    this.breadcrumbs = []
    this.waitSeconds = 0
    this.updateActivity = (activityName, activityDuration) => {
        // console.log(JSON.stringify(this.activityList))
        if (activityName) this.activityList[this.activityList.length -1].name = activityName
        if (activityDuration) this.activityList[this.activityList.length -1].duration = activityDuration
        return this
    }
    this.addActivity = () => {
        this.activityList.push({name: '', duration: ''})
        return this
    }
    this.reset = (intentType) => {
        this.activityList = []
        this.intentType = intentType
        return this
    }
    this.addBreadcrumb = (breadcrumb) => {
        this.breadcrumbs.push(breadcrumb)
        return this
    }
    this.getNewest = () => {
        return this.activityList[this.activityList.length -1] 
    }
    this.getNewestBreadcrumb = () => {
        return this.breadcrumbs[this.breadcrumbs.length -1]
    }
    this.stringify = () => {
        return JSON.stringify(this.activityList, null, 2)
    }
    this.setWaitSeconds = (waitSeconds) => {
        this.waitSeconds = waitSeconds
        return this
    }
    this.load = (loadData) => {
        // console.log(`loaddata:`, loadData)
        if (loadData) {
            this.activityList = JSON.parse(JSON.stringify(loadData.activityList))
            this.intentType = loadData.intentType 
            this.breadcrumbs = loadData.breadcrumbs.slice()
            this.waitSeconds = loadData.waitSeconds 
        }    
        return this
    }
}


const getSession = (handlerInput) => {
    let sessionAttributes = null
    let cachedAttributes = handlerInput.attributesManager.getSessionAttributes()
    if (!cachedAttributes.activityList) {
        // console.log('no state object; manufacturing an empty state object from the class')
        sessionAttributes = new sessionAttributesTemplate()
    } else {
        // console.log('found a state object; inflating a new object using cached data from that one')
        sessionAttributes = new sessionAttributesTemplate()
        sessionAttributes.load(cachedAttributes)
    }
    cachedAttributes = null
    return sessionAttributes
}

const updateSession = (handlerInput, sessionAttributes) => {
    handlerInput.attributesManager.setSessionAttributes(sessionAttributes)
}

module.exports = {
    getSession,
    updateSession
}