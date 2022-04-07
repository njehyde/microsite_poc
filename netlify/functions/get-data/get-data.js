import fetch from 'node-fetch';

const getFeedHTML = (feed) => {
  const rolesHTML = feed.map((item) => {
    const role = {
      location: item?.location?.city,
      url: item?.url,
      title: item?.title,
    };

    return getRoleHTML(role);
  }).join('');

  return `
    <div class="jobs-listing">
      <h4 class="jobs-total">${feed.length} active roles</h4>
      ${rolesHTML}
    </div>
  `;
};

const getRoleHTML = ({ location, title, url }) => `
  <div class="item">
    <div class="inner">
      <div class="info">
        <p class="secondary-heading">${location}</p>
        <a href="${url}" class="heading" target="_blank">${title}</a>
        <p>
          <a href="${url}" class="link" target="_blank">View and Apply</a>
        </p>
      </div>
    </div>
  </div>
`;

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
    const feedHTML = getFeedHTML(jobs);

    return {
      statusCode: 200,
      body: feedHTML,
      // body: JSON.stringify({ jobs, departments: departments.split(',') }),
      // headers: { "headerName": "headerValue", ... },
      // isBase64Encoded: true,
    }
  } catch (error) {
    return { statusCode: 500, body: error.toString() }
  }
};