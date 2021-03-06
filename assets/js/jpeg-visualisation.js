
let download_span = document.getElementById('download-text');
let full_text = download_span.innerText;
let current_text = full_text.slice(0,10);
download_span.innerText = '';
let download_image = document.getElementById('download-image');
function set_blur(r) {
    download_image.style.filter = `blur(${r}px)`;
    download_image.style.backdropFilter = `blur(${r}px)`;
    download_image.style.webkitBackdropFilter = `blur(${r}px)`;
}
let blur_radius = 30;
set_blur(blur_radius);
let prev_interval_time = 0;
let download_interval_id = setInterval(() => {
    let elapsed = Math.min(new Date().getTime() - prev_interval_time, 30);

    while (elapsed > 0 && current_text.length < full_text.length) {
        elapsed -= 10;
        current_text += full_text[current_text.length];
        download_span.innerText = current_text;
    }
    if (current_text.length == full_text.length) {
        clearInterval(download_interval_id);
    }
    prev_interval_time = new Date().getTime();
}, 5);

let download_image_interval_id = setInterval(() => {
    if (blur_radius > 0) {
        blur_radius -= 10;
        set_blur(blur_radius);
    } else {
        set_blur(blur_radius);
        clearInterval(download_image_interval_id);
    }
}, 200)

