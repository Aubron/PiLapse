const Raspistill = require('node-raspistill').Raspistill;
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const config = require('./config');

console.log(config);

const s3 = new S3Client({
    region: config.awsDefaultRegion,
    accessKeyId: config.awsAccessKey,
    secretAccessKey: config.awsSecretKey,
});

//Creates webcam instance
const camera = new Raspistill();



const postImage = async (buffer) => {
    let uploadParams = {
        Bucket: config.s3BucketName,
        Key: `${Date.now()}.jpg`,
        Body: buffer
    }
    return s3.send(new PutObjectCommand(uploadParams)).catch((err) => {
        console.log('Error sending to S3: ',err);
    })

}

const main = async () => {
    console.log('Taking new photo...');
    camera.takePhoto().then(async (photo) => {
        await postImage(photo);
    });
}


main();