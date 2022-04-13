document.addEventListener('DOMContentLoaded', async (event) => {
  const config = JSON.parse(document.body.getAttribute('data-config')) || '';
  const departments = config?.departments?.toString();
  const url = `/api/get-jobs-feed${departments ? `?departments=${departments}` : ''}`;

  const getJobsFeedHTML = async () => fetch(url)
    .then((response) => response.text())
    .catch((err) => {
      console.warn('Something went wrong.', err);
    });

  const parser = new DOMParser();
  const rootEl = document.getElementById('root');
  const html = await getJobsFeedHTML();
  const doc = parser.parseFromString(html, 'text/html');

  rootEl.appendChild(doc.body);
});
