'use strict';

const Alexa = require('ask-sdk');
const skillBuilder = Alexa.SkillBuilders.standard();

const SetBacktimerHandler = require('./handlers/setbacktimerhandler')
const ActivityTypeHandler = require('./handlers/activitytypehandler')
const ActivityDurationHandler = require('./handlers/activitydurationhandler')
const YesHandler = require('./handlers/yeshandler')
const NoHandler = require('./handlers/nohandler')
const NowHandler = require('./handlers/nowhandler')
const LaterHandler = require('./handlers/laterhandler')
const StartHandler = require('./handlers/starthandler')
const HelpHandler = require('./handlers/helphandler')
const ExitHandler = require('./handlers/exithandler')
const SessionEndedRequestHandler = require('./handlers/sessionendedrequesthandler')
const ErrorHandler = require('./handlers/errorhandler')
const UnhandledHandler = require('./handlers/unhandledhandler')

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

