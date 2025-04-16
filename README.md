# GitHub Repo Analyzer

A full-stack web application to analyze public GitHub repositories. Enter a repository URL to view:
- Repository metadata (name, stars, forks, open issues)
- Contributor list
- Weekly commit activity (visualized)
- Commit frequency metrics (total, average, max/min, most/least active week)

## Features
- **Express.js backend** with a `/analyze` POST endpoint that fetches repo data using GitHub's REST API
- **React frontend** styled with Tailwind CSS
- **Commit activity chart** powered by Recharts
- **Dockerized**: Build and run both frontend and backend in a single container

## Quick Start (Docker)
1. **Clone this repo** and `cd` into the project directory.
2. *(Optional but recommended)* Create a `.env` file with your [GitHub Personal Access Token](https://github.com/settings/tokens):
    ```env
    GITHUB_TOKEN=ghp_xxxYOURTOKENHERExxx
    PORT=3001
    ```
   - Without a token, you are limited to 60 GitHub API requests per hour.
3. **Build and run the app:**
    ```sh
    docker build -t github-analyzer .
    docker run -p 3001:3001 --env-file .env github-analyzer
    ```
4. **Open [http://localhost:3001](http://localhost:3001) in your browser.**

## Development (without Docker)
### Backend
```sh
cd /path/to/CSF
npm install
node index.js
```

### Frontend
```sh
cd frontend
npm install
npm start
```
- The frontend will run on port 3000 by default. Update `REACT_APP_BACKEND_URL` in `frontend/.env` if needed.

## API
- **POST `/analyze`**
    - Body: `{ "repoUrl": "https://github.com/owner/repo" }`
    - Returns: repo metadata, contributors, weekly commit activity, and commit frequency metrics.

## Example Output
- **Repo metadata:** Name, stars, forks, open issues
- **Contributors:** Username, avatar, contributions
- **Commit metrics:**
    - Total commits (last 52 weeks)
    - Average commits/week
    - Most/least active week
- **Commit activity chart:** Commits per week (last year)

## License
MIT

---

*Built with Express, React, Tailwind CSS, and Recharts.*
