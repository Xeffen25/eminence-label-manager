import * as core from '@actions/core'
import * as github from '@actions/github'
import * as fs from 'fs'
import * as path from 'path'

/**
 * Creates labels from a labels.json file.
 */
export async function createLabels(): Promise<void> {
  const token = core.getInput('token', { required: true })
  const octokit = github.getOctokit(token)
  const { owner, repo } = github.context.repo

  const labelsFilePath = path.join('.github', 'labels.json')
  if (!fs.existsSync(labelsFilePath)) {
    core.setFailed(`labels.json not found at ${labelsFilePath}`)
    return
  }
  const labelsData = JSON.parse(fs.readFileSync(labelsFilePath, 'utf8'))

  if (!Array.isArray(labelsData)) {
    core.setFailed('labels.json does not contain an array.')
    return
  }

  for (const label of labelsData) {
    if (
      typeof label.name !== 'string' ||
      typeof label.color !== 'string' ||
      (label.description && typeof label.description !== 'string')
    ) {
      core.setFailed(`Invalid label data: ${JSON.stringify(label)}. Skipping.`)
      continue
    }

    try {
      await octokit.rest.issues.createLabel({
        owner,
        repo,
        name: label.name,
        color: label.color,
        description: label.description
      })
      core.info(`Created label: ${label.name}`)
    } catch (error) {
      core.setFailed(`Error creating label: ${label.name}. ${error}`)
    }
  }
}
