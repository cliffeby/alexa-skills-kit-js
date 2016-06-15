/**
 Copyright 2014-2015 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
 http://aws.amazon.com/apache2.0/
 or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

/**
 * This sample shows how to create a Lambda function for handling Alexa Skill requests that:
 *
 * Examples:
 * One-shot model:
 *  User: "Alexa, ask my BMS about 9 7 0 7"
 *  Alexa: "(reads back the description)"
 */

'use strict';

var AlexaSkill = require('./AlexaSkill'),
    areaCodes = require('./data'),
    costCenters = require('./myCC'),
    costCenterNames = require('./myCCnames');

var APP_ID = 'amzn1.echo-sdk-ams.app.7838e90e-4fbd-4048-93e3-c6b8ec4fce43'; //replace with 'amzn1.echo-sdk-ams.app.[your-unique-value-here]';

/**
 * BMS CostCenter is a child of AlexaSkill AreaCodeHelper.
 * To read more about inheritance in JavaScript, see the link below.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript#Inheritance
 */
var AreaCodeHelper = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
AreaCodeHelper.prototype = Object.create(AlexaSkill.prototype);
AreaCodeHelper.prototype.constructor = AreaCodeHelper;

AreaCodeHelper.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    var speechText = {
            speech:  "<speak>Welcome to cost center lookup with Anita Macaluso. You can ask a question like, "
            +"what is <say-as interpret-as='digits'>9800</say-as> ? ... "
            +"Now, what cost center would you like?</speak>",
            type:   AlexaSkill.speechOutputType.SSML
        },
    // If the user either does not reply to the welcome message or says something that is not
    // understood, they will be prompted again with this text.
        repromptText = {
            speech: "For instructions on what you can say, please say help me.",
            type:   AlexaSkill.speechOutputType.PLAIN_TEXT
        };
    response.ask(speechText, repromptText);
};

AreaCodeHelper.prototype.intentHandlers = {
    "AreaCodeIntent": function (intent, session, response) {
        var itemSlot = intent.slots.Item,
            itemName;
        if (itemSlot && itemSlot.value){
            itemName = itemSlot.value.toLowerCase();
        }

        var cardTitle = "Cost Center for " + itemName,
            location,
            speechOutput,
            repromptOutput;

        //Lookup description for a valid area code
        if (itemName in costCenters) {
            location = costCenters[itemName].CostCenter;
        }

        if (location) {
            var speechText = "<speak>The cost center for " + "<say-as interpret-as='digits'>" + itemName + "</say-as> is " + location + "</speak>";
            speechOutput = {
                speech: speechText,
                type: AlexaSkill.speechOutputType.SSML
            };
            response.tellWithCard(speechOutput, cardTitle, location);
        } else {
            var speech;
            if (itemName) {
                if (itemName === "?") {
                    speech = "<speak>I'm sorry, I did not understand you. Please say ... 'what is' ... plus a four digit cost center.</speak>";
                } else {
                    speech = "<speak>I'm sorry.  I could not find cost code " + "<say-as interpret-as='digits'>" + itemName + "</say-as>"
                        + ". Please say ... 'what is' ... plus a four digit area code.</speak>";
                }
            } else {
                speech = "<speak>I'm sorry, I could not find that cost center.  Please say ... 'what is' ... plus a four digit cost center.</speak>";
            }
            speechOutput = {
                speech: speech,
                type: AlexaSkill.speechOutputType.SSML
            };
            repromptOutput = {
                speech: "Please say ... 'what is' ... plus a four digit cost center, or say cancel,  to quit.",
                type: AlexaSkill.speechOutputType.PLAIN_TEXT
            };
            response.ask(speechOutput, repromptOutput);
        }
    },
    "CostCenterNameIntent": function (intent, session, response) {
        var itemSlot = intent.slots.CityName,
            itemNumber;
        if (itemSlot && itemSlot.value){
           // itemNumber = itemSlot.value.toLowerCase();
            itemNumber = itemSlot.value;
            console.log('itemNumber',itemNumber);
        }

        var cardTitle = "Cost Center for " + itemNumber,
            location = '9999',
            cityName = [],
            speechOutput,
            repromptOutput;
console.log('ccName', costCenterNames,'ccitemNumber', costCenterNames[itemNumber][0].Code,'Length', itemNumber.length);
        //Lookup description for a valid area code
        if (itemNumber in costCenterNames) {
            for (var i = 0; i < costCenterNames[itemNumber].length; i++) {
                location[i]= costCenterNames[itemNumber][i].Code;
                cityName[i]= costCenterNames[itemNumber][i].CostCenter;
            }
            //location = costCenterNames[itemNumber].Code;
            //cityName = costCenterNames[itemNumber].CostCenter;
            console.log('location',location);
        }

        if (location.length==1) {
            var speechText = "<speak>The cost center for " + "<say-as interpret-as='digits'>" + cityName[0] + "</say-as> is " + location[0] + "</speak>";
            speechOutput = {
                speech: speechText,
                type: AlexaSkill.speechOutputType.SSML
            };
            response.tellWithCard(speechOutput, cardTitle, location);
        } else if(location.length>1) {
            var multipleCCs;
            for (var i = 0; i<costCenterNames[itemNumber].length; i++) {
                multipleCCs = multipleCCs +"The cost center for" + cityName[i]+ "<say-as interprest-as= digits" +location[i] + "</speak>";
            }
            var speechText = "<speak>I found" + location.length + "cost centers for " + itemNumber + "They are" + multipleCCs;
            speechOutput = {
                speech: speechText,
                type: AlexaSkill.speechOutputType.SSML
            };
            response.tellWithCard(speechOutput, cardTitle, location);
        }
        else {
            var speech;
            if (itemNumber) {
                if (itemNumber === "?") {
                    speech = "<speak>I'm sorry, I did not understand you Cost Center intent. Please say ... 'what is' ... plus a cost center name.</speak>";
                } else {
                    speech = "<speak>I'm sorry.  I could not find cost center " + itemNumber
                        + ". Please say ... 'what is' ... plus a cost cnter name.</speak>";
                }
            } else {
                speech = "<speak>I'm sorry, I could not find that cost center.  Please say ... 'what is' ... and a cost center name.</speak>";
            }
            speechOutput = {
                speech: speech,
                type: AlexaSkill.speechOutputType.SSML
            };
            repromptOutput = {
                speech: "Please say ... 'what is' ... plus a cost center, or say cancel,  to quit.",
                type: AlexaSkill.speechOutputType.PLAIN_TEXT
            };
            response.ask(speechOutput, repromptOutput);
        }
    },
    "AMAZON.StopIntent": function (intent, session, response) {
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
    },

    "AMAZON.CancelIntent": function (intent, session, response) {
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
    },

    "AMAZON.HelpIntent": function (intent, session, response) {
        var speechText = {
                speech:  "<speak>You get the location of an area code by saying, "
                +"where is <say-as interpret-as='digits'>8600</say-as> ? ... "
                +"Now, what area code would you like?</speak>",
                type:   AlexaSkill.speechOutputType.SSML
            },
        // If the user either does not reply to the welcome message or says something that is not
        // understood, they will be prompted again with this text.
            repromptText = {
                speech: "For instructions on what you can say, please say help me.",
                type:   AlexaSkill.speechOutputType.PLAIN_TEXT
            };
        response.ask(speechText, repromptText);
    }
};

exports.handler = function (event, context) {
    var areaCodeHelper = new AreaCodeHelper();
    areaCodeHelper.execute(event, context);
};