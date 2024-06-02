import Icon from "@mdi/react";

function IconButton({
  path,
  size,
  onClick,
  color = "bg-main",
  loading = false,
  className,
}) {
  return (
    <div
      className={
        "text-white rounded py-1 px-2 cursor-pointer text-sm content-center select-none opacity-80 hover:opacity-100 " +
        color +
        " " +
        (loading ? "opacity-50" : "") +
        " " +
        className
      }
      onClick={() => (onClick && !loading ? onClick() : null)}
    >
      <Icon path={path} size={size} className="text-sm" />
    </div>
  );
}

export default IconButton;
