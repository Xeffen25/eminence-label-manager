// __fixtures__/github.js
import { jest } from '@jest/globals'

export const context = {
  repo: {
    owner: 'mock-owner',
    repo: 'mock-repo'
  }
}

export const getOctokit = jest.fn().mockReturnValue({
  rest: {
    issues: {
      listLabelsForRepo: jest.fn(),
      deleteLabel: jest.fn(),
      createLabel: jest.fn()
    }
  }
})
