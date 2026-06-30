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
    <div>
      <label
        htmlFor={htmlFor}
        className="block text-sm font-semibold text-on-surface mb-2"
      >
        {label}
      </label>
      <div className="relative">
        <input
          type={type}
          id={id}
          name={name}
          className="block w-full pl-10 pr-3 py-3 border border-outline-variant rounded-lg bg-surface-container-lowest text-on-surface placeholder-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-sm"
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
