export default function SkeletonCard() {
  return (
    <div className="card p-6 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 bg-secondary-200 rounded-xl" />
        <div className="w-16 h-4 bg-secondary-200 rounded-full" />
      </div>
      <div className="w-24 h-3 bg-secondary-200 rounded mb-2" />
      <div className="w-16 h-8 bg-secondary-200 rounded" />
      <div className="w-full h-1 bg-secondary-200 rounded-full mt-4" />
    </div>
  );
}
