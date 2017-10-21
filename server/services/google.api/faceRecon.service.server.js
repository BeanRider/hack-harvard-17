module.exports = function (app,Vision) {

    app.get("/api/faceRecon", faceRecon);

    const format = require('util').format;
    const express = require('express');
    const bodyParser = require('body-parser');
    const process = require('process');
    const bucketName = 'convo-buddy-hackharvard';


    const Storage = require('@google-cloud/storage');
    const Multer = require('multer');
// Instantiate a storage client
    const storage = Storage();

// [START config]
// Multer is required to process file uploads and make them available via
// req.files.
    const multer = Multer({
        storage: Multer.memoryStorage(),
        limits: {
            fileSize: 5 * 1024 * 1024 // no larger than 5mb, you can change as needed.
        }
    });

// A bucket is a container for objects (files).
    const bucket = storage.bucket(bucketName);
// [END config]


    app.post('/upload', multer.single('file'),upload);


    function upload(req, res){
        if (!req.file) {
        res.status(400).send('No file uploaded.');
        return;
    }

    // Create a new blob in the bucket and upload the file data.
    const blob = bucket.file(req.file.originalname);
    //const blobStream = blob.createWriteStream();
        const blobStream = blob.createWriteStream({
            metadata: {
                contentType: req.file.mimetype
            }
        });

    blobStream.on('error', (err) => {
        next(err);
});

/*    blobStream.on('finish', () => {
        // The public URL can be used to directly access the file via HTTP.
        const publicUrl = format(`https://storage.googleapis.com/${bucket.name}/${blob.name}`);
    //res.status(200).send(publicUrl);
});*/

    blobStream.end(req.file.buffer);
}

    function faceRecon(req, res) {
        storage
            .bucket(bucketName)
            .getFiles()
            .then(results => {
            const files = results[0];

        console.log('Files:');
        files.forEach(file => {
            console.log(file.name);

        const gcsPath = `gs://${bucketName}/${file.name}`;
        // Instantiates clients
        const vision = Vision();


        console.log(gcsPath);

        vision.faceDetection({ source: { imageUri: gcsPath } })
            .then((results) => {
            const faces = results[0].faceAnnotations;

        console.log('Faces:');
        faces.forEach((face, i) => {
            console.log(`  Face #${i + 1}:`);
        console.log(`    Joy: ${face.joyLikelihood}`);
        console.log(`    Anger: ${face.angerLikelihood}`);
        console.log(`    Sorrow: ${face.sorrowLikelihood}`);
        console.log(`    Surprise: ${face.surpriseLikelihood}`);
    });
        res.send(faces);
    })
    .catch(err => {
            console.error('ERROR:', err);
    });

    });

    })
    .catch((err) => {
            console.error('ERROR:', err);
    });
    }



};