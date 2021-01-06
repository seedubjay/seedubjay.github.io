window.addEventListener('load', () => {

    const figure = document.getElementById('figure-width');

    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext("2d");
    
    let data = [];
    let maxTime = 500;

    function setSize() {
        let width = figure.clientWidth;
        let height = width / window.innerWidth * window.innerHeight;
        let maxHeight = width * .5;
        if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
        }
        canvas.width = width;
        canvas.height = height;
    }
    setSize();
    window.addEventListener('resize', setSize);

    function setCursor(c) {
        let t = new Date().getTime();
        data.push({t: t, x: c.clientX, y: c.clientY});
        data = data.filter(d => d.t > t - maxTime);
        ctx.clearRect(0,0,canvas.width,canvas.height);
        
        ctx.lineWidth = 4;
        for (let i = 1; i < data.length; i++) {
            ctx.strokeStyle = `rgba(255,0,0,${1-(t-data[i].t)/maxTime}`;
            ctx.beginPath();
            ctx.moveTo(data[i-1].x / window.innerWidth * canvas.width, data[i-1].y / window.innerHeight * canvas.height)
            ctx.lineTo(data[i].x / window.innerWidth * canvas.width, data[i].y / window.innerHeight * canvas.height)
            ctx.stroke();
        }

        let d = data[data.length-1];
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(d.x / window.innerWidth * canvas.width, d.y / window.innerHeight * canvas.height, 2, 0, 2*Math.PI);
        ctx.fill();
    }

    window.addEventListener('mousemove', setCursor);
    window.addEventListener('touchmove', e => setCursor(e.touches[0]));

});

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

    const maxTime = 30000;
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
