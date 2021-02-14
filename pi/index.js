const Raspistill = require('node-raspistill').Raspistill;
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
const camera = new Raspistill();



const postImage = async (buffer) => {
    let uploadParams = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `${Date.now()}.jpg`,
        Body: buffer
    }
    return s3.send(new PutObjectCommand(uploadParams));

}

const main = async () => {
    console.log('Taking new photo...');
    camera.takePhoto().then(async (photo) => {
        await postImage(photo);
    });
}


main();