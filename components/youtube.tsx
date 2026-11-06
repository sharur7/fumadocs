'use client';

import { useState } from 'react';
import { Play } from 'lucide-react';

/**
 * Thumbnail candidates, best first. hqdefault (480x360) is a 4:3 image with
 * black bars baked in; cropping it to 16:9 upscales it and looks blurry.
 * maxresdefault / hq720 are native 16:9 and 1280px wide.
 */
const THUMBS = ['maxresdefault', 'hq720', 'sddefault', 'hqdefault'];

/**
 * A YouTube video shown as its thumbnail with a play button.
 * The player loads only when someone clicks, so the page stays fast.
 */
export function YouTube({ id, title, caption }: { id: string; title: string; caption?: string }) {
  const [playing, setPlaying] = useState(false);
  const [thumb, setThumb] = useState(0);

  return (
    <figure className="nx-video not-prose">
      <div className="nx-video-frame">
        {playing ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        ) : (
          <button type="button" className="nx-video-poster" onClick={() => setPlaying(true)} aria-label={`Play video: ${title}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={thumb}
              src={`https://i.ytimg.com/vi/${id}/${THUMBS[thumb]}.jpg`}
              alt=""
              width={1280}
              height={720}
              loading="lazy"
              decoding="async"
              onLoad={(e) => {
                // YouTube answers a missing maxres with a tiny 120x90 placeholder.
                if (e.currentTarget.naturalWidth <= 120 && thumb < THUMBS.length - 1) setThumb(thumb + 1);
              }}
              onError={() => {
                if (thumb < THUMBS.length - 1) setThumb(thumb + 1);
              }}
            />
            <span className="nx-video-play" aria-hidden="true">
              <Play />
            </span>
            <span className="nx-video-title">{title}</span>
          </button>
        )}
      </div>
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}
