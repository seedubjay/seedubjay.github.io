
let globeFigure = document.getElementById('earth3d');
let globeSize = 600;

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera( 75, 1, 0.1, 1000 );

let renderer = new THREE.WebGLRenderer();
renderer.setSize( globeSize, globeSize, false );
renderer.setClearColor( '#ffffff', 1 );
renderer.domElement.classList.add('diagram');
renderer.domElement.classList.add('interactive');
globeFigure.appendChild( renderer.domElement );


let geometry = new THREE.SphereGeometry(1, 32, 32);
let material = new THREE.MeshBasicMaterial( {color: 0xffffff} );//new THREE.MeshPhongMaterial();
material.map = new THREE.TextureLoader().load('/assets/jpg/earth-texture-map-1024.jpg');
let earth = new THREE.Mesh(geometry, material);
let model = new THREE.Group()
model.add(earth)

for (let i = 0; i < 22; i++) {
    let satellite = new THREE.Mesh(new THREE.SphereGeometry(.025, 16, 16), new THREE.MeshBasicMaterial( {color: 0xff0000 }));
    satellite.position.random().multiplyScalar(2).addScalar(-1).normalize().multiplyScalar(1.3);
    model.add(satellite);
}

scene.add(model)

camera.position.z = 2.5;

animate();

renderer.domElement.addEventListener( 'mousedown', onMouseDown, false );
renderer.domElement.addEventListener( 'touchstart', onTouchDown, false );

var targetRotationX = .25;
var targetRotationOnMouseDownX = 0;

var targetRotationY = 0;
var targetRotationOnMouseDownY = 0;

var mouseX = 0;
var mouseXPrev = 0;

var mouseY = 0;
var mouseYPrev = 0;

var slowingFactor = 0.1;

function onStart(x,y) {
    mouseXPrev = x;
    targetRotationOnMouseDownX = targetRotationX;
    mouseYPrev = y;
    targetRotationOnMouseDownY = targetRotationY;
}

function onMouseDown( event ) {
    event.preventDefault();
    document.addEventListener( 'mousemove', onMouseMove, false );
    document.addEventListener( 'mouseup', onMouseEnd, false );
    document.addEventListener( 'mouseout', onMouseEnd, false );
    onStart(event.clientX, event.clientY);
}

function onTouchDown( event ) {
    event.preventDefault();
    document.addEventListener( 'touchmove', onTouchMove, false );
    document.addEventListener( 'touchend', onTouchEnd, false );
    document.addEventListener( 'touchleave', onTouchEnd, false );
    onStart(event.touches[0].clientX, event.touches[0].clientY);
}

function onMove(x,y) {
    let scale = .25 / renderer.domElement.clientWidth;
    mouseX = x;
    targetRotationX += ( mouseX - mouseXPrev ) * scale;
    mouseXPrev = mouseX;
    mouseY = y;
    targetRotationY += ( mouseY - mouseYPrev ) * scale;
    mouseYPrev = mouseY;
}

function onMouseMove( event ) {
    onMove(event.clientX, event.clientY);
}

function onTouchMove( event ) {
    onMove(event.touches[0].clientX, event.touches[0].clientY);
}

function onMouseEnd( event ) {
    document.removeEventListener( 'mousemove', onMouseMove, false );
    document.removeEventListener( 'mouseup', onMouseEnd, false );
    document.removeEventListener( 'mouseout', onMouseEnd, false );
}


function onTouchEnd( event ) {
    document.removeEventListener( 'touchmove', onTouchMove, false );
    document.removeEventListener( 'touchend', onTouchEnd, false );
    document.removeEventListener( 'touchleave', onTouchEnd, false );

}

function animate() {
    requestAnimationFrame( animate );
    render();
}

function render() {
    if (targetRotationY) model.rotation.x = clamp(model.rotation.x + targetRotationY, -Math.PI/2, Math.PI/2);
    if (targetRotationX) model.rotation.y += targetRotationX;
  
    targetRotationY = targetRotationY * (1 - slowingFactor);
    targetRotationX = targetRotationX * (1 - slowingFactor);
    renderer.render( scene, camera );

}