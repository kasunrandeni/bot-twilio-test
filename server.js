/**
 * Copyright 2019 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
 const express = require('express');
 const request = require('request');
 const app = express();
 const dialogflowSessionClient =
	 require('../botlib/dialogflow_session_client.js');
 const bodyParser = require('body-parser');
 
 app.use(bodyParser.json());
 app.use(bodyParser.urlencoded({ extended: true }));
 
 //For authenticating dialogflow_session_client.js, create a Service Account and
 // download its key file. Set the environmental variable
 // GOOGLE_APPLICATION_CREDENTIALS to the key file's location.
 //See https://dialogflow.com/docs/reference/v2-auth-setup and
 // https://cloud.google.com/dialogflow/docs/setup for details.
 
 const projectId = 'kasunbot-jutt';
 const phoneNumber = "Place your twilio phone number here";
 const accountSid = 'AC1a2f63f9873b3080d89d5d97109f81de';
 const authToken = '8ed22348affc8845562ca5b4932f6cfa';
 
 const client = require('twilio')(accountSid, authToken);
 const MessagingResponse = require('twilio').twiml.MessagingResponse;
 const sessionClient = new dialogflowSessionClient(projectId);
 
 const listener = app.listen(process.env.PORT, function() {
   console.log('Your Twilio integration server is listening on port '
	   + listener.address().port);
 });
 
 app.post('/', async function(req, res) {
   const body = req.body;
   const text = body.Body;
   const id = body.From;
   const dialogflowResponse = (await sessionClient.detectIntent(
	   text, id, body)).fulfillmentText;
   const twiml = new  MessagingResponse();
   const message = twiml.message(dialogflowResponse);
   res.send(twiml.toString());
 });
 
 process.on('SIGTERM', () => {
   listener.close(() => {
	 console.log('Closing http server.');
	 process.exit(0);
   });
 });
 