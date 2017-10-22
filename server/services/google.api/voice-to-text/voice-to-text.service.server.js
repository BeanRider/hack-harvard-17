var formidable = require('formidable');
var path = require('path');
var sys = require('sys');
var exec = require('child_process').exec;

module.exports = function (app, Speech, fs) {

    app.post("/api/voiceToText", voiceToText);

    function fileExists(filePath) {
        try {
            return fs.statSync(filePath).isFile();
        } catch (err) {
            return false;
        }
    }

    function voiceToText(req, res) {

        // 1. Clear upload dir
        let fileName = "recorded";
        let uploadDir = path.join(__dirname, '/uploads');
        let fPath = path.join(uploadDir, fileName+".webm");
        let dPath = path.join(uploadDir, fileName+".flac");
        if (fs.existsSync(fPath)) {
            fs.unlinkSync(fPath);
        } else {
            console.log(fPath + " already removed.");
        }
        if (fs.existsSync(dPath)) {
            fs.unlinkSync(dPath);
        } else {
            console.log(dPath + " already removed.");
        }

        // create an incoming form object
        var form = new formidable.IncomingForm();

        // specify that we want to allow the user to upload multiple files in a single request
        form.multiples = false;

        // store all uploads in the /uploads directory
        form.uploadDir = uploadDir;

        // every time a file has been uploaded successfully,
        // rename it to it's orignal name
        form.on('file', function(field, file) {
            fs.rename(file.path, path.join(form.uploadDir, file.name));
            console.log("got file: " + file.path);
        });

        // log any errors that occur
        form.on('error', function(err) {
            console.log('An error has occured: \n' + err);
        });

        // once all the files have been uploaded, send a response to the client
        form.on('end', function() {
            console.log('file upload success');

            setTimeout(function() {
                // If file does not exist (empty upload, exit)
                if (!fileExists(fPath)) {
                    console.log("File " + fPath + " DNE!");
                    res.send(500);
                    return;
                }

                // Convert from webm to flac
                convertToFlac(fPath, dPath,
                    function(data) {
                        sendToGoogle(dPath, function(data, err) {
                            if (err) {
                                console.log("about to send 500");
                                res.send(500);
                            } else {
                                console.log("about to send data");
                                res.send(data);
                            }
                        });
                    },
                    function(error) {
                        if (error !== null) {
                            console.log('stderr: ' + error);
                        }
                    });
            }, 1000);

        });

        // parse the incoming request containing the form data
        form.parse(req);
    }

    function convertToFlac(fPath, dPath, done, err) {
        console.log("in convertToFlac");
        let cmd = `ffmpeg -i ${fPath} ${dPath}`;

        const task = exec(cmd, done);
        task.stdout.on('data', done);
        task.stderr.on('data', err);
    }

    function sendToGoogle(filePath, done) {
        console.log("in sendToGoogle");
        // Instantiates a client
        const speech = Speech();

        // The path to the local file on which to perform speech recognition, e.g. /path/to/audio.raw
        const filename = filePath;

        // The encoding of the audio file, e.g. 'LINEAR16'
        const encoding = 'FLAC';

        // The sample rate of the audio file in hertz, e.g. 16000
        const sampleRateHertz = 48000;

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

        // Detects speech in the audio file. This creates a recognition job that you
        // can wait for now, or get its result later.
        speech.longRunningRecognize(request)
            .then((data) => {
                const operation = data[0];
                // Get a Promise representation of the final result of the job
                return operation.promise();
            })
            .then((data) => {
                const response = data[0];
                const transcription = response.results.map(result =>
                    result.alternatives[0].transcript).join('\n');
                console.log(`Transcription: ${transcription}`);
                done(response.results);
            })
            .catch((err) => {
                console.error('ERROR:', err);
                done(null, err);
            });
    }

};
