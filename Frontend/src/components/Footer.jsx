import { BrainCircuit } from "lucide-react";
import { useState } from "react";
import ContactModal from "./ContactModal";
import HelpCenterModal from "./HelpCenterModal";

function Footer() {
  // contact state
  const [showContact, setShowContact] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  return (
    <footer className="px-8 pt-24 pb-10 border-t border-slate-800">
      <div className="max-w-7xl mx-auto">
        {/* Top Footer */}
        <div className="grid md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <BrainCircuit className="text-indigo-500" size={32} />

              <h1 className="text-2xl font-bold">
                BitWise
                <span className="text-indigo-500">Prep</span>
              </h1>
            </div>

            <p className="text-slate-400 mt-6 leading-relaxed max-w-md">
              AI-powered mock interview platform designed to help students and
              professionals prepare smarter and perform confidently in real
              interviews.
            </p>

            {/* Social Icons */}
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Quick Links</h3>

            <ul className="space-y-4 text-slate-400">
              <li>
                <a href="#" className="hover:text-white transition">
                  Home
                </a>
              </li>

              <li>
                <a href="/dashboard" className="hover:text-white transition">
                  dashboard
                </a>
              </li>

              <li>
                <button
                  onClick={() => setShowContact(true)}
                  className="hover:text-indigo-400 transition"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Resources</h3>

            <ul className="space-y-4 text-slate-400">
              <li>
                <a href="#" className="hover:text-white transition">
                  Privacy Policy
                </a>
              </li>

              <li>
                <a href="#" className="hover:text-white transition">
                  Terms & Conditions
                </a>
              </li>

              <li>
                <button
                  onClick={() => setShowHelp(true)}
                  className="hover:text-white transition text-left"
                >
                  Help Center & support
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-slate-800 mt-16 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">
            © 2026 BitWisePrep. All rights reserved.
          </p>

          <p className="text-slate-500 text-sm">
            Built with React, Tailwind CSS & AI
          </p>
        </div>
      </div>

      {showContact && <ContactModal onClose={() => setShowContact(false)} />}
      {showHelp && <HelpCenterModal onClose={() => setShowHelp(false)} />}
    </footer>
  );
}

export default Footer;
