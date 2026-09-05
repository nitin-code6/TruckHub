const AnalyticsChart = ({ title, value, unit }) => {
  return (
    <div className="bg-white p-5 rounded shadow">
      <p className="text-sm text-gray-500">{title}</p>
      <h2 className="text-3xl font-bold mt-2">
        {value}
        <span className="text-base font-medium ml-1">{unit}</span>
      </h2>
    </div>
  );
};

export default AnalyticsChart;
