(async () => {
  const getData = async () => fetch('/api/get-data').then((response) => response.json());
  
  const rootEl = document.getElementById('root');
  const data = await getData();
  const newContent = document.createTextNode(JSON.stringify(data));
  
  rootEl.appendChild(newContent);
})();
