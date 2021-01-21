
let clock_display = document.getElementById('clock-time')
let clock_buttons = document.getElementById('clock-buttons')
let play_button = document.getElementById('clock-play')
let pause_button = document.getElementById('clock-pause')
let stop_button = document.getElementById('clock-stop')
let drills_live_div = document.getElementById('drill-list-live')
let drills_div = document.getElementById('drill-list')

let text_mode_button = document.getElementById('text-mode-button')
let text_mode_ui = document.getElementById('text-mode-ui')

let text_importing = false;

let elapsedTime = 0;
let currentStartTime = null;
let running = false;
let recentTopIndex = -1;


let drills = [
    {'text': 'press ups', 'time': 50},
    {'text': 'rest', 'time': 10},
    {'text': 'jumping jacks', 'time': 50},
    {'text': 'rest', 'time': 10},
    {'text': 'wall sit', 'time': 90}
]


if (window.localStorage.getItem('drills')) {
    drills = JSON.parse(window.localStorage.getItem('drills'));
}

let animationID = 0;

function clockStart() {
    running = true;
    drills_div.innerHTML = '';
    play_button.classList.add('hidden')
    pause_button.classList.remove('hidden')
    stop_button.classList.remove('hidden')

    currentStartTime = new Date().getTime();
    animationID = setInterval(() => {
        showDrills();
    }, .1);

    showDrills();
}

function clockPause() {
    play_button.classList.remove('hidden')
    pause_button.classList.add('hidden')

    elapsedTime += (new Date().getTime()) - currentStartTime;
    currentStartTime = null;
    clearInterval(animationID);

    showDrills();
}

function clockStop() {
    running = false;
    recentTopIndex = -1;
    drills_live_div.innerHTML = '';
    clock_display.innerHTML = '';
    play_button.classList.remove('hidden')
    pause_button.classList.add('hidden')
    stop_button.classList.add('hidden')

    elapsedTime = 0;
    currentStartTime = null;
    clearInterval(animationID);

    showDrills();
}

function textImportStart() {
    text_mode_button.innerHTML = '<span onclick="textImportSave()">Save</span><span onclick="textImportCancel()">Cancel</span>'
    text_mode_ui.classList.remove('hidden');
    drills_div.classList.add("hidden")
    clock_buttons.classList.add("hidden")

    let textarea = text_mode_ui.firstElementChild.firstElementChild;
    textarea.value = drills.map(d => `${d.text}:${d.time}`).join('\n')
    textarea.parentElement.dataset.replicatedValue = textarea.value

}

function textImportEnd() {
    text_mode_button.innerHTML = '<span onclick="textImportStart()">Import</span>'
    text_mode_ui.classList.add('hidden');
    drills_div.classList.remove("hidden")
    clock_buttons.classList.remove("hidden")
    showDrills();
}

function textImportSave() {
    drills = text_mode_ui.firstElementChild.firstElementChild.value.split('\n').map(l => {
        try {
            let x = l.split(':');
            if (x.length != 2) throw "should only be one ':' symbol";
            return {'text': x[0], 'time': parseInt(x[1])}
        } catch (e) {
            console.log(e);
            return null;
        }
    }).filter(d => d !== null);
    textImportEnd();
}

function textImportCancel() {
    textImportEnd();
}

function saveDrills() {
    window.localStorage.setItem('drills', JSON.stringify(drills))
}

function moveDrill(i,delta) {
    let d = drills[i];
    drills.splice(i,1);
    drills.splice(i+delta,0,d);
    saveDrills();
    showDrills();
}

function deleteDrill(i) {
    drills.splice(i,1);
    saveDrills();
    showDrills();
}

let addingDrill = false;

function addDrillPropose() {
    addingDrill = true;
    showDrills();
}

function addDrillConfirm() {
    try {
        let text = document.getElementById('addDrillText').value;
        let time = parseInt(document.getElementById('addDrillTime').value);
        if (text.length == 0 || isNaN(time) || time <= 0) {
            throw 'invalid input';
        }
        drills.push({'text': text, 'time': time});
        saveDrills();
    } catch(err) {
        console.log(err);
    } finally {
        addingDrill = false;
        showDrills();
    }
}

function addDrillReject() {
    addingDrill = false;
    showDrills();
}

function showDrillsRunning() {

    let t = elapsedTime;
    if (currentStartTime) t += (new Date().getTime()) - currentStartTime;
    t /= 1000;

    let content = '';
    let firstTime = null;

    for (let i in drills) {
        let d = drills[i];

        if (firstTime === null) {
            if (t > d.time) {
                t -= d.time;
                continue;
            } else {
                firstTime = i;
            }
        }

        content += `<div class="drill-item">
            <span class="drill-text">${d.text} (${d.time}s)
        </div>`
    }

    if (firstTime === null) {
        clockStop();
        return;
    }

    t = drills[firstTime].time - t;
    clock_display.innerText = `${Math.floor(t)}.${Math.floor((t%1)*10)}`
    if (firstTime !== recentTopIndex) {
        drills_live_div.innerHTML =  content;
        recentTopIndex = firstTime;
    }
}

function showDrillsEditing() {
    let content = '';
    for (let i in drills) {
        let d = drills[i];
        content += `<div class="drill-item">
            <span class="drill-text">${d.text} (${d.time}s)
            </span>
            ${addingDrill ? '' : `<span class="drill-buttons">
                <i class="fas fa-angle-up interactive ${i == 0 ? 'invisible':''}" onclick="moveDrill(${i},-1)"></i>
                <i class="fas fa-angle-down interactive ${i == drills.length-1 ? 'invisible':''}" onclick="moveDrill(${i},1)"></i>
                <i class="fas fa-trash interactive" onclick="deleteDrill(${i})"></i>
            </span>`}
        </div>`
    }

    if (addingDrill) {
        content += `<div class="drill-item">
            <input id="addDrillText" type="text" placeholder="drill">
            <input id="addDrillTime" type="number" placeholder="seconds">
            <span class="drill-buttons">
                <i class="fas fa-check interactive" onclick="addDrillConfirm()"></i>
                <i class="fas fa-times interactive" onclick="addDrillReject()"></i>
            </span>
        </div>`
    } else {
        content += `<div class="drill-add interactive" onclick="addDrillPropose()"><i class="fas fa-plus-circle"></i></div>`
    }

    drills_div.innerHTML =  content;
}

function showDrills() {
    if (running) showDrillsRunning();
    else showDrillsEditing();
}

showDrills()