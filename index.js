const getData = async () => {
  return await fetch('/.netlify/functions/get-data');
};

const rootEl = document.getElementById('root');
const data = await getData();
const newContent = document.createTextNode(JSON.stringify(data));

rootEl.appendChild(newContent);

