class Vector {
    x;
    y;

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    static of(x, y) {
        return new Vector(x,y);
    }

    static polar(r, theta) {
        return new Vector(r*Math.cos(theta), r*Math.sin(theta));
    }

    get r() {
        return Math.hypot(this.x,this.y);
    }

    get theta() {
        return Math.atan2(this.y, this.x);
    }

    add = (v) =>  new Vector(this.x+v.x, this.y+v.y);

    subtract = (v) => this.add(v.scale(-1));

    scale = (k) => new Vector(this.x*k, this.y*k);

    dot = (v) => new Vector(this.x*v.x, this.y*v.y);

    norm = () => Vector.polar(1, this.theta);

}

let randomString = (l = 10) => [...Array(l)].map(_ => "abcdefghijklmnopqrstuvwxyz".split("")[Math.floor(Math.random()*26)]).join("");

// p is position
// v is velocity
// plan is a consumer, taking itself and list of other entity positions, then modifying it's v
class Entity {
    p; v; _plan; maxV; id;

    constructor(p, v = new Vector(0,0), maxV = 1e-9, plan = () => {}) {
        this.p = p;
        this.v = v;
        this.maxV = maxV;
        this._plan = plan;
        this.id = randomString();
    }

    static byPath(path, override = {}) {
        console.assert(path.length >= 2, `creating path with < 2 points: ${path}`);

        let {
            maxV = 10
        } = override;

        

        return new Entity(path[0], path[1].subtract(path[0]).norm().scale(maxV), maxV, (e) => {e.v = e.v.scale(.90)});
    }

    plan(o) {
        this._plan(this, o);
    }

    move(t) {
        this.p = this.p.add(this.v.scale(t));
    }
}

class Simulation {
    entities = [];
    onTick = () => {};

    addEntity(e) {
        this.entities.push(e);
    }

    doPlans = () => this.entities.forEach(e => e.plan(this.entities.filter(i => e.id != i.id)));
    doMoves = framerate => this.entities.forEach(e => e.move(framerate));

    timerId = 0;
    start(framerate) {
        this.timerId = setInterval(() => {
            this.doPlans();
            this.doMoves(framerate/1000);
            this.onTick();
        }, framerate);
    }

    stop() {
        clearInterval(this.timerId);
    }
}

window.addEventListener('load', () => {
    let svg = d3.select("#svg1");
    const viewbox = svg.attr("viewBox").split(" ");
    const width = +viewbox[2];
    const height = +viewbox[3];

    const framerate = 500;

    let simulation = new Simulation();
    simulation.addEntity(Entity.byPath([
        Vector.of(0,0),
        Vector.of(width, height)
    ]));

    let entities = svg.selectAll("circle")
        .data(simulation.entities, d => d.id)
        .join("circle")
        .attr("cx", d => d.p.x)
        .attr("cy", d => height - d.p.y)
        .attr("fill", d => d3.interpolateLab("darkgrey", "lightgreen")(d.v.r / d.maxV))
        .attr("r", 5)

    simulation.onTick = () => {
        entities
            .transition()
            .duration(framerate)
            .ease(d3.easeLinear)
            .attr("cx", d => d.p.x)
            .attr("cy", d => height - d.p.y)
            .attr("fill", d => d3.interpolateLab("darkgrey", "lightgreen")(d.v.r / d.maxV))
    }

    simulation.start(framerate);

});