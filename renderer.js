window.onload = async () => {
    const { ipcRenderer } = require('electron')
    const video = document.querySelector('video');
    const vidsrc = document.getElementById('vidsrc');
    const constraints = {
        video: {
            width: {
                ideal: 450 // Ideal video width is size of screen
            },
            height: {
                ideal: 300 // Ideal video height is size of screen
            }
        }
    }
    var devices = await navigator.mediaDevices.enumerateDevices();
    console.log(devices);
    devices.map((device) => {
        if (device.kind === 'videoinput') {
            var op = document.createElement('option');
            op.value = device.deviceId;
            op.innerText = device.label;
            vidsrc.appendChild(op)
        }
    })

    navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
        video.srcObject = stream  // Play stream in <video> element
    }).catch((error) => {
        console.error(error)
    })
    ipcRenderer.on('asynchronous-message', (ev, message) => {
        if ('STOP_VIDEO') {
            console.log('message');
            video.srcObject = ''
        }
        else {
            navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
                video.srcObject = stream  // Play stream in <video> element
            }).catch((error) => {
                console.error(error)
            })
        }
        console.log(ev, message);
    })
    window.addEventListener('resize', (e) => {
        video.height = window.innerHeight;
        video.width = window.innerWidth;
    });
}