# ConvoBuddy:

## Summary
ConvoBuddy provides a webinar system tailored for professional online meetings that promotes engagement and feedback by capturing live meeting data and generating real-time sentiment analysis.

## Technologies
We built ConvoBuddy as a web application supported by Node.js, Express.js, and Angular.js, hosted on Google Cloud Engine. The first thing the user sees on website is the in-conference recording system, where the app periodically captures the participants on a set interval, using the webcam. In parallel, it also records the audio of the entire meeting via the microphone. We use this collected data to feed Google's machine learning and prediction APIs, including Google Cloud Speech, Google Cloud Vision, Google Natural Language Processing, in order to generate sentimental analysis results. This is done by first sending the audio file into our Node.js backend, where it converts it into a FLAC format compatible with Google's text-to-speech API. After retrieving the transcript data, it is then fed into Google's Natural Language Processing API to generate an overall sentiment value and magnitude. Finally, we give the list of images captured during this session to the Vision API, where we retrieve emotional analysis results of the detected faces.

Next, we have implemented our own algorithm to aggregate and analyze these raw data, generating a holistic score-based report. This report highlights a holistic sentiment score on a scale of 0 to 10, as well as the predominant emotion based on all of the faces of the participants. It also provides a relative analysis of the specific emotions that were used during the meeting calculated using a weighted average formula.

All of these features are held together with a completely customized, clean, and modern UI that provides hierarchy to the report, using colors, bar graphs, and pie charts to visualize this valuable information. We also provide a live camera view for the user in-call, very similar to the profession-grade webinar systems, such as Skype and Cicso Webex.

## Screenshots
![alt text](https://raw.githubusercontent.com/BeanRider/hack-harvard-17/master/Screen%20Shot%202017-10-22%20at%205.11.11%20AM.png)

![alt text](https://raw.githubusercontent.com/BeanRider/hack-harvard-17/master/Screen%20Shot%202017-10-22%20at%205.06.50%20AM.png)

![alt text](https://raw.githubusercontent.com/BeanRider/hack-harvard-17/master/Screen%20Shot%202017-10-22%20at%205.05.12%20AM.png)

