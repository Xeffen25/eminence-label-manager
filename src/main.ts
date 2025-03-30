// main.ts
import * as core from '@actions/core'
import { createLabels } from './create-labels.ts'
import { deleteLabels } from './delete-labels.ts'

export async function run(): Promise<void> {
  try {
    core.info('STATING LABELS DELETION')
    await deleteLabels()
    core.info('ENDED LABELS DELETION')
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(`UNKNON ERROR DELETING LABELS: , ${error.message}`)
    } else {
      core.setFailed(`UNKNON ERROR DELETING LABELS: ${error}`)
    }
  }
  try {
    core.info('STATING LABELS DELETION')
    await createLabels()
    core.info('ENDED LABELS DELETION')
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(`UNKNON ERROR CREATING LABELS: , ${error.message}`)
    } else {
      core.setFailed(`UNKNON ERROR CREATING LABELS: ${error}`)
    }
  }
}
