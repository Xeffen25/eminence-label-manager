// main.ts
import * as core from '@actions/core'
import { createLabels } from './create-labels.ts'
import { deleteLabels } from './delete-labels.ts'

export async function run(): Promise<void> {
  try {
    await deleteLabels()
    await createLabels()
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message)
    } else {
      core.setFailed(`An unknown error occurred: ${error}`)
    }
  }
}
