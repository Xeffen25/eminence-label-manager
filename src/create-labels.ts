// create-labels.ts
import * as core from '@actions/core'
import * as github from '@actions/github'
import * as fs from 'fs'
import * as path from 'path'

/**
 * Creates or updates labels from a labels.json file.
 *
 * @returns Resolves when the action is complete.
 */
export async function createLabels(): Promise<void> {
  core.info('Retriving token from input')
  const token = core.getInput('token', { required: true })
  core.info('Creating octokit instance')
  const octokit = github.getOctokit(token)
  core.info('Retriving repo and owner information')
  const { owner, repo } = github.context.repo

  core.info('Reading labels.json file')
  const labelsFilePath = path.join('.github', 'labels.json')
  if (!fs.existsSync(labelsFilePath)) {
    core.setFailed(`labels.json not found at ${labelsFilePath}`)
    return
  }
  const labelsData = JSON.parse(fs.readFileSync(labelsFilePath, 'utf8'))

  core.info('Cheking if labels.json is an array')
  if (!Array.isArray(labelsData)) {
    core.setFailed('labels.json does not contain an array.')
    return
  }

  core.info('Stating label creating loop')
  for (const label of labelsData) {
    core.info('Checking label data is valid')
    if (
      typeof label.name !== 'string' ||
      typeof label.color !== 'string' ||
      (label.description && typeof label.description !== 'string')
    ) {
      core.warning(`Invalid label data: ${JSON.stringify(label)}. Skipping.`)
      continue
    }

    try {
      core.info(`Trying to create label: ${label.name}`)
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
