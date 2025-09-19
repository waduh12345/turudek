import clsx from "clsx";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({ children, className, ...props }) => {
  return (
    <button
      className={clsx(
        "px-4 sm:px-6 py-2 sm:py-2.5 font-mono rounded bg-accent hover:bg-[#04b86a] transition-colors",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
