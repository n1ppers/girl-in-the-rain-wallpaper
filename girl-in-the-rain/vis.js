window.addEventListener('load', _ => {
    let audio = []
    const bar = {
        //the width at which bars will be located
        //num which is not in brackets must be same as padding.
        widht: (window.innerWidth / 128) - 4,
        //max height of bars
        height: 300,
        //distance between bars
        padding: 4
    }
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    canvas.id = "visualizer"
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    document.body.appendChild(canvas)
    const listener = arr =>{
        audio = arr
    }
    const draw = _ => {
        //color of the bars
        context.fillStyle = "rgba(165, 165, 235, 215)"
        context.clearRect(0, 0, window.innerWidth, window.innerHeight)
        for (const [i, part] of audio.entries()) {
            const x = (i * bar.widht) + ((i + 1) * bar.padding) - (bar.padding / 2)
            const y = 525
            context.fillRect(x, y, bar.widht, bar.height * -part)
        }
        requestAnimationFrame(draw)
    }                   
    window.wallpaperRegisterAudioListener(listener)
    draw()
    })