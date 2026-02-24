/** Badge status published / draft */
const StatusBadge = ({ published }) =>
  published ? (
    <span className="inline-flex items-center gap-1 text-xs font-medium bg-green-50 text-green-700 px-2.5 py-0.5 rounded-full">
      <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
      Tayang
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 text-xs font-medium bg-yellow-50 text-yellow-700 px-2.5 py-0.5 rounded-full">
      <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full" />
      Draft
    </span>
  );

export default StatusBadge;
