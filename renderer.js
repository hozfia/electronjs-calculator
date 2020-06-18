// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

const ipc = require('electron').ipcRenderer;

numbers = document.querySelectorAll(".number");
enter = document.querySelector(".enter");
clear = document.querySelector(".clear");

let replyDiv = document.querySelector('#result');

mapNum();


ipc.on('asynReply', (event, args) => {
    replyDiv.innerHTML = args;
});

enter.addEventListener('click', () => {
    console.log(enter.value);
    ipc.send('Enter', enter.value)
});

clear.addEventListener('click', () => {
    console.log(clear.value);
    ipc.send('Clear', 'Clear')
});

function mapNum() {
    for (var i = 0; i < numbers.length; i++) {
        var numberButton = numbers[i];
        var buttonValue = numberButton.attributes['value'].value;
        prepareButton(numberButton, buttonValue);
    }

    function prepareButton(numberButton, buttonValue) {
        numberButton.addEventListener('click', () => {
            console.log(buttonValue);
            ipc.send('number', buttonValue)
        });
    }
}