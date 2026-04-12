type LoomEmbedProps = {
  embedUrl: string;
  title: string;
};

export default function LoomEmbed({ embedUrl, title }: LoomEmbedProps) {
  return (
    <div className="relative w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-900 shadow-sm aspect-video">
      <iframe
        src={embedUrl}
        title={title}
        className="absolute inset-0 h-full w-full"
        allowFullScreen
      />
    </div>
  );
}
