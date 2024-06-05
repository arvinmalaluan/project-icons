const default_contents = [
  {
    timestamp: "2024-06-05T00:00:00.000Z",
    title: "The Evolving Landscape of E-commerce: Trends to Watch in 2024",
    description:
      "This newsletter explores the latest trends shaping the e-commerce landscape, including social commerce, personalization, and omnichannel experiences.",
    link: "https://www.google.com",
  },
  {
    timestamp: "2024-06-06T00:00:00.000Z",
    title:
      "The Future of Marketing: How Artificial Intelligence is Personalizing Customer Journeys",
    description:
      "Dive into how artificial intelligence is transforming marketing strategies by enabling hyper-personalized customer experiences.",
    link: "google.com",
  },
  {
    timestamp: "2024-06-07T00:00:00.000Z",
    title: "Building a Remote-First Company Culture: Strategies for Success",
    description:
      "Gain valuable insights on fostering a strong and collaborative company culture when your team is geographically dispersed.",
    link: "google.com",
  },
  {
    timestamp: "2024-06-08T00:00:00.000Z",
    title:
      "The Importance of Cybersecurity Awareness: Empowering Employees to Stay Safe",
    description:
      "This newsletter emphasizes the importance of cybersecurity awareness training for employees and provides strategies to enhance online safety.",
    link: "google.com",
  },
  {
    timestamp: "2024-06-09T00:00:00.000Z",
    title:
      "The Creator Economy Booms: How Platforms are Empowering Content Creators",
    description:
      "Explore the rise of the creator economy and how online platforms are enabling individuals to monetize their creativity and build audiences.",
    link: "google.com",
  },
  {
    timestamp: "2024-06-10T00:00:00.000Z",
    title: "The Future of Education: Embracing Blended Learning Models",
    description:
      "This newsletter delves into the growing trend of blended learning, combining traditional classroom instruction with online elements to enhance the educational experience.",
    link: "google.com",
  },
  {
    timestamp: "2024-06-05T00:00:00.000Z",
    title:
      "The Rise of the Metaverse: Blurring the Lines Between Physical and Digital Worlds",
    description:
      "Uncover the concept of the metaverse and how it has the potential to reshape our interactions, work, and entertainment in the virtual space.",
    link: "google.com",
  },
  {
    timestamp: "2024-06-05T00:00:00.000Z",
    title:
      "The Power of Data Analytics: Transforming Businesses with Data-Driven Decisions",
    description:
      "Explore how data analytics empowers businesses to make informed decisions, optimize operations, and gain a competitive edge.",
    link: "google.com",
  },
  {
    timestamp: "2024-06-06T00:00:00.000Z",
    title:
      "Building a Sustainable Supply Chain: Strategies for Eco-Conscious Businesses",
    description:
      "This newsletter provides insights on implementing sustainable practices throughout the supply chain to minimize environmental impact.",
    link: "google.com",
  },
  {
    timestamp: "2024-06-07T00:00:00.000Z",
    title: "The Future of Work: Embracing Lifelong Learning for Career Growth",
    description:
      "In a rapidly evolving job market, this newsletter highlights the importance of continuous learning and skill development for career advancement.",
    link: "google.com",
  },
  {
    timestamp: "2024-06-08T00:00:00.000Z",
    title: "Emerging Fintech Startups to Look Out For in 2024",
    description:
      "This newsletter explores the latest trends in fintech and highlights some of the most promising startups in the space.",
    link: "google.com",
  },
  {
    timestamp: "2024-06-09T00:00:00.000Z",
    title:
      "AI Revolutionizes Customer Service: How Chatbots are Changing the Game",
    description:
      "Discover how advancements in artificial intelligence are transforming customer service experiences through the use of chatbots.",
    link: "google.com",
  },
  {
    timestamp: "2024-06-10T00:00:00.000Z",
    title: "The Future of Food Delivery: Drones vs. Self-Driving Cars",
    description:
      "This newsletter dives into the ongoing competition between drone and self-driving car technologies in the realm of food delivery services.",
    link: "google.com",
  },
  {
    timestamp: "2024-06-12T00:00:00.000Z",
    title:
      "Cybersecurity in the Age of Remote Work: Essential Tips for Businesses",
    description:
      "Explore practical strategies for businesses to ensure robust cybersecurity measures in today's remote work environment.",
    link: "google.com",
  },
  {
    timestamp: "2024-06-13T00:00:00.000Z",
    title: "Sustainable Innovation: Startups Leading the Green Revolution",
    description:
      "This newsletter spotlights innovative startups tackling environmental challenges and driving progress towards a sustainable future.",
    link: "google.com",
  },
  {
    timestamp: "2024-06-03T00:00:00.000Z",
    title: "The Rise of the Subscription Economy: How Businesses are Adapting",
    description:
      "Gain insights into the booming subscription economy and how businesses are strategizing to cater to this evolving consumer trend.",
    link: "google.com",
  },
  {
    timestamp: "2024-06-04T00:00:00.000Z",
    title: "Space Exploration Heats Up: Private Companies Take Center Stage",
    description:
      "This newsletter explores the increasing participation of private companies in space exploration endeavors.",
    link: "google.com",
  },
  {
    timestamp: "2024-06-05T00:00:00.000Z",
    title: "The Future of Work: How Automation is Reshaping Industries",
    description:
      "Uncover how automation is transforming various industries and the potential impact on the future of work.",
    link: "google.com",
  },
  {
    timestamp: "2024-06-05T00:00:00.000Z",
    title: "The Power of Blockchain: Revolutionizing Industries Beyond Finance",
    description:
      "Explore the expanding applications of blockchain technology beyond the realm of finance and its potential to disrupt various industries.",
    link: "google.com",
  },
  {
    timestamp: "2024-06-05T00:00:00.000Z",
    title: "Healthcare Innovation: Startups Pioneering Personalized Medicine",
    description:
      "This newsletter delves into the exciting advancements in personalized medicine driven by innovative startups in the healthcare sector.",
    link: "google.com",
  },
  {
    timestamp: "2024-06-07T00:00:00.000Z",
    title:
      "The Rise of Citizen Science: Crowdsourcing Solutions for Global Challenges",
    description:
      "Discover the growing trend of citizen science and how everyday people are contributing to scientific research and problem-solving.",
    link: "google.com",
  },
];

