//Available in nodejs
var NodeWebcam = require( "node-webcam" );


//Default options
var opts = {
    //Picture related
    width: 1920,
    height: 1080,
    quality: 100,

    // Number of frames to capture
    // More the frames, longer it takes to capture
    // Use higher framerate for quality. Ex: 60
    frames: 60,


    //Delay in seconds to take shot
    //if the platform supports miliseconds
    //use a float (0.1)
    //Currently only on windows
    delay: 0,


    //Save shots in memory
    saveShots: true,


    // [jpeg, png] support varies
    // Webcam.OutputTypes
    output: "jpeg",


    //Which camera to use
    //Use Webcam.list() for results
    //false for default device
    device: false,


    // [location, buffer, base64]
    // Webcam.CallbackReturnTypes
    callbackReturn: "location",


    //Logging
    verbose: false

};

//Creates webcam instance
var Webcam = NodeWebcam.create( opts );

//Get list of cameras
Webcam.list( function( list ) {
    console.log(list);

    //Use another device
    var anotherCam = NodeWebcam.create( { ...opts, device: list[ 1 ] } );

    //Will automatically append location output type
    anotherCam.capture( "test_picture", function( err, data ) {} );
});