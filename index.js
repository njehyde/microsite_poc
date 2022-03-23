const getData = async () => {
  return await fetch('/.netlify/functions/get-data').json();
};

const rootEl = document.getElementById('root');
const data = getData();
const newContent = document.createTextNode(JSON.stringify(data));

rootEl.appendChild(newContent);

