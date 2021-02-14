const Raspistill = require('node-raspistill').Raspistill;
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const config = require('./config');


const s3 = new S3Client({
    region: config.awsDefaultRegion,
    credentials: {
        accessKeyId: config.awsAccessKey,
        secretAccessKey: config.awsSecretKey,
    },
});

//Creates webcam instance
const camera = new Raspistill();

const main = async () => {
    console.log('Taking new photo...');
    camera.takePhoto().then(async (photo) => {
        
        let uploadParams = {
            Bucket: config.s3BucketName,
            Key: `${Date.now()}.jpg`,
            Body: photo
        }

        await s3.send(new PutObjectCommand(uploadParams)).catch((err) => {
            console.log('Error sending to S3: ',err);
        })
    });
}


main();