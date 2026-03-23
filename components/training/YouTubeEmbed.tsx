"use client";

type YouTubeEmbedProps = {
  title: string;
  videoId?: string;
  className?: string;
};

function isValidVideoId(videoId?: string) {
  return Boolean(videoId && /^[a-zA-Z0-9_-]{11}$/.test(videoId));
}

export default function YouTubeEmbed({
  title,
  videoId,
  className = "",
}: YouTubeEmbedProps) {
  if (!isValidVideoId(videoId)) {
    return (
      <div
        className={`rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 ${className}`}
      >
        <p className="text-sm font-semibold text-slate-900">{title}</p>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          Replace this placeholder with a real YouTube video ID to embed the lesson
          recording or intro video for this module.
        </p>
      </div>
    );
  }

  return (
    <div className={`overflow-hidden rounded-2xl border border-slate-200 bg-slate-950 shadow-sm ${className}`}>
      <div className="aspect-video">
        <iframe
          className="h-full w-full"
          src={`https://www.youtube.com/embed/${videoId}`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
    </div>
  );
}
