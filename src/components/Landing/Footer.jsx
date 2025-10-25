const Footer = () => (
  <footer className="bg-gradient-to-br from-slate-900 to-blue-900/30 border-t border-white/10">
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
      <div className="grid lg:grid-cols-4 gap-12">
        {/* Brand */}
        <div className="lg:col-span-2">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-black text-xl">NIL</span>
            </div>
            <span className="text-2xl font-black text-white">NILBx</span>
          </div>
          <p className="text-blue-200 mb-8 max-w-md leading-relaxed">
            The premier platform connecting student-athletes with brands and sponsors.
            Unlock your earning potential while maintaining academic excellence.
          </p>
          <div className="flex space-x-4">
            {["twitter", "instagram", "linkedin", "youtube"].map((social) => (
              <a
                key={social}
                href="#"
                className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center text-blue-300 hover:bg-blue-500/20 hover:text-white transition-all duration-300 hover:scale-110"
              >
                <span className="text-lg">📱</span>
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-bold text-white mb-6">Platform</h3>
          <ul className="space-y-4">
            {[
              { label: "For Athletes", href: "/sports" },
              { label: "For Creators", href: "/creator" },
              { label: "For Brands", href: "/brand" },
              { label: "For Agencies", href: "/agency" }
            ].map((link) => (
              <li key={link.label}>
                <a href={link.href} className="text-blue-200 hover:text-blue-400 transition-colors duration-300">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-lg font-bold text-white mb-6">Support</h3>
          <ul className="space-y-4">
            {["Help Center", "Contact Us", "Privacy Policy", "Terms of Service"].map((link) => (
              <li key={link}>
                <a href="#" className="text-blue-200 hover:text-blue-400 transition-colors duration-300">
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
        <p className="text-blue-300 text-sm">
          © 2024 NILBx. All rights reserved. Built for the future of student-athlete monetization.
        </p>
        <div className="flex items-center space-x-6 mt-4 md:mt-0">
          <span className="text-blue-400 text-sm font-medium">🚀 Made with ❤️ for athletes</span>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;