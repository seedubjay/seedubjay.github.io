
let download_span = document.getElementById('download-text');
let full_text = download_span.innerText;
let current_text = full_text.slice(0,10);
download_span.innerText = '';
let download_image = document.getElementById('download-image');
function set_blur(r) {
    download_image.style.filter = `blur(${r}px)`;
    download_image.style.webkitFilter = `blur(${r}px)`;
}
let blur_radius = 30;
set_blur(blur_radius);
let download_interval_id = setInterval(() => {
    if (current_text.length < full_text.length) {
        current_text += full_text[current_text.length];
        download_span.innerText = current_text;
    }
    else {
        clearInterval(download_interval_id);
    }
}, 5);

let download_image_interval_id = setInterval(() => {
    if (blur_radius > 0) {
        blur_radius -= 10;
        set_blur(blur_radius);
    } else {
        set_blur(blur_radius);
        clearInterval(download_image_interval_id);
    }
}, 300)

function dct(g) {
    let G = [];
    let alpha = u => u ? 1 : Math.SQRT1_2;
    for (let u = 0; u < 8; u++) {
        let r = [];
        for (let v = 0; v < 8; v++) {
            let s = 0;
            for (let x = 0; x < 8; x++) {
                for (let y = 0; y < 8; y++) {
                    s += g[x][y]*Math.cos((2*x+1)*u*Math.PI/16)*Math.cos((2*y+1)*v*Math.PI/16)
                }
            }
            r.push(alpha(u)*alpha(v)*s/4);
        }
        G.push(r);
    }
    return G;
}

function idct(G) {
    let g = [];
    let alpha = u => u ? 1 : Math.SQRT1_2;
    for (let x = 0; x < 8; x++) {
        let r = [];
        for (let y = 0; y < 8; y++) {
            let s = 0;
            for (let u = 0; u < 8; u++) {
                for (let v = 0; v < 8; v++) {
                    s += alpha(u)*alpha(v)*G[u][v]*Math.cos((2*x+1)*u*Math.PI/16)*Math.cos((2*y+1)*v*Math.PI/16)
                }
            }
            r.push(s/4);
        }
        g.push(r);
    }
    return g;
}

let grid_ordering = [{x:0,y:0}];
let x = 0, y = 0;
while (x < 7 || y < 7) {
    if (x < 7) x++;
    else y++;
    while (x > 0 && y < 7) {
        grid_ordering.push({x:x,y:y});
        x--; y++;
    }
    grid_ordering.push({x:x,y:y});
    if (y < 7) y++;
    else x++;
    while (x < 7 && y > 0) {
        grid_ordering.push({x:x,y:y});
        x++; y--;
    }
    grid_ordering.push({x:x,y:y});
}

function getPixels(src) {
    return new Promise((resolve, reject) => {
        let img = new Image();
        img.onload = () => {
            var canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            var ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            let g = [];
            for (let y = 0; y < canvas.height; y++) {
                let r = [];
                for (let x = 0; x < canvas.width; x++) {
                    r.push(ctx.getImageData(x,y,1,1).data.slice(0,3));
                }
                g.push(r);
            }
            resolve(g);
        }
        img.src = src;
    })
}

function YCbCr(rgb) {
    let r = rgb[0], g = rgb[1], b = rgb[2];
    let y = .299*r + .587*g + .114*b;
    let cb = 128 -.168736*r - .331264*g + .5*b;
    let cr = 128 + .5*r - .418688*g - .081312*b;
    return [y/128-1,cb/128-1,cr/128-1]
}

function iYCbCr(ycbcr) {
    let y = ycbcr[0]*128+128, cb = ycbcr[1]*128+128, cr = ycbcr[2]*128+128;
    let r = y + 1.402*(cr-128);
    let g = y - .344136*(cb-128) - .714136*(cr-128);
    let b = y + 1.772*(cb-128);
    return [r,g,b]
}

// one-sided quantisation
let quantise_topleft = interpolator(8,128,0,1000);
let quantise_bottomright = interpolator(1,128,0,10000);
function quantiser(q) {
    let poly = 0.2;
    return x => interpolator(quantise_topleft(q*q),quantise_bottomright(q*q),0,14**poly)(x**poly);
}

