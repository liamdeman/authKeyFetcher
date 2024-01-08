var clickedElement = null;

chrome.runtime.onInstalled.addListener(function () {
  chrome.contextMenus.create({
    id: "paste-code",
    title: "Paste code",
    contexts: ["all"],
  });
  chrome.contextMenus.create({
    id: "download-series",
    title: "Download Series",
    contexts: ["all"],
  });
  chrome.contextMenus.create({
    id: "download-movie",
    title: "Download Movie",
    contexts: ["all"],
  });
});

chrome.contextMenus.onClicked.addListener(function (info) {
  if (info.menuItemId === "paste-code" && info.editable === true) {
    pasteCode();
    return;
  }
  if (info.menuItemId === "download-series" && info.linkUrl) {
    download("Series", info.linkUrl);
    return;
  }
  if (info.menuItemId === "download-movie" && info.linkUrl) {
    download("Movie", info.linkUrl);
    return;
  }
});

function pasteCode() {
  let config = JSON.parse(localStorage.getItem('config'));
  if (!config) {

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
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, parsed.state);
      });
    })
    .catch(error => console.log('error', error));

}

function download(category, url) {
  let config = JSON.parse(localStorage.getItem('config'));
  if (!config) {
    chrome.runtime.openOptionsPage();
    return;
  }

  fetch(`${config.url}/api/events/download`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.token}`
    },
    body: JSON.stringify({
      url,
      category
    })
  })
    .then(response => response.text());
}

function mycallback(info, tab) {
  chrome.tabs.sendMessage(tab.id, "getClickedEl", { frameId: info.frameId }, data => {
    console.log(data);
    elt.value = data.value;
  });
}