import { jest } from '@jest/globals'
import * as core from '../__fixtures__/core.js' // Assuming this mock correctly stubs core functions

// Mock the modules that main.ts imports
// Explicitly define the return type of the mock functions to be Promise<void>
// This tells TypeScript that these functions are expected to return a Promise that resolves to void,
// which is compatible with being rejected by an Error.
const mockDeleteLabels = jest.fn<() => Promise<void>>()
const mockCreateLabels = jest.fn<() => Promise<void>>()

jest.unstable_mockModule('@actions/core', () => core)
jest.unstable_mockModule('../src/delete-labels.js', () => ({
  deleteLabels: mockDeleteLabels
}))
jest.unstable_mockModule('../src/create-labels.js', () => ({
  createLabels: mockCreateLabels
}))

// Import the module under test dynamically after mocks are set up
const { run } = await import('../src/main.js')

describe('main.ts', () => {
  beforeEach(() => {
    // Clear all mock calls before each test
    jest.clearAllMocks()
  })

  it('successfully calls deleteLabels and createLabels in order', async () => {
    await run()

    // Expect deleteLabels to be called first and once
    expect(mockDeleteLabels).toHaveBeenCalledTimes(1)
    expect(core.info).toHaveBeenCalledWith('START: Deleting labels')
    expect(core.info).toHaveBeenCalledWith('END: Deleting labels')

    // Expect createLabels to be called after deleteLabels and once
    expect(mockCreateLabels).toHaveBeenCalledTimes(1)
    expect(core.info).toHaveBeenCalledWith('START: Creating labels')
    expect(core.info).toHaveBeenCalledWith('END: Creating labels')

    // Ensure setFailed was NOT called
    expect(core.setFailed).not.toHaveBeenCalled()
  })

  it('calls core.setFailed if deleteLabels throws an error', async () => {
    const errorMessage = 'Failed to delete labels for some reason.'
    mockDeleteLabels.mockRejectedValueOnce(new Error(errorMessage))

    await run()

    // Expect deleteLabels to have been called
    expect(mockDeleteLabels).toHaveBeenCalledTimes(1)
    // Expect createLabels NOT to be called if deleteLabels fails
    expect(mockCreateLabels).not.toHaveBeenCalled()
    // Expect core.setFailed to be called with the error message
    expect(core.setFailed).toHaveBeenCalledTimes(1)
    expect(core.setFailed).toHaveBeenCalledWith(errorMessage)
  })

  it('calls core.setFailed if createLabels throws an error', async () => {
    const errorMessage = 'Failed to create labels for some reason.'
    mockCreateLabels.mockRejectedValueOnce(new Error(errorMessage))

    await run()

    // Expect both deleteLabels and createLabels to have been called, with createLabels failing
    expect(mockDeleteLabels).toHaveBeenCalledTimes(1)
    expect(mockCreateLabels).toHaveBeenCalledTimes(1)
    // Expect core.setFailed to be called with the error message
    expect(core.setFailed).toHaveBeenCalledTimes(1)
    expect(core.setFailed).toHaveBeenCalledWith(errorMessage)
  })
})