function dct(g) {
    let G = [];
    let alpha = u => u ? 1 : Math.SQRT1_2;
    for (let v = 0; v < 8; v++) {
        let r = [];
        for (let u = 0; u < 8; u++) {
            let s = 0;
            for (let x = 0; x < 8; x++) {
                for (let y = 0; y < 8; y++) {
                    s += g[y][x]*Math.cos((2*x+1)*u*Math.PI/16)*Math.cos((2*y+1)*v*Math.PI/16)
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
    for (let y = 0; y < 8; y++) {
        let r = [];
        for (let x = 0; x < 8; x++) {
            let s = 0;
            for (let v = 0; v < 8; v++) {
                for (let u = 0; u < 8; u++) {
                    s += alpha(u)*alpha(v)*G[v][u]*Math.cos((2*x+1)*u*Math.PI/16)*Math.cos((2*y+1)*v*Math.PI/16)
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
let quantise_topleft = interpolator(16,128,0,1000);
let quantise_bottomright = interpolator(1,128,0,10000);
function quantiser(q) {
    let poly = 0.2;
    return x => interpolator(quantise_topleft(q*q),quantise_bottomright(q*q),0,14**poly)(x**poly);
}

function quantised_pixels(dct, q) {
    let quantise = quantiser(q);
    return idct(dct.map((row,v) => row.map(((x,u) => Math.round(x/8*quantise(u+v))/quantise(u+v)*8))));
}

// static zoom in for dct breakdown
window.addEventListener('load', () => {
    getPixels('/assets/png/cat-with-scarf-96.png').then(img => {
        let sample_x = 6, sample_y = 4;
        let img_width = img[0].length;
        let img_height = img.length;
        let canvas_scale = 3;

        let {canvas: img_canvas, draw: img_draw} = imageGenerator('canvas10a', {
            getPixel: (x,y,{width,height}) => [...img[Math.floor(y*img_height/height)][Math.floor(x*img_width/width)],255]
        }, {width: img_width*canvas_scale, height: img_height*canvas_scale})
        img_draw();
        let ctx = img_canvas.getContext('2d');
        ctx.strokeStyle = '#f22';
        let lw = 2;
        ctx.lineWidth = lw;
        ctx.strokeRect(8*sample_x/img_width*img_canvas.width-lw/2, 8*sample_y/img_height*img_canvas.height-lw/2, 8/img_width*img_canvas.width+lw, 8/img_height*img_canvas.height+lw);

        let sample = img.slice(sample_y*8, sample_y*8+8).map(row => row.slice(sample_x*8, sample_x*8+8));
        let ycbcr = [0,1,2].map(i => sample.map(row => row.map(v => YCbCr(v)[i])));
        let dcts = ycbcr.map(dct);
        let k = x => [0,1,2].reduce((t,i) => t + dcts[i][x[0]][x[1]]**2, 0);
        let rank = new Array(8).fill(0).map(() => new Array(8).fill(0));
        let order = new Array(64).fill(0).map((_,i) => [Math.floor(i/8),i%8]).sort((a,b) => k(a) < k(b));
        order.forEach((x,i) => {rank[x[0]][x[1]] = i;});

        let {canvas: sample_canvas, draw: sample_draw} = imageGenerator('canvas10b', {
            getPixel: (x,y,{width,height}) => [...sample[Math.floor(y*8/height)][Math.floor(x*8/width)],255]
        });

        let slider = document.getElementById('canvas10-slider');

        let grid_scale = 2;
        let grid_padding = 3;
        let grid_width = grid_scale*64+grid_padding*7;
        let grid_height = grid_width;

        let raw_idcts = []
        let temp_dct = new Array(8).fill(0).map(() => new Array(8).fill(0));
        for (let i = 0; i < 3; i++) {
            let raw_idct = [];
            for (let v = 0; v < 8; v++) {
                let r = [];
                for (let u = 0; u < 8; u++) {
                    temp_dct[v][u] = dcts[i][v][u];
                    r.push(idct(temp_dct));
                    temp_dct[v][u] = 0;
                }
                raw_idct.push(r);
            }
            raw_idcts.push(raw_idct);
        }

        let {canvas: grid_canvas, draw: grid_draw} = imageGenerator('canvas10c', {
            getPixel: (x,y,{width,height}) => {
                let u = Math.floor(x / (8*grid_scale+grid_padding));
                let v = Math.floor(y / (8*grid_scale+grid_padding));
                let dct_x = Math.floor(x % (8*grid_scale+grid_padding) / grid_scale);
                let dct_y = Math.floor(y % (8*grid_scale+grid_padding) / grid_scale);
                if (dct_x >= 8 || dct_y >= 8 || rank[v][u] >= slider.value) return [255,255,255,255];
                return [...iYCbCr(raw_idcts.map(d => d[v][u][dct_y][dct_x])), 255];
            }
        }, {width: grid_width, height: grid_height});

        slider.oninput = () => {
            let cutoff = slider.value;
            let chosen_ycbcr = dcts.map(d => d.map((row,v) => row.map((z,u) => rank[v][u] < cutoff ? z:0))).map(idct);
            sample = sample.map((row,y) => row.map((_,x) => iYCbCr(chosen_ycbcr.map(p => p[y][x]))));
            sample_draw();

            grid_draw();
        }
        slider.oninput();
    })
});

// single 8x8
window.addEventListener('load', () => {
    getPixels('/assets/png/macaw-closeup-40.png').then(macaw_raw => {
        let macaw_width = macaw_raw[0].length;
        let macaw_height = macaw_raw.length;
        let sample_x = 2, sample_y = 2;
        let canvas_scale = 3;

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
        }, {width: macaw_width*canvas_scale, height: macaw_height*canvas_scale})
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
            let lw = 2;
            raw_ctx.lineWidth = lw;
            raw_ctx.strokeRect(8*sample_x/macaw_width*macaw_canvas.width-lw/2, 8*sample_y/macaw_height*macaw_canvas.height-lw/2, 8/macaw_width*macaw_canvas.width+lw, 8/macaw_height*macaw_canvas.height+lw);
        }

        let sample_data = [];
        let sample_dct = macaw_dcts[sample_y][sample_x][0];

        let {canvas: single_canvas, draw: single_draw} = imageGenerator('canvas1', {
            getPixel: (x,y,{width,height}) => colourGreyscale(sample_data[Math.floor(y*8/height)][Math.floor(x*8/width)]/2+.5)
        }, {width: macaw_width*canvas_scale, height: macaw_height*canvas_scale});
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

// dct grid
window.addEventListener('load', () => {
    let square_scale = 5;
    let padding = 6;
    let width = square_scale*64+padding*7;
    let height = width;

    let raw_idcts = []
    let temp_dct = new Array(8).fill(0).map(() => new Array(8).fill(0));
    for (let v = 0; v < 8; v++) {
        let r = [];
        for (let u = 0; u < 8; u++) {
            temp_dct[v][u] = 4;
            r.push(idct(temp_dct));
            temp_dct[v][u] = 0;
        }
        raw_idcts.push(r);
    }

    imageGenerator('canvas3', {
        getPixel: (x,y,{width,height}) => {
            let u = Math.floor(x / (8*square_scale+padding));
            let v = Math.floor(y / (8*square_scale+padding));
            let dct_x = Math.floor(x % (8*square_scale+padding) / square_scale);
            let dct_y = Math.floor(y % (8*square_scale+padding) / square_scale);
            if (dct_x >= 8 || dct_y >= 8) return [255,255,255,255];
            return colourGreyscale(raw_idcts[v][u][dct_y][dct_x]/2+.5);
        }
    }, {width: width, height: height}).draw();
})

// canvas7 - rgb filters
let toggle_button_canvas7;
window.addEventListener('load', () => {
    let rgb_toggle = [true,false,true];
    
    getPixels('/assets/jpg/macaw-240.jpg').then(img_raw => {
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
    
    getPixels('/assets/jpg/macaw-240.jpg').then(img_raw => {
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

    getPixels('/assets/png/sunset-square-64.png').then(img => {
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


// static zoom in for dct breakdown
let reload_canvas11b = null;
window.addEventListener('load', () => {
    let sample = null;
    let ycbcr = null;
    let dcts = null;
    let k = x => [0,1,2].reduce((t,i) => t + dcts[i][x[0]][x[1]]**2, 0);
    let rank = new Array(8).fill(0).map(() => new Array(8).fill(0));
    let raw_idcts = null;
    let temp_dct = new Array(8).fill(0).map(() => new Array(8).fill(0));

    let {canvas: sample_canvas, draw: sample_draw} = imageGenerator('canvas11b', {
        getPixel: (x,y,{width,height}) => [...sample[Math.floor(y*8/height)][Math.floor(x*8/width)],255]
    });

    let slider = document.getElementById('canvas11-slider');

    let grid_scale = 2;
    let grid_padding = 3;
    let grid_width = grid_scale*64+grid_padding*7;
    let grid_height = grid_width;

    let {canvas: grid_canvas, draw: grid_draw} = imageGenerator('canvas11c', {
        getPixel: (x,y,{width,height}) => {
            let u = Math.floor(x / (8*grid_scale+grid_padding));
            let v = Math.floor(y / (8*grid_scale+grid_padding));
            let dct_x = Math.floor(x % (8*grid_scale+grid_padding) / grid_scale);
            let dct_y = Math.floor(y % (8*grid_scale+grid_padding) / grid_scale);
            if (dct_x >= 8 || dct_y >= 8 || rank[v][u] >= slider.value) return [255,255,255,255];
            return [...iYCbCr(raw_idcts.map(d => d[v][u][dct_y][dct_x])), 255];
        }
    }, {width: grid_width, height: grid_height});

    slider.oninput = () => {
        let cutoff = slider.value;
        let chosen_ycbcr = dcts.map(d => d.map((row,v) => row.map((z,u) => rank[v][u] < cutoff ? z:0))).map(idct);
        sample = sample.map((row,y) => row.map((_,x) => iYCbCr(chosen_ycbcr.map(p => p[y][x]))));
        sample_draw();

        grid_draw();
    }


    reload_canvas11b = () => {
        sample = new Array(8).fill(0).map(_ => new Array(8).fill(0).map(_ => [0,1,2].map(_ => Math.round(Math.random()*256))));
        ycbcr = [0,1,2].map(i => sample.map(row => row.map(v => YCbCr(v)[i])));
        dcts = ycbcr.map(dct);
        order = new Array(64).fill(0).map((_,i) => [Math.floor(i/8),i%8]).sort((a,b) => k(a) < k(b));
        order.forEach((x,i) => {rank[x[0]][x[1]] = i;});

        raw_idcts = [];
        for (let i = 0; i < 3; i++) {
            let raw_idct = [];
            for (let v = 0; v < 8; v++) {
                let r = [];
                for (let u = 0; u < 8; u++) {
                    temp_dct[v][u] = dcts[i][v][u];
                    r.push(idct(temp_dct));
                    temp_dct[v][u] = 0;
                }
                raw_idct.push(r);
            }
            raw_idcts.push(raw_idct);
        }

        slider.oninput();
    }

    reload_canvas11b();
});