function pointAlongPath(path, progress) {
    if (progress < 0) return path[0];
    for (let i = 1; i < path.length; i++) {
        let l = Math.hypot(path[i][0]-path[i-1][0], path[i][1]-path[i-1][1]);
        if (progress < l) {
            let k = progress / l;
            return [
                path[i-1][0]*(1-k) + path[i][0]*k,
                path[i-1][1]*(1-k) + path[i][1]*k
            ]
        } else {
            progress -= l;
        }
    }
    return path[path.length-1];
}

// svg1: example directed graph
window.addEventListener('load', () => {
    
    let svg = d3.select("#svg1");
    const viewbox = svg.attr("viewBox").split(" ");
    const width = +viewbox[2];
    const height = +viewbox[3];

    let paths = [[[0, height/2], [width + 100, height/2]]];
    let pathLengths = paths.map(p => {
        let total = 0;
        for (let i = 1; i < p.length; i++) total += Math.hypot(p[i][0]-p[i-1][0], p[i][1] - p[i-1][1]);
        return total;
    })

    svg.append("g")
        .attr("class", "paths")
        .selectAll("path")
        .data(paths)
        .join("path")
        .attr("d", d => d3.line()(d));

    let cars = [];
    let carCount = 0;

    let carContainer = svg.append("g")
        .attr("class", "cars");

    let carLength = 50;
    let accelerate = 100;
    let deccelerate_factor = 80;
    let v_max = 200;
    let d_optimal = 50;
    let d_scale = 5; // at d_scale*d_optimal distance away, car accelerates at a_max

    let prevTime = 0;
    addDrawLoop(() => {

        if (prevTime == 0) {
            prevTime = Date.now();
            return;
        }

        let dt = (Date.now() - prevTime) / 1000;
        prevTime = Date.now();

        let nextCar = paths.map(_ => 1e9);
        for (let i = 0; i < cars.length; i++) {
            let d = nextCar[cars[i].path] - (cars[i].progress + cars[i].length/2);
            nextCar[cars[i].path] = cars[i].progress - cars[i].length/2;

            let a = d < d_optimal ? -deccelerate_factor * d_optimal / d : accelerate;
            cars[i].v = clamp(cars[i].v + a * dt, 0, v_max);
            cars[i].progress = Math.min(cars[i].progress + cars[i].v * dt, pathLengths[cars[i].path]);
            cars[i].position = pointAlongPath(paths[cars[i].path], cars[i].progress);
        }

        cars = cars.filter(c => c.progress < pathLengths[c.path]);

        for (let i = 0; i < paths.length; i++) {
            if (nextCar[i] > d_optimal + carLength) cars.push({path: i, progress: 0, length: carLength, v: v_max, position: paths[i][0], id: (carCount++).toString()});
        }

        carContainer.selectAll("circle")
            .data(cars, c => c.id)
            .join(
                enter => enter
                    .append("circle")
                    .attr("r", 20)
                    .attr("fill", "red")
                    .attr("cx", d => d.position[0])
                    .attr("cy", d => d.position[1])
                    .on("click", (e,d) => {
                        d.v = Math.max(d.v-100, 0);
                    }),
                update => update
                    .attr("cx", d => d.position[0])
                    .attr("cy", d => d.position[1])
            )

    });
});