import React, { Children } from "react";

const InputForm = ({
  htmlFor,
  label,
  type,
  id,
  name,
  placeholder,
  onChange,
  onBlur,
  children,
}) => {
  return (
    <div className="max-w-md">
      <label htmlFor={htmlFor} className="block text-sm font-medium mb-2">
        {label}
      </label>
      <div className="relative">
        <input
          type={type}
          id={id}
          name={name}
          className="py-2.5 sm:py-3 px-10 block w-full border border-obito-grey rounded-lg sm:text-sm font-medium focus:border-blue-900 focus:ring-blue-900 disabled:opacity-50 disabled:pointer-events-none"
          placeholder={placeholder}
          onChange={onChange}
          onBlur={onBlur}
        />
        {children}
      </div>
    </div>
  );
};

export default InputForm;
