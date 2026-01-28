# Security Implementation Report

This report details the security measures implemented to protect the "Ottica Milena" website. It explains the technologies used, how they work, and why they are recommended.

## 1. Dependency Management (Software Composition Analysis)

### What we did
We ran `npm audit fix` to automatically update vulnerable dependencies to safe versions.

### Why it's important
Modern web applications rely on hundreds of third-party packages. Vulnerabilities in these packages (e.g., Cross-Site Scripting (XSS) in `react-router`) can be exploited to attack the application.

### Recommendation
*   **Regular Audits**: Run `npm audit` before every deployment.
*   **Automated Tools**: Consider using tools like Dependabot or Renovate to automate dependency updates.

## 2. HTTP Security Headers

We have configured security headers for both Vercel (`vercel.json`) and Netlify (`public/_headers`). These headers instruct the browser on how to behave to prevent common attacks.

### Implemented Headers

#### `X-Content-Type-Options: nosniff`
*   **How it works**: Prevents the browser from trying to guess ("sniff") the MIME type of a file. It forces the browser to stick to the declared `Content-Type`.
*   **Why**: Can prevent attacks where a malicious user uploads a file (e.g., an image) that contains executable scripts, hoping the browser will execute it.

#### `X-Frame-Options: DENY`
*   **How it works**: Prevents the site from being displayed inside an `<iframe>`.
*   **Why**: Protects against **Clickjacking**. An attacker could load your site in a transparent iframe over a button on their malicious site, tricking users into clicking buttons on your site unknowingly.

#### `X-XSS-Protection: 1; mode=block`
*   **How it works**: Activates the browser's built-in XSS filter.
*   **Why**: Provides a fallback layer of protection for older browsers against Reflected XSS attacks. (Note: Modern browsers rely more on CSP).

#### `Referrer-Policy: strict-origin-when-cross-origin`
*   **How it works**: Controls how much information about the current page is sent to external sites when a user clicks a link.
*   **Why**: Protects user privacy. It ensures complete URLs (which might contain sensitive ID parameters) are not leaked to third-party sites.

#### `Permissions-Policy`
*   **How it works**: Explicitly disables browser features like camera, microphone, and geolocation.
*   **Why**: follow the "Principal of Least Privilege". If the site doesn't need these features, they should be disabled to reduce the attack surface.

## 3. Content Security Policy (CSP)

### What we did
We added a `<meta>` tag to `index.html` defining a Content Security Policy.

```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self' ...">
```

### How it works
CSP is an allowlist. It tells the browser EXACTLY which domains are allowed to load resources (scripts, simple images, styles, fonts). Any resource not on the list is blocked.

*   `default-src 'self'`: Only allow resources from our own domain by default.
*   `frame-src ... google.com ...`: Explicitly allow Google Maps iframes.

### Why it's recommended
CSP is the **gold standard** for preventing Cross-Site Scripting (XSS). Even if an attacker manages to inject a malicious script tag, the browser will refuse to execute it because it doesn't come from a trusted source.

## 4. Input Handling & Frontend Security

### Current State
*   **React**: React automatically escapes content in JSX, which effectively neutralizes most XSS attacks by default.
*   **Forms**: The contact form uses standard HTML5 validation (`required`, `type="email"`).

### Recommendations for Future Development
*   **Sanitization**: If you ever need to render raw HTML (using `dangerouslySetInnerHTML`), ALWAYS use a sanitization library like `DOMPurify` first.
*   **API Validation**: Remember that frontend validation is for User Experience (UX). The backend API must *always* validate data again, as frontend checks can be bypassed.

## 5. Security Policy Encapsulation

### What we did
Created `SECURITY.md`.

### Why
This file tells researchers and users how to responsibly report vulnerabilities. It establishes a professional protocol for handling security incidents.

---

**Summary:**
The application is now hardened against common web vulnerabilities. The combination of updated dependencies, strict HTTP headers, and a robust Content Security Policy provides a strong defense-in-depth strategy.
