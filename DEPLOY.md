# Deploying

The site is a Next.js 16 app with a middleware proxy that sets a nonce based
Content Security Policy, and one API route. That combination needs a host that
runs Node, which means Vercel, Netlify, or a container. It cannot go on GitHub
Pages as it stands, because Pages only serves static files.

## The short version

1. Push this repository to GitHub.
2. On vercel.com, choose **Add New**, then **Project**, and import the repository.
3. Vercel detects Next.js and pnpm. Leave the build command alone.
4. Add the environment variables from the table below.
5. Deploy.

No `vercel.json` is needed. `pnpm-workspace.yaml` is committed and sets
`nodeLinker: hoisted`, which Vercel's pnpm installer honours, and `package.json`
declares the Node range.

## Environment variables

Set these in the host's dashboard, not in the repository. `.env.local` is
gitignored on purpose, so a key committed there would not be deployed anyway.

| Variable | Needed for | If it is missing |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical URLs, `sitemap.xml`, `robots.txt` | **The sitemap advertises `http://localhost:3000`**, which tells search engines the wrong canonical URL. Set this to the real origin, with no trailing slash. |
| `RESEND_API_KEY` | Sending contact form mail | The contact route returns a labelled development response instead of sending. A visitor's message reaches nobody. |
| `CONTACT_TO_EMAIL` | Where the form delivers | Falls back to the address in the source. |
| `CONTACT_FROM_EMAIL` | The verified sender | Resend rejects the send unless the sending domain is verified. |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Rendering the Turnstile widget | The widget does not render at all. This value is public by design. |
| `TURNSTILE_SECRET_KEY` | Enforcing the widget | `src/app/api/contact/route.ts` skips verification entirely, so bot protection does nothing. |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | Cookieless analytics | No analytics is loaded. |

### Turnstile needs one more step

A Turnstile site key only works on the hostnames listed against it in the
Cloudflare dashboard. Add the deployment domain there, and add `127.0.0.1` too if
you want the widget to render during local development. Without that, Cloudflare
answers the challenge platform with HTTP 400 and no widget appears.

## After the first deploy

- Visit `/sitemap.xml` and confirm the URLs show the real domain and not
  `localhost`.
- Submit the contact form once, from the deployed site, and confirm the mail
  arrives. This is the one feature whose failure is silent.
- Check the security headers are present:

  ```
  curl -sI https://your-domain | findstr /i "content-security-policy strict-transport"
  ```

## What is deliberately absent

`output: "export"` is not set. Setting it would produce a static site that could
be hosted anywhere for free, but it would remove the nonce Content Security Policy
and the contact API route, which are two of the things this build is for.
