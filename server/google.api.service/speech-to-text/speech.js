const fs = require('fs');
// Imports the Google Cloud client library
const Speech = require('@google-cloud/speech');

module.exports = function (app, Speech, fs) {

    app.get("/api/speechToTest", speechToText);

    function speechToText(req, res) {
        // Instantiates a client
        const speech = Speech();

        // The path to the local file on which to perform speech recognition, e.g. /path/to/audio.raw
        const filename = "test.flac";

        // The encoding of the audio file, e.g. 'LINEAR16'
        const encoding = 'FLAC';

        // The sample rate of the audio file in hertz, e.g. 16000
        const sampleRateHertz = 44100;

        // The BCP-47 language code to use, e.g. 'en-US'
        const languageCode = 'en-US';

        const config = {
            encoding: encoding,
            sampleRateHertz: sampleRateHertz,
            languageCode: languageCode
        };
        const audio = {
            content: fs.readFileSync(filename).toString('base64')
        };

        const request = {
            config: config,
            audio: audio
        };

        // Detects speech in the audio file
        speech.recognize(request)
            .then((data) => {
                const response = data[0];
                const transcription = response.results.map(result =>
                    result.alternatives[0].transcript).join('\n');
                console.log(`Transcription: `, transcription);
                console.log(response.results);
                res.send(response.results);
            })
            .catch((err) => {
                console.error('ERROR:', err);
                res.send(500);
            });
    }

};
