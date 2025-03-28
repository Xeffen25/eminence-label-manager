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
  try {
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
        core.warning(`Invalid label data: ${JSON.stringify(label)}. Skipping.`)
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
        // Narrow the type of the caught error.
        if (
          error instanceof Error &&
          'status' in error &&
          typeof (error as any).status === 'number'
        ) {
          const createError = error as any // Type assertion to access 'status'
          if (createError.status === 422) {
            try {
              await octokit.rest.issues.updateLabel({
                owner,
                repo,
                name: label.name,
                color: label.color,
                description: label.description
              })
              core.info(`Updated label: ${label.name}`)
            } catch (updateError) {
              if (updateError instanceof Error) {
                core.error(
                  `Failed to create or update label: ${label.name}. Error: ${updateError.message}`
                )
              } else {
                core.error(
                  `Failed to create or update label: ${label.name}. Error: ${updateError}`
                )
              }
            }
          } else {
            if (error instanceof Error) {
              core.error(
                `Failed to create label: ${label.name}. Error: ${error.message}`
              )
            } else {
              core.error(
                `Failed to create label: ${label.name}. Error: ${error}`
              )
            }
          }
        } else {
          if (error instanceof Error) {
            core.error(
              `Failed to create label: ${label.name}. Error: ${error.message}`
            )
          } else {
            core.error(`Failed to create label: ${label.name}. Error: ${error}`)
          }
        }
      }
    }

    core.info('Label creation/update process completed.')
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}
