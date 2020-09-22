const parseRepo = (repo) => {
    const repoProps = repo.split('/');
    if (!validateUrl(repo)) {
        return null;
    }
    else if (repoProps.length !== 5) {
        return null;
    } else {
        return {
            owner: repoProps[3],
            repo: repoProps[4]
        }
    }
}

const fetchWithAuth = async (url) => {
    const res = await fetch(url,
        {
            headers: new Headers({
                "Authorization": "Basic " + Buffer.from("debasreedash:976eaf92efca2767427eff656471646b4c4487c0").toString("base64")
            })
        });
    return res;
}

const validateUrl = (url) => {
    const regExp = /https:\/\/(www\.)?github\.com\/.+\/.+/
    return regExp.test(url);
}

const getCommits = async (url) => {
    const res = await fetchWithAuth(url);
    const commits = await res.json();
    return commits.length;
}

const getComments = async (url) => {
    const res = await fetchWithAuth(url);
    const comments = await res.json();
    return comments.length;
}

const getResultsFromGithubUrl = async (repo, page) => {
    let results = [];
    if (repo !== '' && validateUrl(repo)) {
        let repoProps = parseRepo(repo);
        if (repoProps !== null) {
            let url = `https://api.github.com/repos/${repoProps.owner}/${repoProps.repo}/pulls?page=${page}`;
            const res = await fetchWithAuth(url);
            const pullRequests = await res.json();
            for (let pullRequest of pullRequests) {
                const [commits, comments] = await Promise.all([
                    getCommits(pullRequest.commits_url),
                    getComments(pullRequest.comments_url)
                ]);
                results.push({
                    id: pullRequest.id,
                    title: pullRequest.title,
                    user: pullRequest.user.login,
                    commits: commits,
                    comments: comments
                });
            }
            return results;
        }
    } else {
        return results;
    }
}

const getTotalResultsFromGithubUrl = async (repo) => {
    let repoProps = parseRepo(repo);
    if (repo !== '' && repoProps !== null) {
        let url = `https://api.github.com/search/issues?q=is:pr+is:open+repo:${repoProps.owner}/${repoProps.repo}`
        const res = await fetchWithAuth(url);
        const pullRequestStats = await res.json();
        return pullRequestStats.total_count;
    }

}

export {
    getResultsFromGithubUrl,
    getTotalResultsFromGithubUrl,
    validateUrl
};
