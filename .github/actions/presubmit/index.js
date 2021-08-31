const core = require('@actions/core');
const github = require('@actions/github');

const LABEL = 'presubmit';

async function run() {
  const githubToken = core.getInput('github_token', {required: true});
  const isPresubmit = core.getBooleanInput('is_presubmit', {required: true});
  const [owner, repo] = process.env.GITHUB_REPOSITORY.split('/');
  const issue_number = core.getInput('number')
    ? parseInt(core.getInput('number'))
    : github.context.issue.number;
  const octokit = github.getOctokit(githubToken);

  if (isPresubmit) {
    try {
      await octokit.rest.issues.removeLabel({
        name: LABEL,
        owner,
        repo,
        issue_number,
      });
      core.info(`Succeeded to remove label: ${LABEL}`);
    } catch (e) {
      core.notice(`Failed to remove label: ${LABEL}`);
    }
  } else {
    core.setFailed(`Pull request does not have label: ${LABEL}`);
  }
}

run();
