const Button = ({ title, onClick, disabled, full, loading, icon }) => {
  const classes = [
    "px-6 py-3 bg-pink-500 text-white text-sm font-semibold uppercase rounded-full relative flex items-center justify-center tracking-wide",
  ];
  if (full) classes.push("w-full");
  if (disabled) classes.push("opacity-70 pointer-events-none");
  if (loading) classes.push("opacity-70 pointer-events-none");
  return (
    <button onClick={onClick} className={classes.join(" ")}>
      {loading ? (
        <>
          <div
            style={{ borderTopColor: "transparent" }}
            className="absolute left-1/2 top-1/2 -m-2 w-4 h-4 rounded-full border-2 border-white animate-spin"
          />
          <span className="opacity-0">Loading...</span>
        </>
      ) : (
        <>
          {icon && (
            <img
              src={icon}
              alt="icon in button"
              className="w-5 h-5 inline-block mr-2"
            />
          )}
          <span>{title}</span>
        </>
      )}
    </button>
  );
};

export { Button };
