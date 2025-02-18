const fs = require('fs');
const fetch = require('node-fetch');

async function fetchLatestProjects() {
  try {
    const res = await fetch('https://api.github.com/users/Icily57/repos?sort=updated&per_page=3');
    const repos = await res.json();
    return repos.map(repo => `- [${repo.name}](${repo.html_url}) - ${repo.description}`).join('\n');
  } catch (error) {
    console.error('Error fetching latest projects:', error);
    return 'Failed to fetch latest projects.';
  }
}

async function fetchQuoteOfTheDay() {
  try {
    const res = await fetch('https://api.quotable.io/random');
    const quote = await res.json();
    return `"${quote.content}" - ${quote.author}`;
  } catch (error) {
    console.error('Error fetching quote of the day:', error);
    return 'Failed to fetch quote of the day.';
  }
}

async function updateReadme() {
  const readmePath = '../../README.md'; // Update this path
  let readmeContent = fs.readFileSync(readmePath, 'utf-8');

  const latestProjects = await fetchLatestProjects();
  readmeContent = readmeContent.replace(/<!-- PROJECTS:START -->[\s\S]*<!-- PROJECTS:END -->/, `<!-- PROJECTS:START -->\n${latestProjects}\n<!-- PROJECTS:END -->`);

  const quote = await fetchQuoteOfTheDay();
  readmeContent = readmeContent.replace(/<!-- QUOTE:START -->[\s\S]*<!-- QUOTE:END -->/, `<!-- QUOTE:START -->\n${quote}\n<!-- QUOTE:END -->`);

  fs.writeFileSync(readmePath, readmeContent);
}

updateReadme();