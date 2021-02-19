import Webcam from 'react-webcam'
import { useRef, useEffect } from 'react'
import * as faceapi from 'face-api.js';

function Livecam() {
    const camera = useRef()
    async function loadModels() {
        console.log("loading models")
        Promise.all([
            faceapi.nets.faceLandmark68TinyNet.loadFromUri("/models"),
            faceapi.nets.tinyFaceDetector.loadFromUri("./models")
        ]).then(() => console.log("models loaded"))
    }

    async function detectFaces() {

        if (camera && camera.current && camera.current.video) {
            const { video } = camera.current
            const results = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks(true)
            const landmarks = results.length && results[0].landmarks

            if (document.body.contains(document.querySelector(".dot"))) {
                document.querySelectorAll(".dot").forEach(point => point.remove())
            }
            if (landmarks) {
                landmarks.positions.map((point) => {
                    const dot = document.createElement("span")
                    const { _x, _y } = point
                    dot.classList.add("dot")
                    if (dot) {
                        dot.style.top = _y + "px"
                        dot.style.left = _x + "px"
                        document.querySelector("#cam-wrapper").append(dot)
                    }
                })
            }
        }
    }

    useEffect(async () => {
        console.log("effect")
        await loadModels()
    })

    setInterval(async () => {
        await detectFaces()
    }, 1000)

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