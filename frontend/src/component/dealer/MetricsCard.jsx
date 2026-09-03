const MetricsCard = ({
  title,
  value,
  subtitle,
  icon,
  color = "gray"
}) => {
  const colorMap = {
    gray: "bg-gray-100 text-gray-700",
    blue: "bg-blue-100 text-blue-700",
    green: "bg-green-100 text-green-700",
    emerald: "bg-emerald-100 text-emerald-700",
    yellow: "bg-yellow-100 text-yellow-700",
    purple: "bg-purple-100 text-purple-700"
  };

  return (
    <div className="bg-white border rounded-xl p-6 shadow-sm hover:shadow-md transition">

      <div className="flex items-center justify-between">
        {/* TEXT */}
        <div>
          <p className="text-sm text-gray-500">
            {title}
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-1">
            {value}
          </h2>

          {subtitle && (
            <p className="text-xs text-gray-400 mt-1">
              {subtitle}
            </p>
          )}
        </div>

        {/* ICON */}
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${colorMap[color]}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};

export default MetricsCard;
