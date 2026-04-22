const SITE_URL =
  process.env.NEXT_PUBLIC_SERVER_URL ||
  process.env.VERCEL_PROJECT_PRODUCTION_URL ||
  'https://example.com'

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: SITE_URL,
  // Root `/robots.txt` and `/sitemap.xml` (index) are served by Next.js App Router — see `src/app/robots.ts` and `src/app/sitemap.xml/route.ts`.
  generateRobotsTxt: false,
  exclude: ['/posts-sitemap.xml', '/pages-sitemap.xml', '/*', '/posts/*'],
  robotsTxtOptions: {
    additionalSitemaps: [
      `${SITE_URL}/sitemap.xml`,
      `${SITE_URL}/en/pages-sitemap.xml`,
      `${SITE_URL}/en/posts-sitemap.xml`,
    ],
  },
}
