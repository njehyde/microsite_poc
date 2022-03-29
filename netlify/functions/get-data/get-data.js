import fetch from 'node-fetch';

const filterJobs = (jobs, departments) => (
  jobs.filter((job) => {
    // const { department_hierarchy } = job;
    // const lastItem = department_hierarchy[department_hierarchy.length - 1];
    // return departments.includes(lastItem?.name);
    return !!job?.department_hierarchy.find((item) => (
      departments.includes(item?.name)
    ));
  })
);

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

const getData = async (departments) => {
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

  return filterJobs(jobs, departments);
}

exports.handler = async function(event, context) {
  try {
    const departments = event.queryStringParameters.departments || []
    const jobs = await getData(departments);

    return {
      statusCode: 200,
      body: JSON.stringify({ jobs, departments: departments.split(',') }),
      // headers: { "headerName": "headerValue", ... },
      // isBase64Encoded: true,
    }
  } catch (error) {
    return { statusCode: 500, body: error.toString() }
  }
};