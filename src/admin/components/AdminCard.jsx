/** Card sederhana untuk admin panel */
const AdminCard = ({ children, className = '', title, action }) => (
  <div className={`bg-white rounded-xl border border-gray-200 shadow-sm ${className}`}>
    {(title || action) && (
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
        {title && <h3 className="font-heading font-semibold text-gray-800 text-sm">{title}</h3>}
        {action}
      </div>
    )}
    <div className="p-5">{children}</div>
  </div>
);

export default AdminCard;
