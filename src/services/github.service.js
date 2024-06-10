import axios from 'axios';
import config from '../configApp';

const instance = axios.create({
  baseURL: config.GITHUB_API_URL,
  headers: {
    Authorization: `Bearer ${config.GITHUB_TOKEN}`
  }
});

class GitHubService {
  getGithubRepos() {
    return instance.get('/repos')
  }
}

export default new GitHubService();