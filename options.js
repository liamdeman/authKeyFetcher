// Saves options to chrome.storage
const saveOptions = () => {
    const token = document.getElementById('token').value;
    const url = document.getElementById('url').value;
    const entity = document.getElementById('entity').value;

fetch(`${url}/api/states/${entity}`, {
  method: 'GET',
  headers: {
    "Authorization": `Bearer ${token}`
  }
})
  .then(response => {
    if(response.status === 200){
        localStorage.setItem('config', JSON.stringify({token, url, entity}));
        alert('saved');
        return;
    }
    alert('cannot connect to server');
  })
  .catch(error => alert(error));

}
  
  // Restores select box and checkbox state using the preferences
  // stored in chrome.storage.
  const restoreOptions = () => {
    let config = JSON.parse(localStorage.getItem('config'));
    if(!config){
        return;
    }
    document.getElementById('token').value = config.token;
    document.getElementById('url').value = config.url;
    document.getElementById('entity').value = config.entity;
  };
  
  document.addEventListener('DOMContentLoaded', restoreOptions);
  document.getElementById('save').addEventListener('click', saveOptions);