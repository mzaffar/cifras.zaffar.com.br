function Title({ children, title }) {
  return (
    <div className="bg-slate-800">
      <div className="container mx-auto">
        <div className="flex text-xl py-2 px-2 md:px-0">
          <div className="grow text-slate-400">{title}</div>
          {children}
        </div>
      </div>
    </div>
  );
}

export default Title;
