function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 md:flex-row">
        <div>
          <h2 className="text-2xl font-bold text-white">
            Rakshak India
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            AI Powered Emergency Response & Public Safety Platform
          </p>
        </div>

        <div className="text-sm text-slate-500">
          © 2026 Rakshak India. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;