function quantised_pixels(dct, q) {
    let quantise = quantiser(q);
    return idct(dct.map((row,v) => row.map(((x,u) => Math.round(x/8*quantise(u+v))/quantise(u+v)*8))));
}

// single 8x8
window.addEventListener('load', () => {
    getPixels('/assets/jpg/macaw-closeup-40.jpg').then(macaw_raw => {
        let macaw_width = macaw_raw[0].length;
        let macaw_height = macaw_raw.length;
        let sample_x = 2, sample_y = 3;

        let macaw_data = macaw_raw.map(row => row.map(rgb => rgb.map(x => x)));

        let macaw_dcts = []
        for (let y = 0; y < macaw_height; y += 8) {
            let r = [];
            for (let x = 0; x < macaw_width; x += 8) {
                let chunk = macaw_data.slice(y,y+8).map(row => row.slice(x,x+8));
                let ycrcb = [0,1,2].map(i => chunk.map(row => row.map(c => YCbCr(c)[i])));
                r.push(ycrcb.map(dct));
            }
            macaw_dcts.push(r);
        }

        let {canvas: macaw_canvas, draw: macaw_draw} = imageGenerator('canvas0', {
            getPixel: (x,y,{width,height}) => [...macaw_data[Math.floor(y*macaw_height/height)][Math.floor(x*macaw_width/width)],255]
        })
        let macaw_draw_full = () => {
            for (let y = 0; 8*y < macaw_height; y++) {
                for (let x = 0; 8*x < macaw_width; x++) {
                    let ycbcr = macaw_dcts[y][x].map(dct => quantised_pixels(dct, slider.value));
                    for (let yi = 0; yi < 8; yi++) {
                        for (let xi = 0; xi < 8; xi++) {
                            macaw_data[8*y+yi][8*x+xi] = [...iYCbCr(ycbcr.map(x => x[yi][xi])),255];
                        }
                    }
                }
            }
            macaw_draw();
            let raw_ctx = macaw_canvas.getContext('2d');
            raw_ctx.strokeStyle = '#f22';
            let lw = 4;
            raw_ctx.lineWidth = lw;
            raw_ctx.strokeRect(8*sample_x/macaw_width*macaw_canvas.width-lw/2, 8*sample_y/macaw_height*macaw_canvas.height-lw/2, 8/macaw_width*macaw_canvas.width+lw, 8/macaw_height*macaw_canvas.height+lw);
        }

        let sample_data = [];
        let sample_dct = macaw_dcts[sample_y][sample_x][0];

        let {canvas: single_canvas, draw: single_draw} = imageGenerator('canvas1', {
            getPixel: (x,y,{width,height}) => colourGreyscale(sample_data[Math.floor(y*8/height)][Math.floor(x*8/width)]/2+.5)
        });
        let single_draw_full = () => {
            sample_data = quantised_pixels(sample_dct,slider.value);
            single_draw();
        }

        let slider = document.getElementById('canvas1-slider');
        slider.oninput = () => {
            single_draw_full();            
            macaw_draw_full();

        }
        slider.oninput();
    })
});

// single 8x8
window.addEventListener('load', () => {
    let ycbcr_raw = [0,1,2].map(() => new Array(8).fill(0).map(() => new Array(8).fill(0).map(() => Math.random()*2-1)));
    let dcts = ycbcr_raw.map(dct);

    let get_rgb = (ycbcr) => new Array(8).fill(0).map((_,y) => new Array(8).fill(0).map((_,x) => [...iYCbCr(ycbcr.map(m => m[y][x])),255]))
    let rgb = get_rgb(ycbcr_raw);
    imageGenerator('canvas4a', {
        getPixel: (x,y,{width,height}) => rgb[Math.floor(y*8/height)][Math.floor(x*8/width)]
    }).draw();

    let {canvas, draw} = imageGenerator('canvas4b', {
        getPixel: (x,y,{width,height}) => rgb[Math.floor(y*8/height)][Math.floor(x*8/width)]
    })

    let slider = document.getElementById('canvas4-slider');
    slider.oninput = () => {
        rgb = get_rgb(dcts.map(d => quantised_pixels(d,slider.value)))
        draw();
    }
    slider.oninput();
});

