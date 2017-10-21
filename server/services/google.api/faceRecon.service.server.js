module.exports = function (app,Vision) {

    app.get("/api/faceRecon", faceRecon);

    function faceRecon(req, res) {

    // Instantiates clients
        const vision = Vision();

    // The name of the bucket where the file resides, e.g. "my-bucket"
         const bucketName = 'convo-buddy-hackharvard';

    // The path to the file within the bucket, e.g. "path/to/image.png"
        const fileName = 'sample.jpg';

        const gcsPath = `gs://${bucketName}/${fileName}`;
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
    .catch((err) => {
            console.error('ERROR:', err);
    });
    }

};