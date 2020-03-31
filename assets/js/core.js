window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame;

function getMousePos(canvas, e) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: (e.clientX - rect.left) * canvas.width / rect.width,
        y: (e.clientY - rect.top) * canvas.width / rect.width
    }
}

function getTouchPos(canvas, e) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: (e.touches[0].clientX - rect.left) * canvas.width / rect.width,
        y: (e.touches[0].clientY - rect.top) * canvas.width / rect.width
    }
}

function setHoverAction(canvas, setPosition, cb) {
    canvas.onmousemove = (e) => {
        setPosition(getMousePos(canvas, e));
        cb();
    };

    canvas.ontouchmove = (e) => {
        setPosition(getTouchPos(canvas, e));
        cb();
    };
}

function addDrawLoop(draw, shouldDraw, cb) {
    function drawLoop(){
        requestAnimationFrame(drawLoop);
        if(shouldDraw()) {
            draw();
            if (typeof cb !== 'undefined') cb();
        }
    }
    window.addEventListener("load", drawLoop);
}

function drawOnce(draw, cb) {
    window.addEventListener("load", draw);
    if (typeof cb !== 'undefined') cb();
}