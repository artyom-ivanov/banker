const Input = ({ title, placeholder, onChange, value, error, type, name }) => {
  const labelClasses = ["ml-1 text-sm font-medium mb-2 text-gray-600"];
  if (error) labelClasses.push("text-red-500");

  const classes = ["w-full px-3 py-2 text-base border rounded-lg"];
  if (error) classes.push("border-red-500");
  return (
    <div className="flex flex-col mb-4">
      <label className={labelClasses.join(" ")}>{title}</label>
      <input
        name={name}
        pattern={type === "number" ? "[0-9]" : undefined}
        placeholder={placeholder || ""}
        type={type}
        className={classes.join(" ")}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export { Input };
