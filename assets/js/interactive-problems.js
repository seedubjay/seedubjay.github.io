let hotter_input = document.getElementById('hotter-value').getElementsByTagName('input')[0];
let hotter_output = document.getElementById('hotter-output');
let hotter_error = document.getElementById('hotter-error');

let N = 100;

let uuid = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

let hotter_session_id = null;
function get_hotter_session_id() {
    if (hotter_session_id) {
        return Promise.resolve(hotter_session_id);
    } else {
        return fetch(`https://api.seedubjay.com/problems/hotter/hello/${uuid}?custom_n=100`)
            .then(resp => {
                return resp.text().then(text => {
                    if (resp.ok) {
                        hotter_session_id = text;
                        return Promise.resolve(text);
                    } else return Promise.reject(text);
                })
            })
    }
}

function hotter_reset() {
    hotter_session_id = null;
    hotter_output.innerHTML = '';
    hotter_error.innerHTML = '';
}

function hotter_guess() {
    let v = hotter_input.value;
    if (!v || v < 1 || v > N) return;
    get_hotter_session_id()
        .then(session_id => {
            console.log(session_id);
            fetch(`https://api.seedubjay.com/problems/hotter/guess/${session_id}/${v}`)
                .then(resp => {
                    if (resp.ok) {
                        resp.text().then(text => {
                            hotter_output.innerHTML += `<div>${v} - ${text}</div>`
                            hotter_error.innerHTML = '';
                        })
                    } else {
                        resp.text().then(error => {
                            hotter_error.innerHTML = error;
                        })
                    }
                })
        })
        .catch(err => {
            console.log(err);
        })
}

hotter_input.addEventListener('keyup', event => {
    if (event.keyCode == 13) {
        hotter_guess();
        // hotter_input.value = ''
    }
})

fetch(`https://api.seedubjay.com/problems/hotter/scoreboard`)
    .then(resp => resp.json())
    .then(json => {
        let hotter_scoreboard = document.getElementById('hotter-scoreboard')
        hotter_scoreboard.getElementsByTagName('tbody')[0].innerHTML = json.map(data => `<tr><td>${data.name}</td><td>${data.guesses}</td></tr>`).join('\n')
    })