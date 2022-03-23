(async () => {
  const getData = () => {
    return fetch('/.netlify/functions/get-data');
  };
  
  const rootEl = document.getElementById('root');
  const data = await getData();
  const jsonResponse = await data.json();
  const newContent = document.createTextNode(jsonResponse.message);
  
  rootEl.appendChild(newContent);
})();
