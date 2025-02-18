const fs = require('fs');
const fetch = require('node-fetch');

async function fetchLatestProjects() {
  const res = await fetch('https://api.github.com/users/Icily57/repos?sort=updated&per_page=3');
  const repos = await res.json();

  return repos.map(repo => `- [${repo.name}](${repo.html_url}) - ${repo.description}`).join('\n');
}

async function fetchQuoteOfTheDay() {
  const res = await fetch('https://api.quotable.io/random');
  const quote = await res.json();

  return `"${quote.content}" - ${quote.author}`;
}

async function updateReadme() {
  const readmePath = './README.md';
  let readmeContent = fs.readFileSync(readmePath, 'utf-8');

  const latestProjects = await fetchLatestProjects();
  readmeContent = readmeContent.replace(/<!-- PROJECTS:START -->[\s\S]*<!-- PROJECTS:END -->/, `<!-- PROJECTS:START -->\n${latestProjects}\n<!-- PROJECTS:END -->`);

  const quote = await fetchQuoteOfTheDay();
  readmeContent = readmeContent.replace(/<!-- QUOTE:START -->[\s\S]*<!-- QUOTE:END -->/, `<!-- QUOTE:START -->\n${quote}\n<!-- QUOTE:END -->`);

  fs.writeFileSync(readmePath, readmeContent);
}

updateReadme();
