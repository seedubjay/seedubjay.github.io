window.addEventListener('load', () => {
    let span = document.getElementById('screen-size-gag');
    let setSize = () => span.innerHTML = ` (yours is <span class="tracked-text">${window.innerWidth}x${window.innerHeight}</span>)`;
    setSize();
    window.addEventListener('resize', setSize);
});

window.addEventListener('load', () => {
    let span = document.getElementById('os-gag');
    let tests = ['iPhone', 'iPad', 'Android', 'Windows', 'Mac', 'Linux']
    let labels = {
        'iPhone': 'an iPhone',
        'iPad': 'an iPad',
        'Android': 'an Android device',
        'Windows': 'a Windows machine',
        'Mac': 'a Mac',
        'Linux': 'a Linux machine'
    }
    let res = tests.filter(t => navigator.userAgent.includes(t));
    if (res.length > 0) span.innerHTML = ` (yours is ${labels[res[0]]})`;
});

window.addEventListener('load', () => {
    let span = document.getElementById('os-gag');
    let tests = ['iPhone', 'iPad', 'Android', 'Windows', 'Mac', 'Linux']
    let labels = {
        'iPhone': 'an iPhone',
        'iPad': 'an iPad',
        'Android': 'an Android device',
        'Windows': 'a Windows machine',
        'Mac': 'a Mac',
        'Linux': 'a Linux machine'
    }
    let res = tests.filter(t => navigator.userAgent.includes(t));
    if (res.length > 0) span.innerHTML = ` (yours is ${labels[res[0]]})`;
});

window.addEventListener('load', () => {
    let span = document.getElementById('browser-gag');
    let labels = {
        'Chrome': ['Chrome', 'chrome', 'Chromium', 'CrMo', 'CriMo'],
        'Safari': ['Safari', 'iPhone', 'iPad'],
        'Firefox': ['Firefox'],
        'Samsung Browser': ['Samsung'],
        'Edge': ['Edge']
    }
    for (let label in labels) {
        tests = labels[label]
        let res = tests.filter(t => navigator.userAgent.includes(t));
        if (res.length > 0) {
            span.innerHTML = ` (yours is ${label})`;
            return;
        }
    }
});

window.addEventListener('load', () => {
    let form_group = document.getElementById('form-example')
    let form = form_group.firstElementChild;
    let form_shadow = form_group.firstElementChild.cloneNode(true);
    form_group.appendChild(form_shadow);

    let canvas = document.createElement("canvas")
    let ctx = canvas.getContext('2d');

    function setSize() {
        let cs = window.getComputedStyle(form_shadow);
        canvas.width = cs.getPropertyValue('width').toString().slice(0,-2);
        canvas.height = cs.getPropertyValue('height').toString().slice(0,-2);
    }
    window.addEventListener('resize', setSize);
    setSize();
    form_shadow.appendChild(canvas);

    let delay = 3000;

    let data = [];
    let maxTime = 500;

    let animationID = 0;
    let loop = () => {
        let cur = data[data.length - 1];
        let t = new Date().getTime();
        data = data.filter(d => d.t > t - maxTime);
        if (!data.length) data = [cur];
        ctx.clearRect(0,0,canvas.width,canvas.height);
        
        ctx.lineWidth = 4;
        for (let i = 1; i < data.length; i++) {
            ctx.strokeStyle = `rgba(255,0,0,${1-(t-data[i].t)/maxTime}`;
            ctx.beginPath();
            ctx.moveTo(data[i-1].x, data[i-1].y)
            ctx.lineTo(data[i].x, data[i].y)
            ctx.stroke();
        }

        let d = data[data.length-1];
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(d.x, d.y, 3, 0, 2*Math.PI);
        ctx.fill();

        if (data.length > 1) animationID = requestAnimationFrame(loop);
        else animationID = 0;
    }

    function end() {
        cancelAnimationFrame(animationID);
        animationID = 0;
        ctx.clearRect(0,0,canvas.width,canvas.height);
    }

    setPointerMoveAction(form, (x,y) => setTimeout(() => {
        let t = new Date().getTime();
        data.push({t: t, x: x, y: y});
        if (!animationID) loop();
    }, delay));

    form.addEventListener('mouseout', () => setTimeout(end, delay));
    form.addEventListener('touchup', () => setTimeout(end, delay));

    for (x of ['text', 'range']) {
        let text = form.getElementsByClassName('form-example-' + x)[0];
        let text_shadow = form_shadow.getElementsByClassName('form-example-' + x)[0];
        text.addEventListener('input', () => {let v = text.value; setTimeout(() => {
            text_shadow.value = v;
        }, delay)});
    }

    for (x of ['checkbox1', 'checkbox2', 'checkbox3']) {
        let cb = form.getElementsByClassName('form-example-' + x)[0];
        let cb_shadow = form_shadow.getElementsByClassName('form-example-' + x)[0];
        cb.addEventListener('input', () => {let v = cb.checked; setTimeout(() => {
            cb_shadow.checked = v;
        }, delay)});
    }

    let button = form.getElementsByClassName('form-example-button')[0];
    let button_shadow = form_shadow.getElementsByClassName('form-example-button')[0];
    button.addEventListener('mousedown', () => setTimeout(() => button_shadow.classList.add('active'), delay));
    document.addEventListener('mouseup', () => setTimeout(() => button_shadow.classList.remove('active'), delay));
    button.addEventListener('touchstart', () => setTimeout(() => button_shadow.classList.add('active'), delay));
    document.addEventListener('touchend', () => setTimeout(() => button_shadow.classList.remove('active'), delay));
})


