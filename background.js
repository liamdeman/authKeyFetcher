var clickedElement = null;

chrome.runtime.onInstalled.addListener(function () {
  chrome.contextMenus.create({
    id: "paste-code",
    title: "Paste code",
    contexts: ["all"],
  });
});

chrome.contextMenus.onClicked.addListener(function (info) {
  if (info.menuItemId === "paste-code" && info.editable === true) {
    pasteCode();

   }
});

function pasteCode() {
  let config = JSON.parse(localStorage.getItem('config'));
  if(!config){

    chrome.runtime.openOptionsPage();
    return;
  }

fetch(`${config.url}/api/states/${config.entity}`, {
  method: 'GET',
  headers: {
    Authorization: `Bearer ${config.token}`
  }
})
  .then(response => response.text())
  .then(result => {
    let parsed = JSON.parse(result);
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
      chrome.tabs.sendMessage(tabs[0].id, parsed.state);  
      });
  })
  .catch(error => console.log('error', error));

}

function mycallback(info, tab) {
  chrome.tabs.sendMessage(tab.id, "getClickedEl", {frameId: info.frameId}, data => {
     console.log(data);
      elt.value = data.value;
  });
}