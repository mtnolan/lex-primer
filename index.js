const AWS = require("aws-sdk");
const log = require("./lib/log");

const lexRuntime = new AWS.LexRuntime();

exports.handler = async (event) => {
  log.debug("Event", event);

  const { lexBot, utterance, lexAlias } = event.Details.Parameters;

  const params = {
    botAlias: lexAlias /* required */,
    botName: lexBot /* required */,
    inputText: utterance /* required */,
    userId: event.Details.ContactData.ContactId /* required */,
  };

  log.debug("Request", params);

  const response = await lexRuntime.postText(params).promise();

  log.debug("Response", response);

  return { success: true };
};
