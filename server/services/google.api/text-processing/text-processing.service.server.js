module.exports = function (app, Nlp){

    app.get("/api/nlp", nlp);

    function nlp(req, res){
        console.log("Inside nlp");

        // Instantiates a client
        const client = new Nlp.LanguageServiceClient();

        // The text to analyze
        const text = 'Hello World';

        const document = {
            content: text,
            type: 'PLAIN_TEXT',
        };

        console.log("Client" + client);

        // Detects the sentiment of the text
        client
            .analyzeSentiment({document: document})
            .then(results => {
            const sentiment = results[0].documentSentiment;

            var sentimentScore = sentiment.score;
            sentimentScore = (sentimentScore * 5) + 5;
            console.log("Sentiment score: " + sentimentScore);
            // var sentimentEnum = "";
            //
            // if(sentimentScore >= -1 && sentimentScore < -0.625){
            //     sentimentEnum = "VERY_NEGATIVE";
            // }
            // else if(sentimentScore >= -0.625 && sentimentScore < -0.25){
            //     sentimentEnum = "NEGATIVE";
            // }
            // else if(sentimentScore >= -0.25 && sentimentScore < 0.25){
            //     sentimentEnum = "NEUTRAL";
            // }
            // else if(sentimentScore >= 0.25 && sentimentScore < 0.625){
            //     sentimentEnum = "POSITIVE";
            // }
            // else{
            //     sentimentEnum = "VERY POSITIVE";
            // }

            var sentimentMagnitude = sentiment.magnitude;
            console.log("Sentiment magnitude: " + sentimentMagnitude);
            var accuracyConfidence = "";

            if(sentimentMagnitude > 4){
                accuracyConfidence = "VERY_CONFIDENT";
            }
            else if(sentimentMagnitude > 2.5){
                accuracyConfidence = "CONFIDENT";
            }
            else if(sentimentMagnitude > 1){
                accuracyConfidence = "NEUTRAL";
            }
            else{
                accuracyConfidence = "NOT_CONFIDENT";
            }

        // console.log("SentimentEnum: " + sentimentEnum);
        // console.log("AccuracyConfidence" + accuracyConfidence);

        var response = {sentimentScore: sentimentScore, accuracyConfidenceRes : accuracyConfidence};

        res.send(response);
    })
    .catch(err => {
            console.error('ERROR:', err);
    });
    }

}