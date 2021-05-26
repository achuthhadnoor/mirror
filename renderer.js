window.onload = async () => {
    const { ipcRenderer } = require('electron')
    const video = document.querySelector('video');
    const vidsrc = document.getElementById('vidsrc');
    const quit = document.getElementById('quit');
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
    vidsrc.onchange = ({ target }) => {
        startVideo(target.value);
    }

    ipcRenderer.on('asynchronous-message', (ev, message) => {
        if (message === 'STOP_VIDEO') {
            localStream.getVideoTracks()[0].stop();
            video.src = '';
            ipcRenderer.send('Hide');
            return;
        }
        startVideo(videoDevices[0].deviceID);
        console.log(ev, message);
    })

    quit.onclick = () => {
        ipcRenderer.send('quit');
    }

    window.addEventListener('resize', (e) => {
        video.height = window.innerHeight;
        video.width = window.innerWidth;
    });
    function startVideo(deviceID) {
        const constraints = {
            video: {
                deviceID: deviceID,
                width: {
                    ideal: 450 // Ideal video width is size of screen
                },
                height: {
                    ideal: 300 // Ideal video height is size of screen
                }
            }
        }
        ipcRenderer.send('Show');
        navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
            video.srcObject = stream;  // Play stream in <video> element
            window.localStream = stream;
        }).catch((error) => {
            console.error(error)
        })
    }
}
