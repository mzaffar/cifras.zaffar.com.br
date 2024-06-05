function Modal({ children, title }) {
  return (
    <div className="absolute top-0 bottom-0 bg-black/90 w-full h-full p-4 z-20">
      <div className="container mx-auto  max-w-sm">
        {title && (
          <div className="bg-slate-800 text-slate-400 p-2 rounded-t">
            {title}
          </div>
        )}
        <div className="bg-slate-600 rounded-b">{children}</div>
      </div>
    </div>
  );
}

export default Modal;
