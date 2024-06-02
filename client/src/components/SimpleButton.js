function SimpleButton({
  label,
  onClick,
  color = "bg-main",
  loading = false,
  className = "",
}) {
  return (
    <div
      className={
        "text-white rounded py-1 px-4 cursor-pointer text-sm content-center select-none opacity-80  " +
        color +
        " " +
        className +
        " " +
        (loading ? "opacity-40" : "hover:opacity-100")
      }
      onClick={() => (onClick && !loading ? onClick() : null)}
    >
      {!loading ? label : "Carregando..."}
    </div>
  );
}

export default SimpleButton;
