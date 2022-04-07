document.addEventListener('DOMContentLoaded', async (event) => {
  const config = JSON.parse(document.body.getAttribute('data-config')) || '';
  const departments = config?.departments?.toString();
  const url = `/api/get-data${departments ? `?departments=${departments}` : ''}`;

  const getData = async () => fetch(url, {
    headers: {'Cache-Control': 'public, s-maxage=1800'},
  }).then((response) => response.text())
    .catch((err) => {
      console.warn('Something went wrong.', err);
    });

  const parser = new DOMParser();
  const rootEl = document.getElementById('root');
  const html = await getData();
  const doc = parser.parseFromString(html, 'text/html');

  rootEl.appendChild(doc.body);
});
