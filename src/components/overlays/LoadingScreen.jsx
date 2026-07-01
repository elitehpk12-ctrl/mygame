export default function LoadingScreen({ label = 'Loading the archipelago...' }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-black text-white">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-gold/30 border-t-gold" />
      <p className="text-xs tracking-widest text-white/60">{label}</p>
    </div>
  );
}
