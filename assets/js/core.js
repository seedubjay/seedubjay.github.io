window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame;

function getMousePosition(canvas, e) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: (e.clientX - rect.left) * canvas.width / rect.width,
        y: (e.clientY - rect.top) * canvas.width / rect.width
    }
}

function getTouchPosition(canvas, e) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: (e.touches[0].clientX - rect.left) * canvas.width / rect.width,
        y: (e.touches[0].clientY - rect.top) * canvas.width / rect.width
    }
}

function setHoverAction(canvas, setPosition, cb) {
    canvas.onmousemove = (e) => {
        setPosition(getMousePosition(canvas, e));
        cb();
    };

    canvas.ontouchmove = (e) => {
        setPosition(getTouchPosition(canvas, e));
        cb();
    };
}

function setEndAction(canvas, cb) {
    canvas.onmouseout = () => cb();
    canvas.ontouchend = () => cb();
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