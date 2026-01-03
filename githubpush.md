# Git Push Strategy: Atomic Commits & Immediate Pushes

This document defines the **STRICT** operating procedure for pushing code. The goal is extreme granularity: every distinct piece of functionality must be its own commit, and every commit must be pushed immediately to the remote.

## 🚫 Anti-Patterns
*   **Batch Push**: Accumulating multiple commits before pushing.
*   **Bulk Commit**: Combining multiple components (e.g., Header AND Footer) in one commit.
*   **"WIP" Commits**: Committing broken or incomplete code.

## ✅ The Golden Rule: "One Thing, One Commit, One Push"

For every single file or closely related logical unit (e.g., a component and its test):
1.  **Stage** only that file.
2.  **Commit** with a descriptive message.
## ✅ The Golden Rule: "Atomic Commit, Push on Approval"

1.  **Stage** atomic units (one file/component).
2.  **Commit** with descriptive message.
3.  **WAIT** for user approval before pushing.

---

## Execution Workflow

### 1. Configuration & Documentation
```bash
git add package.json
git commit -m "docs: Update dependencies"
# WAIT FOR APPROVAL
# git push origin master
```

### 2. Components / Pages / Tests
Process remains the same (Atomic Commits), but the final `git push` command is **deferred** until explicitly requested.

## Summary Checklist

- [ ] **Atomic**: Did I commit only *one* logical unit?
- [ ] **Verified**: Did I check the commit locally?
- [ ] **Approval**: Did I get the "Go Ahead" to push?
