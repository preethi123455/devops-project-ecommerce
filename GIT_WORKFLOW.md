# Cartify Git Workflow - Two Branch Strategy

## Branch Structure

### 1. **main** Branch (Customer-Facing)
- Contains customer-facing pages and features
- Public storefront code
- Excludes all admin-only routes and functionality
- Pages included:
  - `/` (Home)
  - `/login` (Customer Login)
  - `/signup` (Customer Signup)
  - `/products` (Product Browsing)
  - `/cart` (Shopping Cart)
  - `/checkout` (Checkout Process)
  - `/orders` (Customer Order History)
  - `/orders/[orderId]` (Order Details)

### 2. **admin** Branch (Admin-Only)
- Contains admin dashboard and management pages
- All order management functionality
- Product management system
- Admin-specific routes and logic
- Pages included:
  - `/admin` (Admin Dashboard)
  - `/admin/orders/[orderId]` (Order Management)
  - All customer-facing pages (for admin testing)
  - Product management with add/edit/delete

## Merge Strategy

```
          main (Customer)
            |
            |---- merged from admin
            |
          admin (Admin)
            |
            |---- contains all from main
```

### When to Merge

**Admin → Main**: When new customer features are ready
- Merge admin branch into main for production release
- Admin features are excluded from main branch

**Main → Admin**: Keep admin always up to date
- Pull latest customer features into admin for testing
- Admin branch always has latest code + admin features

## File Structure Differences

### main Branch - Excludes:
```
/app/admin/ (entire directory)
/lib/categories.ts (admin-specific utilities)
ADMIN_FEATURES.md
```

### admin Branch - Includes:
```
/app/admin/ (complete)
All customer-facing code
All utilities and contexts
Complete feature set
```

## Development Workflow

1. **Feature Development**:
   - Develop customer features on main
   - Develop admin features on admin
   - Keep admin synced with main regularly

2. **Testing**:
   - Test customer features on main
   - Test admin features on admin
   - Test customer features also on admin branch

3. **Deployment**:
   - Deploy main to production (customer site)
   - Deploy admin to admin portal
   - Or use separate builds for each

## Commands Reference

```bash
# Create admin branch from main
git checkout -b admin main

# Switch to main
git checkout main

# Switch to admin
git checkout admin

# Merge admin changes into main (selective)
git merge admin --no-commit --no-ff

# Pull main into admin (keep admin updated)
git checkout admin
git pull origin main

# Commit changes
git commit -m "message"

# Push branches
git push origin main
git push origin admin
```

## Automated CI/CD Workflow

The project is now configured with an automated Jenkins pipeline that responds to pushes on both branches.

### 1. Working on Admin Branch
1. **Pull latest**: `git pull origin admin`
2. **Make changes**: (e.g., update admin dashboard or product logic)
3. **Commit & Push**:
   ```bash
   git add .
   git commit -m "update admin features"
   git push origin admin
   ```
4. **Automation**: Jenkins detects the push and deploys to **Staging (Port 3001)**.

### 2. Merging and Deploying to Production
1. **Switch to main**: `git checkout main`
2. **Pull latest**: `git pull origin main`
3. **Merge admin**: `git merge admin`
4. **Push to main**:
   ```bash
   git push origin main
   ```
5. **Automation**: Jenkins detects the push and deploys to **Production (Port 3000)**.

---

## Commands Summary
- **Staging Test (Port 3001)**: Push to `admin` branch
- **Production Update (Port 3000)**: Merge `admin` into `main` and push to `main`
