var AWS = require("aws-sdk");
var language = require("@google-cloud/language");
const client = new language.LanguageServiceClient({
  projectId: "my-project-355622",
  keyFilename: "./secret.json",
});
var dynamo_db = new AWS.DynamoDB({ apiVersion: "2012-08-10" });

exports.handler = async (event) => {
  console.log("Test")
  console.log(event.body)
  const parsed_json = JSON.parse(event.body);
  console.log(parsed_json.feedback);
  console.log(parsed_json.email_id);
  const doc_positive = {
    type: "PLAIN_TEXT",
    content: parsed_json.feedback,
  };
  var type_of_Sentiment;
  var score_of_Sentiment;
  await client
    .analyzeSentiment({ document: doc_positive })
    .then((results) => {
      const res_of_sentiment = results[0].documentSentiment;
      if (res_of_sentiment.score > 0.35) {
        type_of_Sentiment = "Postive";
        console.log("Postive");
        score_of_Sentiment = "9";
      } else if (res_of_sentiment.score < -0.35) {
        console.log("Negative");
        type_of_Sentiment = "Negative";
        score_of_Sentiment = "2";
      } else {
        console.log("Neutral");
        type_of_Sentiment = "Neutral";
        score_of_Sentiment = "6";
      }
    });
  var parameters = {
    TableName: "feedback_group_23",
    Item: {
      email_id: { S: parsed_json.email_id },
      Feedback: { S: parsed_json.feedback },
      type_of_Sentiment: { S: type_of_Sentiment },
      score_of_Sentiment: { S: score_of_Sentiment },
    },
  };
  console.log(parameters);

  const response = await dynamo_db.putItem(parameters).promise();

  console.log("Success ",response);
  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message: "Insertion Sucessful" }),
  };
};