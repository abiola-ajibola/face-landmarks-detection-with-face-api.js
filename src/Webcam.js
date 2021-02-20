import Webcam from 'react-webcam'
import { useRef, useEffect } from 'react'
import * as faceapi from 'face-api.js';
import { DrawFaceLandmarks } from 'face-api.js/build/commonjs/draw';


function Livecam() {
    const camera = useRef()
    async function loadModels() {
        console.log("loading models")
        return await Promise.all([
            faceapi.nets.faceLandmark68TinyNet.loadFromUri("/models"),
            faceapi.nets.tinyFaceDetector.loadFromUri("./models")
        ]).then(() => console.log("models loaded"))
    }

    async function detectFaces() {
        if (camera && camera.current && camera.current.video) {
            console.log("inside if block")
            const { video } = camera.current;
            // (async () => {
            video.onloadedmetadata = () => {
                const canvas = faceapi.createCanvasFromMedia(video)
                document.querySelector("#cam-wrapper").append(canvas)
                const displaySize = { width: video.clientWidth, height: video.clientHeight }
                faceapi.matchDimensions(canvas, displaySize)
                console.log("before if")
                if (canvas) {
                    console.log("after if")
                    setInterval(async () => {
                        const results = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions({})).withFaceLandmarks(true)
                        const resized = faceapi.resizeResults(results, displaySize)
                        // DrawFaceLandmarks()
                        let options = {
                            drawLines: true,
                            drawPoints: false,
                            lineWidth: 1,
                            lineColor: "#00dd00",
                        }
                        
                        /**
                         DrawFaceLandmarksOptions({
                            drawLines: true,
                            drawPoints: false,
                            lineWidth: 1,
                            lineColor: "#00dd00",
                        })
                         */
                        
                        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
                        console.log(resized)
                        faceapi.draw.drawFaceLandmarks(canvas, resized)
                    }, 1000)
                }
            }
        }
    }

    useEffect(() => {
        (async () => {
            console.log("effect")
            await loadModels()
            await detectFaces()
        })()
    })

    return (
        <div id="cam-wrapper">
            <Webcam
                ref={camera}
                audio={false}
            />
        </div>
    )
}

export default Livecam
