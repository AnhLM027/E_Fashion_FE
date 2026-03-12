import React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      icon,
      iconPosition = "left",
      className = "",
      ...props
    },
    ref,
  ) => {
    const hasError = Boolean(error);

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label className="text-sm font-medium text-gray-900">{label}</label>
        )}

        <div className="relative w-full">
          {icon && (
            <span
              className={`absolute top-1/2 -translate-y-1/2 text-gray-500 ${
                iconPosition === "left" ? "left-3" : "right-3"
              }`}
            >
              {icon}
            </span>
          )}

          <input
            ref={ref}
            className={`
              w-full px-4 py-3 text-sm rounded-xl
              border transition-all duration-200
              bg-white
              ${hasError ? "border-red-500 focus:border-red-500" : "border-black focus:border-2 focus:border-black"}
              focus:outline-none
              disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500
              ${icon && iconPosition === "left" ? "pl-10" : ""}
              ${icon && iconPosition === "right" ? "pr-10" : ""}
              ${className}
            `.trim()}
            {...props}
          />
        </div>

        {error && <span className="text-sm text-red-500">{error}</span>}

        {helperText && !error && (
          <span className="text-sm text-gray-500">{helperText}</span>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
