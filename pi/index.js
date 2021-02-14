const NodeWebcam = require( "node-webcam" );
const fetch = require('node-fetch');
const fs = require('fs');
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

require('dotenv').config()

const OPTIONS = {
    //Picture related
    width: 1920,
    height: 1080,
    quality: 100,

    // More frames, longer it takes to capture, better quality
    frames: 60,
    output: "jpeg",
    // uses default device
    device: false,

    //Logging
    verbose: false

};

const s3 = new S3Client({region: process.env.AWS_DEFAULT_REGION});

//Creates webcam instance
const Webcam = NodeWebcam.create( OPTIONS );

const postImage = async (path) => {
    let body = fs.readFileSync(path);
    let uploadParams = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `${Date.now()}.jpg`,
        Body: body
    }
    return s3.send(new PutObjectCommand(uploadParams));

}

const main = async () => {
    console.log('Taking new photo...');
    Webcam.capture( "snapshot", async function( err, data ) {
        if (err) {
            console.log(`Photo failed: ${err}`)
        } else {
            console.log('Photo successful!');
            let res = await postImage('snapshot.jpg');
            console.log(res);
            /*
            let response = await postImage("snapshot.jpg")
                .then((res) => res.json());
            fs.unlinkSync("snapshot.jpg")
            */
        }
    });
}


main();