import * as core from '@actions/core'
import { deleteLabels } from './delete-labels.js'
import { createLabels } from './create-labels.js'

/**
 * The main function for the action.
 *
 * @returns Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    core.info('START: Deleting labels')
    await deleteLabels()
    core.info('END: Deleting labels')
    core.info('START: Creating labels')
    await createLabels()
    core.info('END: Creating labels')
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}
