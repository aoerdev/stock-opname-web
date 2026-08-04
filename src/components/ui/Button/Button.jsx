import "./Button.css";

function Button({
  children,
  variant = "primary",
  type = "button",
  ...props
}) {
  return (
    <button
      className={`btn ${variant}`}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;