window.addEventListener('load', () => {

    let svg = d3.select("#svg1");
    const viewbox = svg.attr("viewBox").split(" ");
    const outerWidth = +viewbox[2];
    const outerHeight = +viewbox[3];
    
    const graphMargin = {top: 5, right: 5, bottom: 5, left: 15};
    const width = outerWidth - graphMargin.left - graphMargin.right;
    const height = outerHeight - graphMargin.top - graphMargin.bottom;

    let innerSvg = svg
            .append("g")
            .attr("transform", `translate(${graphMargin.left},${graphMargin.top})`)

    let xaxis = innerSvg.append("g")
        .attr("class", "xaxis axis-gridline")
        .attr("transform", "translate(0," + height + ")")

    let yaxis = innerSvg.append("g")
        .attr("class", "yaxis");
    
    innerSvg.append("text")
        .attr("text-anchor", "middle")
        .attr("x", -height/2)
        .attr("y", -5)
        .attr("transform", "rotate(-90)")
        .attr("font-size", 14)
        .text("scroll position")

    let line = innerSvg.append("path")
        .attr("class", "line")
        .attr("fill", "none")
        .attr("stroke", "#797eb9")
        .attr("strokeWidth", 2)

    let data = []
    let minY = 0;
    let maxY = document.body.offsetHeight - window.innerHeight;

    const maxTime = 120000;
    let scrollStarted = false;

    window.addEventListener('scroll', () => {
        if (window.scrollY < minY) minY = window.scrollY;
        if (window.scrollY > maxY) maxY = window.scrollY;
        let d = new Date().getTime()
        scrollStarted |= data.length > 0 && data[0].t < d - maxTime;
        if (data.length > 0) data.push({t: d-1, y: data[data.length-1].y});
        data.push({t: d, y: window.scrollY});
        data = data.filter(v => v.t > d - maxTime);
        if (scrollStarted) data.unshift({t: d - maxTime, y: data[0].y})

        let x = d3.scaleTime()
            .domain(d3.extent(data, d => d.t))
            .range([0, width]);
        xaxis
            .call(d3.axisBottom(x).tickSize(-height));
        
        let y = d3.scaleLinear()
            .domain([minY, maxY])
            .range([0, height]);
        yaxis.call(d3.axisLeft(y).tickSize(0))
        
        line
            .datum(data)
            .attr("d", d3.line()
                .x(d => x(d.t))
                .y(d => y(d.y))
        );
    })

});

window.addEventListener('load', () => {
    let setButton = document.getElementById('set-cookie');
    let K = 60*60*24*2;
    setButton.onclick = () => {
        if (id) return;
        document.cookie = `timeout=${new Date().getTime() + K*1000};max-age=${K}`;
        id = setInterval(loop, 100);
    }

    let deleteButton = document.getElementById('delete-cookie');
    deleteButton.onclick = () => {
        document.cookie = "timeout=0;expires=Thu, 01 Jan 1970 00:00:01 GMT";
    }
    
    function getTimeout() {
        let decodedCookie = decodeURIComponent(document.cookie);
        let timeout = decodedCookie.split(';').filter(x => x.startsWith('timeout='))[0]
        if (!timeout) {
            return 0;
        } else {
            timeout = parseInt(timeout.slice(8)) - (new Date().getTime());
            return Math.max(timeout/1000, 0);
        }
    }

    let id = setInterval(loop, 100);

    function loop() {
        let t = getTimeout();
        if (!t) {
            setButton.disabled = false;
            deleteButton.classList.add('hidden');
            setButton.innerText = "Set a pointless cookie"
            clearInterval(id);
            id = 0;
        } else {
            setButton.disabled = true;
            deleteButton.classList.remove('hidden');
            let h = Math.floor(t/3600);
            t %= 3600;
            let m = Math.floor(t/60);
            if (m < 10) m = '0'+m;
            t %= 60;
            let s = Math.floor(t);
            if (s < 10) s = '0'+s;
            t %= 1;
            let ms = Math.floor(t*10);
            setButton.innerText = `${h}:${m}:${s}.${ms}`
        }
    }
})