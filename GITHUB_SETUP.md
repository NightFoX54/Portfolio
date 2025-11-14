# GitHub Setup Guide - Single Repository

This guide will help you:
1. Remove the existing git repository from the frontend
2. Initialize a single git repository at the root level
3. Commit both backend and frontend to one repository
4. Push to GitHub

---

## Step 1: Remove Frontend Git Repository

### Option A: Using File Explorer (Windows)
1. Navigate to `portfolio frontend/my-portfolio/`
2. Show hidden files (View → Show → Hidden items)
3. Delete the `.git` folder if it exists

### Option B: Using PowerShell/Terminal
```powershell
# Navigate to project root
cd "C:\Users\e1a54\OneDrive\Masaüstü\projeler\portfolio"

# Remove frontend git repository (if exists)
Remove-Item -Path "portfolio frontend/my-portfolio/.git" -Recurse -Force -ErrorAction SilentlyContinue
```

---

## Step 2: Check for Existing Git Repository at Root

```powershell
# Check if .git exists at root
Test-Path ".git"
```

If it returns `True`, skip Step 3. If it returns `False`, continue to Step 3.

---

## Step 3: Initialize Git Repository at Root

```powershell
# Navigate to project root
cd "C:\Users\e1a54\OneDrive\Masaüstü\projeler\portfolio"

# Initialize git repository
git init

# Set default branch to main
git branch -M main
```

---

## Step 4: Verify .gitignore File

Make sure the root `.gitignore` file exists and includes:
- `portfolio backend/docker-compose.yml` (contains credentials)
- `portfolio backend/target/` (build output)
- `portfolio frontend/my-portfolio/node_modules/` (dependencies)
- `.env` files (environment variables)
- Other build outputs and IDE files

The `.gitignore` file should already be created at the root level.

---

## Step 5: Check What Will Be Committed

```powershell
# Add all files to staging
git add .

# Check status (VERIFY NO SENSITIVE DATA!)
git status
```

**Important**: Before committing, verify:
- ❌ No `docker-compose.yml` with real credentials
- ❌ No `.env` files with real credentials
- ❌ No `application.yml` with real passwords
- ✅ Only placeholder values in configuration files

---

## Step 6: Create Initial Commit

```powershell
# Commit all files
git commit -m "Initial commit: Portfolio project with Spring Boot backend and Next.js frontend"
```

---

## Step 7: Create GitHub Repository

1. Go to [GitHub.com](https://github.com) and sign in
2. Click the **"+"** icon in the top right → **"New repository"**
3. Fill in:
   - **Repository name**: `portfolio` (or your preferred name)
   - **Description**: "Full-stack portfolio application with Spring Boot backend and Next.js frontend"
   - **Visibility**: Choose **Public** or **Private**
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
4. Click **"Create repository"**

---

## Step 8: Add Remote Repository

```powershell
# Add remote repository (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/portfolio.git

# Verify remote
git remote -v
```

---

## Step 9: Push to GitHub

```powershell
# Push to GitHub
git push -u origin main
```

If you're asked for credentials:
- **Username**: Your GitHub username
- **Password**: Use a Personal Access Token (not your GitHub password)
  - Generate token: GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic) → Generate new token
  - Select scopes: `repo` (full control of private repositories)
  - Copy the token and use it as password

---

## Step 10: Verify Upload

1. Go to your GitHub repository: `https://github.com/YOUR_USERNAME/portfolio`
2. Verify that:
   - ✅ All files are uploaded
   - ✅ `README.md` is visible
   - ✅ `.gitignore` is present
   - ❌ `docker-compose.yml` is NOT visible (it's in .gitignore)
   - ❌ No `.env` files are visible
   - ❌ No real credentials in `application.yml`

---

## Troubleshooting

### Issue: "Repository not found"

**Solution**: 
- Check that the repository name is correct
- Check that you have access to the repository
- Verify remote URL: `git remote -v`
- Update remote if needed: `git remote set-url origin https://github.com/YOUR_USERNAME/portfolio.git`

### Issue: "Authentication failed"

**Solution**: 
- Use Personal Access Token instead of password
- Generate token: GitHub → Settings → Developer settings → Personal access tokens
- Or use SSH: `git remote set-url origin git@github.com:USERNAME/REPO.git`

### Issue: "Large file" error

**Solution**: 
- Check `.gitignore` includes `node_modules/`, `target/`, etc.
- Remove large files from git: `git rm --cached large-file`
- Use Git LFS for large files if needed

### Issue: "Frontend .git folder still exists"

**Solution**: 
- Manually delete: `Remove-Item -Path "portfolio frontend/my-portfolio/.git" -Recurse -Force`
- Or use: `rm -rf "portfolio frontend/my-portfolio/.git"` (if using Git Bash)

### Issue: "Sensitive data detected"

**Solution**: 
- Remove credentials from files
- Use environment variables instead
- Add sensitive files to `.gitignore`
- If already committed, remove from history:
  ```powershell
  git rm --cached portfolio\ backend\docker-compose.yml
  git commit -m "Remove sensitive data"
  git push
  ```

---

## Security Checklist

Before pushing, verify:

- [ ] No AWS credentials in committed files
- [ ] No MongoDB passwords in committed files
- [ ] No JWT secrets in committed files
- [ ] `docker-compose.yml` is in `.gitignore`
- [ ] `.env` files are in `.gitignore`
- [ ] `application.yml` uses environment variables (not real passwords)
- [ ] No API keys or tokens in code

---

## Quick Reference Commands

```powershell
# Initialize git
git init
git branch -M main

# Add files
git add .

# Check status
git status

# Commit
git commit -m "Your commit message"

# Add remote
git remote add origin https://github.com/YOUR_USERNAME/portfolio.git

# Push
git push -u origin main

# View remote
git remote -v

# Change remote URL
git remote set-url origin https://github.com/USERNAME/REPO.git

# Remove frontend git (if needed)
Remove-Item -Path "portfolio frontend/my-portfolio/.git" -Recurse -Force
```

---

## Next Steps

1. ✅ Repository is on GitHub
2. 🔄 Set up GitHub Actions for CI/CD (optional)
3. 🔄 Add branch protection rules (optional)
4. 🔄 Create issues and project board (optional)
5. 🔄 Add collaborators (optional)
6. 🔄 Set up deployment pipelines (optional)

