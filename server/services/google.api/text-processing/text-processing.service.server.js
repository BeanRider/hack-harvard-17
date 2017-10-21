module.exports = function (app, Nlp){

    app.get("/api/nlp", nlp);

    function nlp(req, res){
        console.log("Inside nlp");

        // Instantiates a client
        const client = new Nlp.LanguageServiceClient();

        // The text to analyze
        const text = 'Hello, world!';

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

        console.log(`Text: ${text}`);
        console.log(`Sentiment score: ${sentiment.score}`);
        console.log(`Sentiment magnitude: ${sentiment.magnitude}`);
    })
    .catch(err => {
            console.error('ERROR:', err);
    });
    }

}