// window.addEventListener('load', () => {
//     let img = new Image();
//     img.onload = () => {
//         let macaw_width = img.width;
//         let macaw_height = img.height;

//         let canvas = document.getElementById('canvas2');
//         canvas.width = macaw_width;
//         canvas.height = macaw_height;
//         console.log(macaw_width, macaw_height);
//         let ctx = canvas.getContext('2d');
//         ctx.drawImage(img, 0, 0);
//         let raw_data = ctx.getImageData(0,0,macaw_width,macaw_height);
//         let macaw_data = [];
//             for (let y = 0; y < macaw_height; y++) {
//                 let r = [];
//                 for (let x = 0; x < macaw_width; x++) {
//                     let s = 4*y*macaw_width+4*x;
//                     r.push(raw_data.data.slice(s,s+3));
//                 }
//                 macaw_data.push(r);
//             }

//         let grid = new Array(8).fill(0).map(() => new Array(8).fill(0));
//         for (let y = 0; y < macaw_height; y += 8) {
//             console.log(y)
//             for (let x = 0; x < macaw_width; x += 8) {
//                 for (let yi = 0; yi < 8; yi++) {
//                     for (let xi = 0; xi < 8; xi++) {
//                         grid[yi][xi] = YCbCr(macaw_data[y+yi][x+xi]);
//                     }
//                 }
//                 let dcts = [0,1,2].map(i => grid.map(row => row.map(x => x[i]))).map(dct);
//                 let quantised = dcts.map(d => quantised_pixels(d,interpolator(10,40,macaw_width*0,macaw_width*.3)(x)))
//                 for (let yi = 0; yi < 8; yi++) {
//                     for (let xi = 0; xi < 8; xi++) {
//                         grid[yi][xi] = iYCbCr(quantised.map(q => q[yi][xi]));
//                     }
//                 }
//                 for (let yi = 0; yi < 8; yi++) {
//                     for (let xi = 0; xi < 8; xi++) {
//                         macaw_data[y+yi][x+xi] = [...grid[yi][xi],255];
//                         let s = 4*(y+yi)*macaw_width + 4*(x+xi);
//                         raw_data.data[s] = grid[yi][xi][0];
//                         raw_data.data[s+1] = grid[yi][xi][1];
//                         raw_data.data[s+2] = grid[yi][xi][2];
//                     }
//                 }
//             }
//         }
//         ctx.putImageData(raw_data,0,0);
//     };
//     img.src = '/assets/jpg/mare-60.jpg'
// });

window.addEventListener('load', () => {
    let square_scale = 5;
    let padding = 6;
    let width = square_scale*64+padding*7;
    let height = width;

    let idcts = []
    let dct = new Array(8).fill(0).map(() => new Array(8).fill(0));
    for (let u = 0; u < 8; u++) {
        let r = [];
        for (let v = 0; v < 8; v++) {
            dct[v][u] = 4;
            r.push(idct(dct));
            dct[v][u] = 0;
        }
        idcts.push(r);
    }

    imageGenerator('canvas3', {
        getPixel: (x,y,{width,height}) => {
            let u = Math.floor(x / (8*square_scale+padding));
            let v = Math.floor(y / (8*square_scale+padding));
            let dct_x = Math.floor(x % (8*square_scale+padding) / square_scale);
            let dct_y = Math.floor(y % (8*square_scale+padding) / square_scale);
            if (dct_x >= 8 || dct_y >= 8) return [255,255,255,255];
            return colourGreyscale(idcts[u][v][dct_y][dct_x]/2+.5);
        }
    }).draw({
        newWidth: width,
        newHeight: height
    });
})

// window.addEventListener('load', () => {
//     let colour = [50, 255, 25];

//     let rgb_code = ['r', 'g', 'b'];
//     let ycbcr_code = ['y', 'cb', 'cr'];

//     let get_slider = c => document.getElementById('colour-slider-' + c).getElementsByTagName('input')[0];
//     let rgb_inputs = rgb_code.map(get_slider)
//     let ycbcr_inputs = ycbcr_code.map(get_slider)

