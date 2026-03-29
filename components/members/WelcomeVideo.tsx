type WelcomeVideoProps = {
  youtubeVideoId?: string;
};

export default function WelcomeVideo({ youtubeVideoId }: WelcomeVideoProps) {
  if (!youtubeVideoId) {
    return null;
  }

  return (
    <div className="rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm max-w-sm">
      <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
        <iframe
          src={`https://www.youtube.com/embed/${youtubeVideoId}`}
          title="Welcome to AI with Michal"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      </div>
      <div className="px-4 py-3">
        <p className="text-xs text-slate-500 font-medium">Welcome message from Michal</p>
      </div>
    </div>
  );
}
