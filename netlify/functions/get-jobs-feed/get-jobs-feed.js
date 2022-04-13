import fetch from 'node-fetch';

const workableApiUrl = 'https://immediate-media-co.workable.com/spi/v3/jobs?state=published&include_fields=description';
const viewAndApplyText = 'View and Apply';
const noActiveRolesText = 'There are currently no active roles right now. Please check back later.';

const getActiveRolesText = (numOfJobs) => `${numOfJobs} active roles`;

const getJobHTML = ({ location, title, url }) => `
  <div class="job">
    <div class="job__inner">
      <div class="job__info">
        <p class="job__location-text">${location}</p>
        <a href="${url}" class="job__title-text" target="_blank">${title}</a>
        <p>
          <a href="${url}" class="job__link" target="_blank">${viewAndApplyText}</a>
        </p>
      </div>
    </div>
  </div>
`;

const getJobsHeaderHTML = (numOfJobs = 0) => (
  !numOfJobs
    ? `<p class="jobs__no-roles-copy">${noActiveRolesText}</p>`
    : `<h4 class="jobs__active-roles-header">${getActiveRolesText(numOfJobs)}</h4>`
);

const getJobsFeedHTML = (jobs) => {
  const jobsHeaderHTML = getJobsHeaderHTML(jobs?.length);
  const jobsHTML = jobs?.map((job) => (
    getJobHTML({
      location: job?.location?.city,
      url: job?.url,
      title: job?.title,
    })
  )).join('');
  
  return `
    <div class="jobs__feed">
      ${jobsHeaderHTML}
      ${jobsHTML}
    </div>
  `;
};

const filterJobsByDepartment = (jobs, departments) => (
  jobs.filter((job) => {
    return !!job?.department_hierarchy.find((item) => (
      departments.includes(item?.name)
    ));
  })
);

const getNextPage = async (paging) => {
  const url = paging || workableApiUrl;

  const response = await fetch(url, { 
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + process.env.WORKABLE_ACCESS_KEY,
    },
  });

  return response.json();
}

const getJobs = async (departments) => {
  const data = await getNextPage(); 
  let jobs = data?.jobs;
  let nextPage;

  if (data?.paging) {
    nextPage = data.paging?.next;
  }

  while (nextPage) {
    const nextPageData = await getNextPage(nextPage);
    jobs = [...jobs, ...nextPageData?.jobs || []];
    nextPage = nextPageData?.paging?.next;
  }

  return filterJobsByDepartment(jobs, departments);
}

exports.handler = async function(event) {
  try {
    const departments = event.queryStringParameters?.departments || []
    const jobs = await getJobs(departments);
    const body = getJobsFeedHTML(jobs);

    return {
      statusCode: 200,
      body,
    }
  } catch (error) {
    return { statusCode: 500, body: error.toString() }
  }
};
