(async () => {
  const getData = () => {
    return fetch('/.netlify/functions/get-data');
  };
  
  const rootEl = document.getElementById('root');
  const data = await getData();
  const body = data.body;
  const newContent = document.createTextNode(JSON.stringify(data));
  
  rootEl.appendChild(newContent);
})();
