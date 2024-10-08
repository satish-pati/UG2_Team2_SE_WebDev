document.addEventListener('DOMContentLoaded', () => {
    // Function to set up the webcam
    async function setupWebcam() {
        const video = document.getElementById('video');
        const errorMessage = document.getElementById('error-message');
      
        try {
            // Request access to the webcam
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            
            // Attach the video stream to the video element
            video.srcObject = stream;
            
            // Success log
            console.log("Webcam access granted. Streaming video.");
        } catch (error) {
            console.error("Error accessing webcam: ", error);
        errorMessage.innerText = "Error accessing webcam: " + error.message;
        
        // Handle specific errors
        if (error.name === 'NotAllowedError') {
            errorMessage.innerText = "Camera access was denied. Please enable it in your browser settings.";
        } else if (error.name === 'NotFoundError') {
            errorMessage.innerText = "No camera was found on this device.";
        } else if (error.name === 'NotReadableError') {
            errorMessage.innerText = "Camera is already in use by another application.";
        } else if (error.name === 'OverconstrainedError') {
            errorMessage.innerText = "No camera found that satisfies the specified constraints.";
        } else if (error.name === 'SecurityError') {
            errorMessage.innerText = "The operation is insecure, possibly due to page being served over HTTP instead of HTTPS.";
        } else {
            errorMessage.innerText = "An unknown error occurred: " + error.message;
        }
        }
    }

    // Function to start face recognition
    async function startFaceRecognition() {
        try {
            await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
            await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
            await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
            console.log("Face-api.js models loaded.");
        } catch (error) {
            console.error("Error loading models: ", error);
            document.getElementById('error-message').innerText = "Error loading face recognition models.";
            return;
        }

        const video = document.getElementById('video');
      
        video.addEventListener('play', () => {
            const canvas = faceapi.createCanvasFromMedia(video);
            document.body.append(canvas);
            const displaySize = { width: video.width, height: video.height };
            faceapi.matchDimensions(canvas, displaySize);
      
            setInterval(async () => {
                const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
                                            .withFaceLandmarks().withFaceDescriptors();
        
                // Clear the canvas before drawing
                canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
        
                // Resize the detected faces to fit the canvas and draw them
                const resizedDetections = faceapi.resizeResults(detections, displaySize);
                faceapi.draw.drawDetections(canvas, resizedDetections);
                faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
        
                if (detections.length > 0) {
                    console.log('Face detected:', detections);
                }
            }, 100);
        });
    }

    // Set up the webcam when the popup loads
    setupWebcam();

    // Add event listener to the Start Recognition button
    const startButton = document.getElementById('start-btn');
    if (startButton) {
        startButton.addEventListener('click', startFaceRecognition);
    }
});
