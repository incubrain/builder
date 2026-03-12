# Agent-Browser Test Scripts

These test scripts are designed for use with [agent-browser](https://github.com/vercel-labs/agent-browser) to automate testing of auth-protected routes in development.

## Prerequisites

1. Dev server running: `pnpm dev`
2. agent-browser skill installed: `bash scripts/install-skills.sh`

## Test User

- **Email:** test@builder.dev
- **Password:** builder-test-1234
- **Name:** Test User

The test user is auto-created via the `/api/_dev/login` endpoint (dev-only).

## Test Scripts

### 1. Auth Flow: Dev Login → Dashboard → Settings → Sign Out

```
1. Navigate to http://localhost:3000/login
2. Verify the page has heading "Welcome back"
3. Click the button with aria-label "Sign in as test user"
4. Wait for navigation to /dashboard
5. Verify the page has heading containing "Welcome"
6. Click the sidebar link "Settings" in the main navigation
7. Wait for navigation to /dashboard/settings
8. Verify the page has heading "Settings"
9. Verify the profile card shows "Test User" and "test@builder.dev"
10. Click the button with aria-label "Sign out"
11. Wait for navigation to /
```

### 2. Auth Middleware: Protected Route Redirect

```
1. Navigate to http://localhost:3000/dashboard (unauthenticated)
2. Verify redirect to /login
3. Verify the page has heading "Welcome back"
```

### 3. Landing Page → Login Flow

```
1. Navigate to http://localhost:3000
2. Verify heading "Build faster with Builder"
3. Click the button with aria-label "Get started - go to login"
4. Wait for navigation to /login
5. Verify the page has heading "Welcome back"
```

### 4. Dashboard Navigation

```
1. Navigate to http://localhost:3000/login
2. Click the button with aria-label "Sign in as test user"
3. Wait for navigation to /dashboard
4. Verify main navigation has links: "Home", "Settings"
5. Click "Settings" in the main navigation
6. Verify URL is /dashboard/settings
7. Click "Home" in the main navigation
8. Verify URL is /dashboard
```

### 5. 404 Page

```
1. Navigate to http://localhost:3000/nonexistent-page
2. Verify the page shows "404"
3. Verify the page shows "Page not found"
4. Click the button with aria-label "Go to home page"
5. Wait for navigation to /
```

### 6. User Menu & Sign Out

```
1. Navigate to http://localhost:3000/login
2. Click the button with aria-label "Sign in as test user"
3. Wait for navigation to /dashboard
4. Click the button with aria-label "User menu"
5. Verify dropdown shows "Sign out" option
6. Click "Sign out"
7. Verify redirect to /
```

## Aria Label Reference

All interactive elements have aria-labels for reliable agent-browser targeting:

| Element | aria-label | Page |
|---------|-----------|------|
| Dev login button | "Sign in as test user" | /login |
| GitHub OAuth button | "Sign in with GitHub" | /login |
| Email input | "Email address" | /login |
| Magic link submit | "Send magic link" | /login |
| Sidebar | "Main sidebar" | dashboard layout |
| Main nav | "Main navigation" | dashboard layout |
| Secondary nav | "Secondary navigation" | dashboard layout |
| User menu button | "User menu" | dashboard layout |
| Sign out (settings) | "Sign out" | /dashboard/settings |
| Get started button | "Get started - go to login" | / (landing) |
| Dashboard button | "Go to dashboard" | / (landing) |
| Go home (404) | "Go to home page" | 404/error pages |
