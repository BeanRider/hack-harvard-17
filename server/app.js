module.exports = function (app, Vision, Speech, fs, Nlp) {
    require("./services/google.api/faceRecon.service.server.js")(app,Vision);
    require("./services/google.api/voice-to-text/voice-to-text.service.server")(app, Speech, fs);
    require("./services/google.api/text-processing/text-processing.service.server.js")(app,Nlp);
}