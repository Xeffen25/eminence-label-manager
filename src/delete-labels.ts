import * as core from '@actions/core'
import * as github from '@actions/github'

/**
 * Deletes all labels in the repository.
 */
export async function deleteLabels(): Promise<void> {
  try {
    const token = core.getInput('token', { required: true })
    const octokit = github.getOctokit(token)
    const { owner, repo } = github.context.repo

    // Fetch all labels
    const labels = await octokit.rest.issues.listLabelsForRepo({
      owner,
      repo
    })

    if (labels.data.length === 0) {
      core.info('No labels found in the repository.')
      return
    }

    // Delete each label
    for (const label of labels.data) {
      try {
        await octokit.rest.issues.deleteLabel({
          owner,
          repo,
          name: label.name
        })
        core.info(`Deleted label: ${label.name}`)
      } catch (deleteError) {
        core.setFailed(
          `Failed to delete label: ${label.name}. Error: ${deleteError}`
        )
      }
    }
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}
