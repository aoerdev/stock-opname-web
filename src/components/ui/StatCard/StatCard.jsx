import "./StatCard.css";

const colors = {
  primary: "#32CD32",
  success: "#32CD32",
  warning: "#FFD700",
  danger: "#EF4444",
};

function StatCard({
  title,
  value,
  variant = "primary",
  icon = null,
}) {

  const color = colors[variant];

  return (
    <div className="stat-card">

      <div className="stat-header">

        <span className="stat-title">
          {title}
        </span>

        {icon && (
          <div
            className="stat-icon"
            style={{ backgroundColor: color }}
          >
            {icon}
          </div>
        )}

      </div>

      <h2
        className="stat-value"
        style={{ color }}
      >
        {value}
      </h2>

    </div>
  );
}

export default StatCard;