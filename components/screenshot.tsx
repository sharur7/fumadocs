/**
 * A product screenshot in a quiet frame, with an optional caption.
 * Images live in /public/images and are pre-sized to 1600px wide.
 */
export function Screenshot({ src, alt, caption }: { src: string; alt: string; caption?: string }) {
  return (
    <figure className="nx-shot not-prose">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} width={1600} height={1000} loading="lazy" decoding="async" />
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}
