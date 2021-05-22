(() => {
    const { ipcRenderer } = require('electron')
    const video = document.querySelector('video')
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

    window.addEventListener('resize', (e) => {
        video.height = window.innerHeight;
        video.width = window.innerWidth;
    });
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
})();