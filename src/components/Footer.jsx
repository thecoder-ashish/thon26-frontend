import React from "react";

export function Footer() {
  return (
    <footer className="w-full py-6 border-t border-border/40 mt-auto text-center text-xs sm:text-sm font-raleway text-muted-foreground">
      <div className="container flex flex-wrap items-center justify-center gap-1.5 px-4 mx-auto">
        <a
          href="https://crosslinksnsut.in"
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold hover:text-foreground transition-colors hover:underline"
        >
          Crosslinks
        </a>
        <span>© 2026 • Enhanced with ❤️ by</span>
        <a
          href="https://www.linkedin.com/in/ashish-kumar-103587378?utm_source=share_via&utm_content=profile&utm_medium=member_android"
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold text-foreground hover:text-primary transition-colors hover:underline"
        >
          Ashish
        </a>
      </div>
    </footer>
  );
}

export default Footer;
