import { useMemo } from "react";

function buildWebpSource(src) {
  if (!src) return "";

  if (src.includes("images.unsplash.com")) {
    try {
      const url = new URL(src);
      url.searchParams.set("fm", "webp");
      return url.toString();
    } catch {
      return "";
    }
  }

  if (/\.(jpe?g|png)(\?.*)?$/i.test(src)) {
    return src.replace(/\.(jpe?g|png)(\?.*)?$/i, ".webp$2");
  }

  return "";
}

export default function SmartImage({
  src,
  alt,
  className = "",
  fallbackSrc,
  loading = "lazy",
  decoding = "async",
  ...props
}) {
  const webpSrc = useMemo(() => buildWebpSource(src), [src]);
  const resolvedFallback = fallbackSrc || src;

  if (!src) return null;

  return (
    <picture>
      {webpSrc ? <source srcSet={webpSrc} type="image/webp" /> : null}
      <img
        src={resolvedFallback}
        alt={alt}
        className={className}
        loading={loading}
        decoding={decoding}
        {...props}
      />
    </picture>
  );
}
