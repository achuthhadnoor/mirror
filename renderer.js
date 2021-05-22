window.onload = async () => {
    const { ipcRenderer } = require('electron')
    const video = document.querySelector('video');
    const vidsrc = document.getElementById('vidsrc');
    let videoDevices = [];
    var devices = await navigator.mediaDevices.enumerateDevices();

    console.log(devices);
    devices.map((device) => {
        if (device.kind === 'videoinput') {
            videoDevices.push(device);
            var op = document.createElement('option');
            op.value = device.deviceId;
            op.innerText = device.label;
            vidsrc.appendChild(op)
        }
    })
    startVideo(videoDevices[0].deviceID);
    vidsrc.onchange = ({target})=>{
        startVideo(target.value);
    }

    ipcRenderer.on('asynchronous-message', (ev, message) => {
        if ('STOP_VIDEO') {
            console.log('message');
            video.srcObject = ''
        }
        else {
            startVideo(videoDevices[0].deviceID);
        }
        console.log(ev, message);
    })
    window.addEventListener('resize', (e) => {
        video.height = window.innerHeight;
        video.width = window.innerWidth;
    });
    function startVideo(deviceID) {

        const constraints = {
            video: {
                deviceID : deviceID,
                width: {
                    ideal: 450 // Ideal video width is size of screen
                },
                height: {
                    ideal: 300 // Ideal video height is size of screen
                }
            }
        }
        navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
            video.srcObject = stream  // Play stream in <video> element
        }).catch((error) => {
            console.error(error)
        })
    }
}
