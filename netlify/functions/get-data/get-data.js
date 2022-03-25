import fetch from 'node-fetch';

// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method
const getNextPage = async (paging) => {
  const url = paging || 'https://immediate-media-co.workable.com/spi/v3/jobs?state=published&include_fields=description';

  const response = await fetch(url, { 
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + process.env.WORKABLE_ACCESS_KEY,
    },
  });

  return response.json();
}

const getData = async () => {
  const data = await getNextPage(); 
  let jobs = data.jobs;
  let next;

  if (data.paging) {
    next = data.paging.next;
  }

  while (next) {
    const nextPageData = await getNextPage(next);
    jobs = [...jobs, ...nextPageData.jobs];
    next = nextPageData?.paging?.next;
  }

  return jobs;
}

exports.handler = async function(event, context) {
  try {
    // const subject = event.queryStringParameters.name || 'World'
    const jobs = await getData();

    return {
      statusCode: 200,
      body: JSON.stringify(jobs),
      // // more keys you can return:
      // headers: { "headerName": "headerValue", ... },
      // isBase64Encoded: true,
    }
  } catch (error) {
    return { statusCode: 500, body: error.toString() }
  }
};