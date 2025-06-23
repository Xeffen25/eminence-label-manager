# Eminence Label Manager

This guide explains how to integrate the Eminence Label Manager GitHub Action
into your repository for automated label management. This action allows you to
define your labels in a `labels.json` file and automatically manage them through
a GitHub workflow.

## Steps to Integrate

### 1. Create `labels.json`:

- In your repository's `.github` directory, create a file named `labels.json`.
- Populate `labels.json` with an array of label objects. Each object should
  define the label's `name`, `color`, and `description`.

**Example `labels.json`:**

```jsonc
[
  {
    "name": "Accessibility",
    "color": "1d76db",
    "description": "Issues related to making the site more accessible."
  },
  {
    "name": "Performance",
    "color": "d4c5f9",
    "description": "Issues related to site speed and efficiency."
  }
  // Add more labels as needed.
]
```

### 2. Create `labels.yml` Workflow:

- In your repository's `.github/workflows` directory, create a file named
  `labels.yml`.
- Add the following workflow configuration to `labels.yml`:

```yaml
name: Manage Labels
on:
    workflow_dispatch:
    push:
        branches:
            - main
        paths:
            - .github/labels.json
jobs:
    manage_labels:
        runs-on: ubuntu-latest
        permissions:
            issues: write
        steps:
            - name: Checkout repository
                uses: actions/checkout@v4

            - name: Run Eminence Label Manager
                uses: Xeffen25/eminence-label-manager@1.0.0
                with:
                    token: ${{ secrets.GITHUB_TOKEN }}
```

## How it Works

- When you push changes to your `labels.json` file on the `main` branch, the
  `labels.yml` workflow will automatically run.
- You can also manually trigger the workflow from the "Actions" tab in your
  GitHub repository.
- The Eminence Label Manager action will then synchronize the labels defined in
  `labels.json` with your repository's labels. Any new labels will be created,
  existing labels will be updated, and labels that are no longer defined in
  `labels.json` will be removed.

## Important Notes

- Ensure that the `GITHUB_TOKEN` secret is available to your workflow. GitHub
  automatically provides this secret.
- Make sure you have created the .github directory in the root of your
  repository and that the labels.json and workflows/labels.yml files are
  contained within.
- This action will remove any existing labels in your repository that are not
  defined in your labels.json file. Be careful to include all needed labels in
  your labels.json.
- Update the version number of the action in the `uses:` line of the workflow if
  a newer version is released.
