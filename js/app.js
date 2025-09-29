// Constant to hold the API URL
const API_URL = "https://u9jp06g0d1.execute-api.eu-central-1.amazonaws.com/Prod/projects"

// Fetch and render projects function

function renderProjects(projects, container) { // takes projects array and container element as input
    container.innerHTML = ""; //clear any HTML content from the container

    if (projects.length === 0) {
        container.innerHTML = "<p>No projects found. </p>";
        return;
    }

    projects.forEach(project => { // Loop through projects in data array
        
        const projectCard = document.createElement("div"); // create div-container projectCard
        projectCard.className = "project-card"; // Add .project-card class for styling to projectCard-container
        
        const projectTitle = document.createElement("h3"); // create h3-title projectTitle
        projectTitle.textContent = project.projectName; // set text content of projectTitle to string value of projectName key; DynamoDB returns JSON; .S is used to access a string in a JSON object
        
        const projectDescription = document.createElement("p"); // create p-paragraph projectDescription
        projectDescription.textContent = project.description; // 

        const techList = document.createElement("div"); // create div-container techList
        techList.className = "technologies"; // Add .technologies class for styling to techList-container

        project.technologiesUsed.forEach(tech => { // accesses the technologiesUsed key in project JSON object, which holds a list and loops through each item of that list
            const techTag = document.createElement("span"); // creates span-element for each techTag list item
            techTag.className = "tech-tag"; // add .tech-tag class for styling to techTag span
            techTag.textContent = tech; // access string value from list item
            techList.appendChild(techTag); // appends techTag span to techList div
        });

        // assemble card
        projectCard.appendChild(projectTitle); // append projectTitle to projectCard
        projectCard.appendChild(projectDescription); // append projectDescription to projectCard
        projectCard.appendChild(techList); // append techList to projectCard

        container.appendChild(projectCard);
    });
}

async function getProjects() { //async fucntion allows to use "await" keyword for cleaner promise handling
    console.log("Fetching projects from API…");
    const projectsContainer = document.getElementById("projects-container");

    try {
        // asynchronous API call
        const response = await fetch(API_URL); // calls backend API and pauses fucntion until network response complete
        // check success
        if (!response.ok) { // checks if response is in 200 - 299 range
            throw new Error("HTTP error! status:${response.status}");
        }
        // parse JSON response
        const projects = await response.json(); // parses repsonse body as JSON
        console.log("Successfully fetched projects:", projects);

        // --- old rendering logic: if there are no projects, inform the user  ---
        // if (projects.length === 0) {
        //     projectsContainer.innerHTML = "<p>No projects found. Add some to DynamoDB.</p>";
        //     return;
        // Tue, Sep23: display raw data for proof
        // const pre = document.createElement("pre");
        // pre.textContent = JSON.stringify(projects, null, 2);
        // projectsContainer.appendChild(pre);

        renderProjects(projects, projectsContainer);

        } catch (error) {
        // handling errors occurred during the fetch
        console.error("Failed to fetch projects:", error);
        projectsContainer.innerHTML = "<p>Sorry, something went wrong while fetching projects.</p>";
    }
}

// call main function when script loads
getProjects();