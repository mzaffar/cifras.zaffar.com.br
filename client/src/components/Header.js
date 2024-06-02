function Header({ children }) {
  return (
    <div className="bg-main w-full p-2 content-center">
      <div className="container mx-auto text-slate-300 flex  content-center">
        <div className="grow font-bold content-center">Musicas</div>
        <div className="flex space-x-2 content-center">{children}</div>
      </div>
    </div>
  );
}

export default Header;
