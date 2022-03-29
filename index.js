document.addEventListener('DOMContentLoaded', async (event) => {
  const config = JSON.parse(document.body.getAttribute('data-config')) || '';
  const departments = config?.departments?.toString();
  const url = `/api/get-data${departments ? `?departments=${departments}` : ''}`;

  const getData = async () => fetch(url).then((response) => response.json());
  
  const rootEl = document.getElementById('root');
  const data = await getData();
  const newContent = document.createTextNode(JSON.stringify(data));
  
  rootEl.appendChild(newContent);
});
