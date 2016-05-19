/**
    Copyright 2014-2015 Amazon.com, Inc. or its affiliates. All Rights Reserved.

    Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at

        http://aws.amazon.com/apache2.0/

    or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

/**
 * This simple sample has no external dependencies or session management, and shows the most basic
 * example of how to create a Lambda function for handling Alexa Skill requests.
 *
 * Examples:
 * One-shot model:
 *  User: "Alexa, tell Greeter to say hello"
 *  Alexa: "Hello World!"
 */

/**
 * App ID for the skill
 */
var APP_ID = undefined; //replace with "amzn1.echo-sdk-ams.app.[your-unique-value-here]";

/**
 * The AlexaSkill prototype and helper functions
 */
var AlexaSkill = require('./AlexaSkill');

/**
 * PeePaw is a child of AlexaSkill.
 * To read more about inheritance in JavaScript, see the link below.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript#Inheritance
 */
    var PeePaw = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
PeePaw.prototype = Object.create(AlexaSkill.prototype);
PeePaw.prototype.constructor = PeePaw;

PeePaw.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    console.log("PeePaw onSessionStarted requestId: " + sessionStartedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any initialization logic goes here
};

PeePaw.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    console.log("PeePaw onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
    var speechOutput = "Welcome you can say PeePaw says";
    var repromptText = "You can say PeePaw says";
    response.ask(speechOutput, repromptText);
};

PeePaw.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log("PeePaw onSessionEnded requestId: " + sessionEndedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any cleanup logic goes here
};

PeePaw.prototype.intentHandlers = {
    // register custom intent handlers
    "VioletNudieIntent": function (intent, session, response) {
        response.tell("When Violet calls, PeePaw says nudi nudi nudie!");
    },
    "MollyIntent": function (intent, session, response) {
        response.tell("Molly can say taco");
    },
    "MeeMawIntent": function (intent, session, response) {
        response.tell("MeeMaw says I, yai, yai");
    },
    "AMAZON.StopIntent": function (intent, session, response) {
        var speechOutput = "OK, Stop it";
        response.tell(speechOutput);
    },
    "AMAZON.CancelIntent": function (intent, session, response) {
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
    },
    "AMAZON.HelpIntent": function (intent, session, response) {
        var speechText = "You can ask about what PeePaw says when Violet calls, MeeMaw's responses to Violet and molly, or molly's first word. Such as, " +
            "When Violet calls... Or What Molly can say";
        var repromptText = "Or you can just say names like PeePaw, MeeMaw, Violet or Molly... Now, what can I help you with?";
        var speechOutput = {
            speech: speechText,
            type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };
        var repromptOutput = {
            speech: repromptText,
            type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };
        response.ask(speechOutput, repromptOutput);
    },
    "VioletAgeIntent": function (intent, session, response) {
        //getAgeinYearsMonthsDays(intent, session, response);
        var today = new Date();

        var month = months[today.getMonth()];
        var day = today.getDate();
        var bDay = new Date(2012,08,03,0,0);
        var diff = today-bDay;
        var day = 1000 * 60 * 60 * 24;

        var days = Math.floor(diff/day);
        var months = Math.floor(days/31);
        var years = Math.floor(months/12);

        var speechOutput = "Peepaw thinks that Violet is  " + years + ","+ months+"," + days+ ",old";
        response.tell(speechOutput);
    }
};
//     "AMAZON.HelpIntent": function (intent, session, response) {
//         response.ask("You can say hello to me!", "You can say hello to me!");
//     }
// };

 // function getAgeinYearsMonthsDays(intent, session, response){
 //     var today = new Date();
 //
 //     var month = months[today.getMonth()];
 //     var day = today.getDate();
 //     var bDay = new Date(2012,08,03,0,0);
 //     var diff = today-bDay;
 //     var day = 1000 * 60 * 60 * 24;
 //
 //     var days = Math.floor(diff/day);
 //     var months = Math.floor(days/31);
 //     var years = Math.floor(months/12);
 //
 //     var speechOutput = "Peepaw thinks that Violet is  " + years + ","+ months+"," + days+ ",old";
 //     response.tell(speechOutput);
 // };

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the PeePaw skill.
    var helloWorld = new PeePaw();
    helloWorld.execute(event, context);
};