//     let get_label = c => document.getElementById('colour-slider-' + c).getElementsByTagName('span')[0];
//     let rgb_labels = rgb_code.map(get_label)
//     let ycbcr_labels = ycbcr_code.map(get_label)

//     function set_rgb() {
//         colour.forEach((c,i) => rgb_inputs[i].value = Math.round(c));
//     }

//     function set_ycbcr() {
//         YCbCr(colour).forEach((c,i) => ycbcr_inputs[i].value = Math.round(c*128+128));
//     }

//     let pixel_canvas = document.getElementById('canvas6')
//     let pixel_ctx = pixel_canvas.getContext("2d");

//     function update_colours() {
//         colour.forEach((c,i) => rgb_labels[i].innerText = Math.round(c))
//         YCbCr(colour).forEach((c,i) => ycbcr_labels[i].innerText = Math.round(c*128+128))

//         pixel_ctx.fillStyle = `rgb(${Math.round(colour[0])},${Math.round(colour[1])},${Math.round(colour[2])})`;
//         pixel_ctx.fillRect(0,0,pixel_canvas.width, pixel_canvas.height);
//     }
//     update_colours();
//     set_rgb();
//     set_ycbcr();

//     rgb_inputs.forEach(input => input.addEventListener('input', () => {
//         colour = rgb_inputs.map(x => x.value);
//         set_ycbcr();
//         update_colours();
//     }))

//     ycbcr_inputs.forEach((input,i) => input.addEventListener('input', (event) => {
//         console.log(ycbcr_inputs.map(x => x.value));

//         let ycbcr_temp = ycbcr_inputs.map(x => x.value/128-1)
//         let dir = YCbCr(colour)[i] < ycbcr_temp[i] ? 1 : -1;
//         while (iYCbCr(ycbcr_temp).some(x => x <= -.5 || x >= 255.5)) {
//             ycbcr_temp[i] -= dir/256;
//         }
//         colour = iYCbCr(ycbcr_temp).map(x => Math.round(x));

//         set_rgb();
//         set_ycbcr();
//         // event.preventDefault();
//         update_colours();
        
//     }))
// });

// canvas7 - rgb filters
let toggle_button_canvas7;
window.addEventListener('load', () => {
    let rgb_toggle = [true,false,true];
    
    getPixels('/assets/jpg/macaw-480.jpg').then(img_raw => {
        let {canvas, draw} = imageGenerator('canvas7', {
            getPixel: (x,y) => [...img_raw[y][x].map((v,i) => rgb_toggle[i] ? v : 0),255]
        }, {width: img_raw[0].length, height: img_raw.length});

        draw();

        toggle_button_canvas7 = (i) => {
            rgb_toggle[i] = rgb_toggle[i] ^ true;
            draw();
        }
    });
})

// canvas8 - ycbcr filters
let toggle_button_canvas8;
window.addEventListener('load', () => {
    let ycbcr_toggle = [true,false,true];
    
    getPixels('/assets/jpg/macaw-480.jpg').then(img_raw => {
        let {canvas, draw} = imageGenerator('canvas8', {
            getPixel: (x,y) => [...iYCbCr(YCbCr(img_raw[y][x]).map((v,i) => ycbcr_toggle[i] ? v : 0)),255]
        }, {width: img_raw[0].length, height: img_raw.length});

        draw();

        toggle_button_canvas8 = (i) => {
            ycbcr_toggle[i] = ycbcr_toggle[i] ^ true;
            draw();
        }
    });
})

// canvas9: random and sunset squares
window.addEventListener('load', () => {

    getPixels('/assets/jpg/sunset-square-64.jpg').then(img => {
        imageGenerator('canvas9b', {
            getPixel: (x,y,{width,height}) => [...img[Math.floor(y*img.length/height)][Math.floor(x*img[0].length/width)], 255]
        }).draw();
    })

    let pixels = 64;
    let random_img = new Array(pixels).fill(0).map(
        () => new Array(pixels).fill(0).map(
            () => [0,1,2].map(
                () => Math.floor(Math.random()*256)
            )
        )
    )

    imageGenerator('canvas9a', {
        getPixel: (x,y,{width,height}) => [...random_img[Math.floor(y*pixels/height)][Math.floor(x*pixels/width)], 255]
    }).draw();

});