'use client';

import { useState } from 'react';
import { Play } from 'lucide-react';

/**
 * A YouTube video shown as its thumbnail with a play button.
 * The player loads only when someone clicks, so the page stays fast.
 */
export function YouTube({ id, title, caption }: { id: string; title: string; caption?: string }) {
  const [playing, setPlaying] = useState(false);

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
              src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
              alt=""
              loading="lazy"
              decoding="async"
              onError={(e) => {
                e.currentTarget.style.visibility = 'hidden';
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
