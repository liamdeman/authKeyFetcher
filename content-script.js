var clickedElement = null;

window.addEventListener('contextmenu', (event) => {

    clickedElement = event.target;
});

chrome.runtime.onMessage.addListener(function (response) {
    clickedElement.value = response;
});