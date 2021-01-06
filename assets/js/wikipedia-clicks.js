// svg1: example directed graph
window.addEventListener('load', () => {
    d3.json("/assets/json/wikipedia-graph-example.json").then(data => {

        let svg = d3.select("#svg1");
        const viewbox = svg.attr("viewBox").split(" ");
        const width = +viewbox[2];
        const height = +viewbox[3];

        const radius = 10;
        const edgeRadius = 13;

        svg
            .append("defs")
            .append("marker")
            .attr("id", "arrowhead")
            .attr("viewBox","0 -10 10 20")
            .attr("refX",6)
            .attr("markerWidth",6)
            .attr("markerHeight",6)
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
            .attr("text-anchor", "middle")
            .attr("y", radius*.3)
        
        const simulation = d3.forceSimulation(data.nodes)
            .force("link", d3.forceLink(data.edges).id(d => d.id).strength(.03))
            .force("charge", d3.forceManyBody().strength(-50))
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

        labels.call(d3.drag()
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

window.addEventListener('load', () => {
    d3.json("/assets/json/wikipedia-graph-path-length-frequency.json").then(data => {
        let svg = d3.select("#svg2");
        const viewbox = svg.attr("viewBox").split(" ");
        const boxWidth = +viewbox[2];
        const boxHeight = +viewbox[3];

        const graphMargin = {top: 5, right: 5, bottom: 40, left: 25}

        const width = boxWidth - graphMargin.left - graphMargin.right;
        const height = boxHeight - graphMargin.top - graphMargin.bottom;

        const maxX = 10;

        let innerSvg = svg
            .append("g")
            .attr("transform", `translate(${graphMargin.left},${graphMargin.top})`)

        let x = d3.scaleBand()
            .domain([...Array(maxX).keys()].splice(1))
            .range([0, width])
            .padding(.2);

        let y = d3.scaleLinear()
            .domain([1e-12,.52])
            .range([height,0]);

        innerSvg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x));

        innerSvg.append("text")
            .attr("text-anchor", "middle")
            .attr("x", width/2)
            .attr("y", height + 20)
            .attr("dy", "1em")
            .attr("font-size", 12)
            .text("# clicks to get to target page")
        
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

        innerSvg.append("text")
            .attr("text-anchor", "middle")
            .attr("x", -height/2)
            .attr("y", -10)
            .attr("transform", "rotate(-90)")
            .attr("font-size", 12)
            .text("probability")

        innerSvg.append("g")
            .attr("class", "bar-chart")
            .selectAll("rect")
            .data(data)
            .join("rect")
            .attr("x", d => x(d.x))
            .attr("y", d => y(d.y))
            .attr("width", x.bandwidth())
            .attr("height", d => height - y(d.y))
    });
});

window.addEventListener('load', () => {
    d3.json("/assets/json/wikipedia-graph-betweenness-centrality.json").then(data => {
        let svg = d3.select("#svg3");
        const viewbox = svg.attr("viewBox").split(" ");
        const boxWidth = +viewbox[2];
        const boxHeight = +viewbox[3];

        const graphMargin = {top: 30, right: 5, bottom: 5, left: 160}

        const width = boxWidth - graphMargin.left - graphMargin.right;
        const height = boxHeight - graphMargin.top - graphMargin.bottom;

        data = data.splice(0,30)

        svg.append("rect")
            .attr("width", "100%")
            .attr("height", "100%")
            .attr("fill", "white")

        svg.append("text")
            .attr("text-anchor", "middle")
            .attr("x", boxWidth/2)
            .attr("y", 2)
            .attr("dy", "1em")
            .attr("font-size", 12)
            .text("Most useful pages for beating the Wikipedia Game")
        svg.append("text")
            .attr("text-anchor", "middle")
            .attr("x", boxWidth/2)
            .attr("y", 18)
            .attr("dy", "1em")
            .attr("font-size", 8)
            .text("(as defined by betweenness centrality -- details in comments)")


        

        let innerSvg = svg
            .append("g")
            .attr("transform", `translate(${graphMargin.left},${graphMargin.top})`)

        let y = d3.scaleBand()
            .domain(data.map(d=>d.title))
            .range([0, height])
            .padding(.2);

        let x = d3.scaleLinear()
            .domain([1e-12,.035])
            .range([0,width]);

        innerSvg.append("g")
            .attr("class", "axis-gridline")
            .attr("font-size", null)
            .call(d3.axisTop(x)
                    .ticks(4, "%")
                    .tickSize(-height))
            .call(g => g.select(".domain").remove())
            .selectAll("g")
            .selectAll("text")
            .attr("text-anchor", "start")
            .attr("font-size", 8)
            .attr("x", 1)
            .attr("y", height-1)
            .attr("dy", 0);

        innerSvg.append("g")
            .attr("class", "bar-chart")
            .selectAll("rect")
            .data(data)
            .join("rect")
            .attr("x", 0)
            .attr("y", d => y(d.title))
            .attr("width", d => x(d.value))
            .attr("height", y.bandwidth())

        innerSvg.append("g")
            .call(d3.axisLeft(y).tickSize(0))
            .selectAll("g")
            .selectAll("text")
            .attr("color", 'black')
            .attr("font-size", 7)
            .attr("font-family", "'Ubuntu Mono', Monaco, monospace");
        
        // Set-up the export button
        d3.select('#saveButton').on('click', function(){
            // addInlineStyling([svg]);
            // addInlineStyling(svg.selectAll('.bar-chart rect').nodes());
            d3.selectAll('#svg3, #svg3 .bar-chart rect, .axis-gridline .domain, .tick line').each(function() {
                var element = this;
                var computedStyle = getComputedStyle(element, null);
                for (var i = 0; i < computedStyle.length; i++) {
                  var property = computedStyle.item(i);
                  var value = computedStyle.getPropertyValue(property);
                  element.style[property] = value;
                }
              });
            console.log(svg.selectAll('.bar-chart rect').nodes())
            var svgString = getSVGString(svg.node());
            svgString2Image( svgString, 4*boxWidth, 4*boxHeight, 'png', save ); // passes Blob and filesize String to the callback

            function save( dataBlob, filesize ){
                saveAs( dataBlob, 'D3 vis exported to PNG.png' ); // FileSaver.js function
            }
        });
    });
});

function get_wiki_query(parameter, values) {
    return fetch(`https://en.wikipedia.org/w/api.php?&origin=*&action=query&format=json&formatversion=2&${parameter}=${values.map(x => encodeURI(x.toString().replace(/ /g, '_'))).join('|')}`)
        .then(response => response.json())
        .then(data => data.query)
}

// path query
function submit_route_request() {
    let getValue = id => {
        let e = document.getElementById(id);
        return e.options[e.selectedIndex].value;
    }
    let s = getValue('route-start-picker');
    let e = getValue('route-end-picker');

    let outdiv = document.getElementsByClassName('route-output')[0]
    let submitbutton = document.getElementById('route-submit');

    if (!s || !e) {
        outdiv.innerHTML = '<div class="error">start/end missing!</div>'
    } else {

        if (window.plausible) plausible('wikipedia-clicks route')

        submitbutton.disabled = true;
        submitbutton.innerHTML = '<span class="spinner-border spinner-border-sm"></span>';

        get_wiki_query('titles', [s,e]).then(query => {
            let pmap = {}
            query.pages.forEach(v => {
                pmap[v.title] = v.pageid;
            });
            fetch(`https://api.seedubjay.com/wikipedia-clicks/path?source=${pmap[s]}&target=${pmap[e]}`)
                .then(resp => {
                    if (resp.status !== 200) {
                        resp.json().then(data => {
                            if (resp.status === 400 && (data.no_source || data.no_target)) {
                                outdiv.innerHTML = `<div class="error">sorry! page(s) are too obscure...</div>`
                            } else {
                                outdiv.innerHTML = '<div class="error">oops! something went wrong...</div>';
                            }

                            submitbutton.disabled = false;
                            submitbutton.innerHTML = 'Search';

                        })
                    } else {
                        return resp.json().then((data) => {
                            get_wiki_query('pageids', data).then(query => {
                                let tmap = {}
                                query.pages.forEach(v => {
                                    tmap[v.pageid] = v.title;
                                });
                                outdiv.innerHTML = data
                                    .map(x => tmap[x])
                                    .map(x => `<a href="https://en.wikipedia.org/wiki/${encodeURI(x.replace(/ /g, '_'))}"><div>${x}</div></a>`)
                                    .join('\n');
                                submitbutton.disabled = false;
                                submitbutton.innerHTML = 'Search';
                            })
                        }).catch(error => {
                            outdiv.innerHTML = '<div class="error">oops! something went wrong...</div>'
                            submitbutton.disabled = false;
                            submitbutton.innerHTML = 'Search';
                        })
                    }
                })
        })
    }
}
window.addEventListener('load', () => {
    $.fn.select2.defaults.set('language', {
        inputTooShort: () => ""
    })
    
    let search = {
        url: "https://en.wikipedia.org/w/api.php",
        dataType: 'jsonp',
        data: params => ({
            action: 'opensearch',
            format: 'json',
            formatversion: 2,
            search: params.term,
            redirects: 'resolve',
            namespace: 0,
            limit: 10
        }),
        processResults: data => {
            return {
                results: data[1].map((l,i) => ({id: l, text: l}))
            }
        }
    }

    $('#route-start-picker').select2({
        placeholder: "Start",
        width: '100%',
        theme: "bootstrap4",
        minimumInputLength: 1,
        ajax: search
    });

    $('#route-end-picker').select2({
        placeholder: "End",
        width: '100%',
        theme: "bootstrap4",
        minimumInputLength: 1,
        ajax: search
    });
});















function addInlineStyling(elements) {
    if(elements && elements.length) {
      elements.forEach(function(d) {
       d3.selectAll(d.el).each(function(){
        var element = this;
        if(d.properties && d.properties.length) {
          d.properties.forEach(function(prop) {
            var computedStyle = getComputedStyle(element, null),
              value = computedStyle.getPropertyValue(prop);
            console.log(computedStyle);
            element.style[prop] = value;
          });
        }
      });
     });
    }
  }

// Below are the functions that handle actual exporting:
// getSVGString ( svgNode ) and svgString2Image( svgString, width, height, format, callback )
function getSVGString( svgNode ) {
    svgNode.setAttribute('xlink', 'http://www.w3.org/1999/xlink');
    var cssStyleText = getCSSStyles( svgNode );
    appendCSS( cssStyleText, svgNode );

    var serializer = new XMLSerializer();
    var svgString = serializer.serializeToString(svgNode);
    svgString = svgString.replace(/(\w+)?:?xlink=/g, 'xmlns:xlink='); // Fix root xlink without namespace
    svgString = svgString.replace(/NS\d+:href/g, 'xlink:href'); // Safari NS namespace fix

    return svgString;

    function getCSSStyles( parentElement ) {
        var selectorTextArr = [];

        // Add Parent element Id and Classes to the list
        selectorTextArr.push( '#'+parentElement.id );
        for (var c = 0; c < parentElement.classList.length; c++)
                if ( !contains('.'+parentElement.classList[c], selectorTextArr) )
                    selectorTextArr.push( '.'+parentElement.classList[c] );

        // Add Children element Ids and Classes to the list
        var nodes = parentElement.getElementsByTagName("*");
        for (var i = 0; i < nodes.length; i++) {
            var id = nodes[i].id;
            if ( !contains('#'+id, selectorTextArr) )
                selectorTextArr.push( '#'+id );

            var classes = nodes[i].classList;
            for (var c = 0; c < classes.length; c++)
                if ( !contains('.'+classes[c], selectorTextArr) )
                    selectorTextArr.push( '.'+classes[c] );
        }

        // Extract CSS Rules
        var extractedCSSText = "";
        for (var i = 0; i < document.styleSheets.length; i++) {
            var s = document.styleSheets[i];
            
            try {
                if(!s.cssRules) continue;
            } catch( e ) {
                    if(e.name !== 'SecurityError') throw e; // for Firefox
                    continue;
                }

            var cssRules = s.cssRules;
            for (var r = 0; r < cssRules.length; r++) {
                if ( contains( cssRules[r].selectorText, selectorTextArr ) )
                    extractedCSSText += cssRules[r].cssText;
            }
        }
        

        return extractedCSSText;

        function contains(str,arr) {
            return arr.indexOf( str ) === -1 ? false : true;
        }

    }

    function appendCSS( cssText, element ) {
        var styleElement = document.createElement("style");
        styleElement.setAttribute("type","text/css"); 
        styleElement.innerHTML = cssText;
        var refNode = element.hasChildNodes() ? element.children[0] : null;
        element.insertBefore( styleElement, refNode );
    }
}


function svgString2Image( svgString, width, height, format, callback ) {
    var format = format ? format : 'png';

    var imgsrc = 'data:image/svg+xml;base64,'+ btoa( unescape( encodeURIComponent( svgString ) ) ); // Convert SVG string to data URL

    var canvas = document.createElement("canvas");
    var context = canvas.getContext("2d");

    canvas.width = width;
    canvas.height = height;

    var image = new Image();
    image.onload = function() {
        context.clearRect ( 0, 0, width, height );
        context.drawImage(image, 0, 0, width, height);

        canvas.toBlob( function(blob) {
            var filesize = Math.round( blob.length/1024 ) + ' KB';
            if ( callback ) callback( blob, filesize );
        });

        
    };

    image.src = imgsrc;
}