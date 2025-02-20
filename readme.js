const fs = require('fs');
const fetch = require('node-fetch');

async function fetchWithRetry(url, options = {}, retries = 3, backoff = 3000) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, options);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return await res.json();
    } catch (error) {
      console.error(`Attempt ${i + 1} failed: ${error.message}`);
      if (i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, backoff));
      } else {
        throw error;
      }
    }
  }
}

async function fetchLatestProjects() {
  try {
    const repos = await fetchWithRetry('https://api.github.com/users/Icily57/repos?sort=updated&per_page=3');
    return repos.map(repo => `- [${repo.name}](${repo.html_url}) - ${repo.description}`).join('\n');
  } catch (error) {
    console.error('Error fetching latest projects:', error);
    return 'Failed to fetch latest projects.';
  }
}

async function fetchQuoteOfTheDay() {
  try {
    const quote = await fetchWithRetry('https://api.quotable.io/random');
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
