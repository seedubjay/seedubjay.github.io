// window.addEventListener('load', () => {

//     let ab_group = navigator.userAgent.split('').reduce((h, v, i) => h = (h*(v.charCodeAt(0) + 256*i)) % 1000000003, 1) % 2 ? 'A':'B';
//     console.log("AB group:", ab_group)

//     let setButton = document.getElementById('set-cookie');
//     let K = 60*60*24*2;

//     let previous_cookie_id = null;
//     let previous_delete_time = null;

//     setButton.onclick = () => {
//         if (id) return;
//         let cookie_id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
//         document.cookie = `timeout=${new Date().getTime() + K*1000};max-age=${K}`;
//         document.cookie = `cookie_id=${cookie_id};max-age=${K}`;
//         id = setInterval(loop, 100);

//         console.log((new Date().getTime()) - previous_delete_time);
//         if (previous_delete_time && (new Date().getTime()) - previous_delete_time < 30000) {
//             fetch('https://api.seedubjay.com/internet-tracking/cancel-cookie', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify({
//                     cookie_id: previous_cookie_id
//                 })
//             })    
//         }

//         fetch('https://api.seedubjay.com/internet-tracking/set-cookie', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({
//                 cookie_id: cookie_id,
//                 ab_group: ab_group
//             })
//         })
//         // }).then(resp => resp.text())
//         //   .then(text => console.log("Start AB test:", text));
//     }

//     function getCookieId() {
//         let decodedCookie = decodeURIComponent(document.cookie);
//         let item = decodedCookie.split(';').map(x => x.trim()).filter(x => x.startsWith('cookie_id='))[0];
//         if (!item) return null;
//         return item.slice(10);
//     }

//     let deleteButton = document.getElementById('delete-cookie');

//     if (ab_group == 'A') {
//         deleteButton.classList.add('btn-outline-secondary')
//         deleteButton.innerText = 'Undo'
//         // myDeleteButton.classList.add('btn-outline-secondary')
//         // myDeleteButton.innerText = 'Undo'
//         // otherDeleteButton.classList.add('btn-danger')
//         // otherDeleteButton.innerText = 'Clean up'
//     } else {
//         deleteButton.classList.add('btn-danger')
//         deleteButton.innerText = 'Clean up'
//         // myDeleteButton.classList.add('btn-danger')
//         // myDeleteButton.innerText = 'Clean up'
//         // otherDeleteButton.classList.add('btn-outline-secondary')
//         // otherDeleteButton.innerText = 'Undo'
//     }

//     deleteButton.onclick = () => {
//         document.cookie = "timeout=0;expires=Thu, 01 Jan 1970 00:00:01 GMT";
//         let cookie_id = getCookieId();
//         document.cookie = "cookie_id=0;expires=Thu, 01 Jan 1970 00:00:01 GMT";
//         if (!cookie_id) return;

//         fetch('https://api.seedubjay.com/internet-tracking/delete-cookie', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({
//                 cookie_id: cookie_id
//             })
//         })
//         .then(resp => resp.text())
//           .then(text => {
//               if (text == "Success - removed") {
//                 previous_cookie_id = cookie_id;
//                 previous_delete_time = new Date().getTime();
//               }
//           });
//     }
    
//     function getTimeout() {
//         let decodedCookie = decodeURIComponent(document.cookie);
//         let timeout = decodedCookie.split(';').map(x => x.trim()).filter(x => x.startsWith('timeout='))[0]
//         if (!timeout) {
//             return 0;
//         } else {
//             timeout = parseInt(timeout.slice(8)) - (new Date().getTime());
//             return Math.max(timeout/1000, 0);
//         }
//     }

//     let id = setInterval(loop, 100);

//     function loop() {
//         let t = getTimeout();
//         if (!t) {
//             setButton.disabled = false;
//             deleteButton.classList.add('hidden');
//             setButton.innerText = "Set a pointless cookie"
//             clearInterval(id);
//             id = 0;
//         } else {
//             setButton.disabled = true;
//             deleteButton.classList.remove('hidden');
//             let h = Math.floor(t/3600);
//             t %= 3600;
//             let m = Math.floor(t/60);
//             if (m < 10) m = '0'+m;
//             t %= 60;
//             let s = Math.floor(t);
//             if (s < 10) s = '0'+s;
//             t %= 1;
//             let ms = Math.floor(t*10);
//             setButton.innerText = `${h}:${m}:${s}.${ms}`
//         }
//     }
// })

// window.addEventListener('load', () => {

//     const graphMargin = {top: 15, right: 0, bottom: 2, left: 0}

//     // document.getElementById('ab-test-axis-labels').style.padding = `0 ${graphMargin.right+2}px 0 ${graphMargin.left+2}px`
    
//     fetch("https://api.seedubjay.com/internet-tracking/results")
//         .then(resp => resp.json())
//         .then(json => {
//             let svg = d3.select("#svg2");
//             const viewbox = svg.attr("viewBox").split(" ");
//             const boxWidth = +viewbox[2];
//             const boxHeight = +viewbox[3];

//             const width = boxWidth - graphMargin.left - graphMargin.right;
//             const height = boxHeight - graphMargin.top - graphMargin.bottom;

//             let innerSvg = svg
//                 .append("g")
//                 .attr("transform", `translate(${graphMargin.left},${graphMargin.top})`)

//             let x = d3.scaleBand()
//                 .domain(['A','B'])
//                 .range([0, width])
//                 .padding(.4);

//             let y = d3.scaleLinear()
//                 .domain([1e-12,1.05])
//                 .range([height,0]);

//             innerSvg.append("g")
//                 .attr("class", "axis-gridline")
//                 .attr("font-size", null)
//                 .call(d3.axisLeft(y)
//                         .ticks(4, "%")
//                         .tickSize(-width))
//                 .selectAll("g")
//                 .selectAll("text")
//                 .attr("text-anchor", "start")
//                 .attr("font-size", 8)
//                 .attr("x", 0)
//                 .attr("y", -2)
//                 .attr("dy", 0);

//             // innerSvg.append("text")
//             //     .attr("text-anchor", "middle")
//             //     .attr("x", -height/2)
//             //     .attr("y", -10)
//             //     .attr("transform", "rotate(-90)")
//             //     .attr("font-size", 12)
//             //     .text("kept cookie")

//             innerSvg.append("g")
//                 .attr("class", "bar-chart")
//                 .selectAll("rect")
//                 .data(json)
//                 .join("rect")
//                 .attr("x", d => x(d.group))
//                 .attr("y", d => y(1-d.kept))
//                 .attr("width", x.bandwidth())
//                 .attr("height", d => height - y(1-d.kept))  
            
//             innerSvg.append("g")
//                 .attr("transform", `translate(0,${height})`)
//                 .call(d3.axisBottom(x)
//                         .tickSize(0)
//                         .tickFormat(""))
//                 .selectAll("text")
            
//             svg.append("text")
//                 .attr("text-anchor", "middle")
//                 .attr("x", width/2)
//                 .attr("y", 0)
//                 .attr("dy", "1em")
//                 .attr("font-size", 12)
//                 .text("% readers who removed the cookie")
//         })
// })