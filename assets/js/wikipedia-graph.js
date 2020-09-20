// svg1: example directed graph
window.addEventListener('load', () => {
    d3.json("/assets/json/wikipedia-graph-example.json").then(data => {
        
        let svg = d3.select("#svg1");
        const viewbox = svg.attr("viewBox").split(" ");
        const width = +viewbox[2];
        const height = +viewbox[3];

        const radius = 10;
        const edgeRadius = 12;

        svg
            .append("defs")
            .append("marker")
            .attr("id", "arrowhead")
            .attr("viewBox","0 -10 10 20")
            .attr("refX",8)
            .attr("markerWidth",5)
            .attr("markerHeight",5)
            .attr("orient","auto")
            .attr("class", "edge")
            .append("path")
            .attr('d', 'M 0,-5 L 10 ,0 L 0,5')

        const edges = svg.append("g")
            .attr("class", "edge")
            .attr("marker-end", "url(#arrowhead)")
            .selectAll("line")
            .data(data.edges)
            .join("line");

        const nodes = svg.append("g")
            .attr("class", "nodes")
            .selectAll("circle")
            .data(data.nodes)
            .join("circle")
            .attr("r", radius);

        const labels = svg.append("g")
            .attr("class", "labels")
            .selectAll("text")
            .data(data.nodes)
            .join("text")
            .text(d => d.label)
            .attr("x", radius*1.2)
            .attr("y", radius*.3)

        const simulation = d3.forceSimulation(data.nodes)
            .force("link", d3.forceLink(data.edges).id(d => d.id).strength(.1))
            .force("charge", d3.forceManyBody().strength(-100))
            .force("center", d3.forceCenter(width / 2, height / 2))
            .on("tick", () => {
                let dist = d => Math.hypot(d.target.x-d.source.x, d.target.y-d.source.y);
                let gapX = d => interpolator(d.source.x,d.target.x,0,dist(d))(edgeRadius) - d.source.x;
                let gapY = d => interpolator(d.source.y,d.target.y,0,dist(d))(edgeRadius) - d.source.y;

                edges
                    .attr("x1", d => d.source.x + gapX(d))
                    .attr("y1", d => d.source.y + gapY(d))
                    .attr("x2", d => d.target.x - gapX(d))
                    .attr("y2", d => d.target.y - gapY(d));

                nodes
                    .attr("cx", d => d.x)
                    .attr("cy", d => d.y)

                labels
                    .attr("transform", d => "translate(" + d.x + "," + d.y + ")")
            });
        
        nodes.call(d3.drag()
            .on("start", event => {
                if (!event.active) simulation.alphaTarget(0.3).restart();
                event.subject.fx = event.subject.x;
                event.subject.fy = event.subject.y;
            })
            .on("drag", event => {
                event.subject.fx = event.x;
                event.subject.fy = event.y;
            })
            .on("end", event => {
                if (!event.active) simulation.alphaTarget(0);
                event.subject.fx = null;
                event.subject.fy = null;
            }));
    });
});

let submit_route_request = () => {
    let getValue = id => {
        let e = document.getElementById(id);
        return e.options[e.selectedIndex].value;
    }
    d3.json(`https://young-bayou-05072.herokuapp.com/wikipedia-route/${getValue('route-start-picker')}/${getValue('route-end-picker')}`).then(data => {
        console.log(data);
        d3.select('.route-output').selectAll("a").remove()
        let div = d3.select('.route-output').selectAll("a").data(data, d => d.id).join("a").attr("href", d => `https://en.wikipedia.org/wiki/${encodeURI(d.replace(/ /g, '_'))}`).append('div').text(d => d)
    })
}

$.fn.select2.defaults.set('language', {
    inputTooShort: () => "Start typing to find pages"
})

$(document).ready(function() {
    $('#route-start-picker').select2({
        placeholder: "Start",
        width: '100%',
        theme: "bootstrap4",
        minimumInputLength: 1
    });
});

$(document).ready(function() {
    $('#route-end-picker').select2({
        placeholder: "End",
        width: '100%',
        theme: "bootstrap4",
        minimumInputLength: 1
    });
});

window.addEventListener('load', () => {
    d3.json("/assets/json/wikipedia-graph-route-options.json").then(data => {
        data.sort((a,b) => a.label < b.label)
        d3.selectAll('.route-picker').selectAll("option").data(data).join("option").order((a,b) => a.label < b.label).attr("value", d => d.id).text(d => d.label)
    });
});