function show_btns(id) {
  document.getElementById(id).classList.remove("d-none");
}

function hide_btns(id) {
  document.getElementById(id).classList.add("d-none");
}

// Sort the data by timestamp in descending order (newest first)
default_contents.sort((a, b) => {
  // Parse the timestamps into Date objects for comparison
  const dateA = new Date(a.timestamp);
  const dateB = new Date(b.timestamp);

  // Compare the timestamps (greater date comes first)
  return dateB - dateA;
});

const lastpath = window.location.pathname.split("/").slice(-1)[0];
const container = document.getElementById("nl_container");
const date_now = new Date().toISOString().split("T")[0];

default_contents.map((item, index) => {
  const init_id = `date_${item.timestamp.split("T")[0]}`;
  const finalid = init_id.split("-").join("_");
  const is_today = date_now == item.timestamp.split("T")[0];

  console.log(item.timestamp);

  // Format the date object into the desired format (month name, day, year)
  const date = new Date(item.timestamp.split("T")[0]);
  const formatted_date = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const title = `<p class="pb-2 mt-4" id=${finalid}>${is_today ? "Today's Newsletter" : `${formatted_date} Newsletter`}</p>`; // prettier-ignore
  // check if title already exists
  const check_title = document.getElementById(finalid);

  if (!check_title) {
    let template = "";

    if (lastpath == "manage_newsletter.page.html") {
      template = `
        <div class="row" id="div_${finalid}">
          <div class="d-flex gap-2 py-2 nl_hover col-12" onmouseenter="show_btns('btns_${finalid}_${index}')" onmouseleave="hide_btns('btns_${finalid}_${index}')">
            <section class="nl_truncate w-100 p-2 rounded nl_body_card">
              <p class="nl_company_name nl_truncate">${item.title}</p>
              <p class="nl_brief_description nl_truncate">${item.description}</p>
            </section>

            <div class="d-flex align-items-center gap-2 d-none" id="btns_${finalid}_${index}">
              <button class="px-4 py-2 text-sm rounded btn btn-light">Edit</button>
              <button class="px-4 py-2 text-sm rounded btn btn-danger">Delete</button>
            </div>
          </div>
        </div>
  `;
    } else {
      template = `
        <div class="row" id="div_${finalid}">
            <div class="d-flex gap-2 py-2 nl_hover col-12 col-md-6">
                <img
                src="https://cdn.freelogovectors.net/wp-content/uploads/2023/05/accenture_logo-freelogovectors.net_.png"
                class="newsletter_logo"
                alt=""
                />
                <section class="nl_truncate w-100 p-2 rounded nl_body_card">
                    <p class="nl_company_name nl_truncate">${item.title}</p>
                    <p class="nl_brief_description nl_truncate mb-4">${item.description}</p>
                    <a href=${item.link}>Read more</a>
                </section>
            </div>
        </div>
    `;
    }

    container.innerHTML += title;
    container.innerHTML += template;
  } else {
    const parent_div = document.getElementById(`div_${finalid}`);
    let template = "";

    if (lastpath == "manage_newsletter.page.html") {
      template = `
        <div class="d-flex gap-2 py-2 nl_hover col-12" onmouseenter="show_btns('btns_${finalid}_${index}')" onmouseleave="hide_btns('btns_${finalid}_${index}')">
          <section class="nl_truncate w-100 p-2 rounded nl_body_card">
            <p class="nl_company_name nl_truncate">${item.title}</p>
            <p class="nl_brief_description nl_truncate">${item.description}</p>
          </section>

          <div class="d-flex align-items-center gap-2 d-none" id="btns_${finalid}_${index}">
            <button class="px-4 py-2 text-sm rounded btn btn-light">Edit</button>
            <button class="px-4 py-2 text-sm rounded btn btn-danger">Delete</button>
          </div>
        </div>
      `;
    } else {
      template = `
        <div class="d-flex gap-2 py-2 nl_hover col-12 col-md-6">
            <img
            src="https://cdn.freelogovectors.net/wp-content/uploads/2023/05/accenture_logo-freelogovectors.net_.png"
            class="newsletter_logo"
            alt=""
            />
            <section class="nl_truncate w-100 p-2 rounded nl_body_card">
                <p class="nl_company_name nl_truncate">${item.title}</p>
                <p class="nl_brief_description nl_truncate mb-4">${item.description}</p>
                <a href=${item.link}>Read more</a>
            </section>
        </div>
    `;
    }

    parent_div.innerHTML += template;
  }
});
