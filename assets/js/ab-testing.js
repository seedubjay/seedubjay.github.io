ab_group = Math.random() < .5 ? 'A' : 'B';
other_ab_group = ab_group == 'A' ? 'B' : 'A';

if (ab_group == 'B') {
    for (let span of document.getElementsByClassName('ab-tested')) {
        span.innerHTML = "a <i>'Buy now!'</i> button"
    };
}

setTimeout(() => {
    fetch('https://api.seedubjay.com/ab-testing/submit-data', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            'ab_group': ab_group,
            'scroll_position': window.scrollY / (document.body.offsetHeight - window.innerHeight)
        })
    }).then(function(response) {
        return response.text();
    }).then(function(data) {
        console.log(data)
    });
}, 3000)

window.addEventListener('load', () => {

    const graphMargin = {top: 15, right: 5, bottom: 15, left: 5}

    fetch("https://api.seedubjay.com/ab-testing/results")
        .then(resp => resp.json())
        .then(json => {
            let svg = d3.select("#svg2");
            const viewbox = svg.attr("viewBox").split(" ");
            const boxWidth = +viewbox[2];
            const boxHeight = +viewbox[3];

            const width = boxWidth - graphMargin.left - graphMargin.right;
            const height = boxHeight - graphMargin.top - graphMargin.bottom;

            let innerSvg = svg
                .append("g")
                .attr("transform", `translate(${graphMargin.left},${graphMargin.top})`)

            let x = d3.scaleBand()
                .domain(['Your group','Other group'])
                .range([0, width])
                .padding(.4);

            let y = d3.scaleLinear()
                .domain([1e-12,1.05])
                .range([height,0]);

            innerSvg.append("g")
                .attr("class", "axis-gridline")
                .attr("font-size", null)
                .call(d3.axisLeft(y)
                        .ticks(4, "%")
                        .tickSize(-width))
                .selectAll("g")
                .selectAll("text")
                .attr("text-anchor", "start")
                .attr("font-size", 8)
                .attr("x", 0)
                .attr("y", -2)
                .attr("dy", 0);

            innerSvg.append("g")
                .attr("class", "bar-chart")
                .selectAll("rect")
                .data(json)
                .join("rect")
                .attr("x", d => x(d.group == ab_group ? 'Your group' : 'Other group'))
                .attr("y", d => y(d.scroll))
                .attr("width", x.bandwidth())
                .attr("height", d => height - y(d.scroll))  
            
            innerSvg.append("g")
                .attr("transform", `translate(0,${height})`)
                .call(d3.axisBottom(x)
                        .tickSize(0))
                .selectAll("text")
            
            svg.append("text")
                .attr("text-anchor", "middle")
                .attr("x", width/2)
                .attr("y", 0)
                .attr("dy", "1em")
                .attr("font-size", 12)
                .text("progress through page after 30s")
        })
})