import React from "react";

const FormAddDouble = ({
  htmlFor1,
  htmlFor2,
  label1,
  label2,
  type1,
  type2,
  id1,
  id2,
  name1,
  name2,
  placeholder1,
  placeholder2,
  onChange1,
  onChange2,
  onBlur1,
  onBlur2,
  children,
  onClick,
}) => {
  return (
    <div className="flex gap-5">
      <div className="max-w-xl w-full">
        <label htmlFor={htmlFor1} className="block text-sm font-medium mb-2">
          {label1}
        </label>
        <input
          type={type1}
          id={id1}
          name={name1}
          className="py-2.5 sm:py-3 px-4 block w-full border border-obito-grey rounded-lg sm:text-sm focus:border-blue-800 focus:ring-blue-800 disabled:opacity-50 disabled:pointer-events-none"
          placeholder={placeholder1}
          onChange={onChange1}
          onBlur={onBlur1}
        />
      </div>
      <div className="max-w-xl w-full">
        <label htmlFor={htmlFor2} className="block text-sm font-medium mb-2">
          {label2}
        </label>
        <div className="relative">
          <input
            type={type2}
            id={id2}
            name={name2}
            className="py-2.5 sm:py-3 px-4 block w-full border border-obito-grey rounded-lg sm:text-sm focus:border-blue-800 focus:ring-blue-800 disabled:opacity-50 disabled:pointer-events-none"
            placeholder={placeholder2}
            onChange={onChange2}
            onBlur={onBlur2}
          />
          <div className="cursor-pointer" onClick={onClick}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormAddDouble;
