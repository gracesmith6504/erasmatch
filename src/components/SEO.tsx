import { Helmet } from "react-helmet-async";

type SEOProps = {
  title: string;
  description: string;
  path: string; // e.g. "/about" — used for canonical + og:url
  type?: "website" | "article" | "profile";
  image?: string;
  keywords?: string;
  noIndex?: boolean;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
};

const SITE_URL = "https://www.erasmatch.com";
const DEFAULT_IMAGE = `${SITE_URL}/erasmatch-og-img.png`;

/**
 * Per-route head tags. Overrides the sitewide defaults in index.html
 * for JS-executing crawlers (Google, Bing). Social-preview crawlers
 * still fall back to index.html.
 */
export const SEO = ({
  title,
  description,
  path,
  type = "website",
  image,
  keywords,
  noIndex = false,
  jsonLd,
}: SEOProps) => {
  const url = `${SITE_URL}${path}`;
  const ogImage = image || DEFAULT_IMAGE;
  const schemas = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={url} />
      <meta
        name="robots"
        content={
          noIndex
            ? "noindex, nofollow"
            : "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
        }
      />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:locale" content="en_US" />
      <meta property="og:site_name" content="ErasMatch" />
      <meta property="og:image" content={ogImage} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      {schemas.map((schema, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
};
