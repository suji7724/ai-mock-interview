import { BrainCircuit, LogOut, User, FileText, Sparkles, Menu, X, Home, LayoutDashboard } from "lucide-react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const dropdownRef = useRef(null);

    const userString = localStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : null;
    const initial = user?.email ? user.email.charAt(0).toUpperCase() : "U";

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        navigate("/login");
    };

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Check active link helper
    const isActive = (path) => location.pathname === path;

    const navLinks = [
        { name: "Home", path: "/", icon: Home },
        { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
        { name: "Resume Analyzer", path: "/resume-analyzer", icon: FileText },
    ];

    return (
        <header className={`
            sticky top-0 z-50 w-full transition-all duration-300
            ${scrolled 
                ? "py-3 px-4 md:px-8 bg-slate-950/30 backdrop-blur-sm" 
                : "py-5 px-6 md:px-12 bg-transparent"
            }
        `}>
            <div className={`
                mx-auto max-w-7xl rounded-2xl border transition-all duration-300 flex flex-col
                ${scrolled 
                    ? "bg-slate-950/85 border-slate-900/90 shadow-[0_12px_45px_-12px_rgba(0,0,0,0.8)] px-6 py-2.5" 
                    : "bg-slate-950/50 border-white/[0.04] px-6 py-3.5"
                }
            `}>
                <div className="flex items-center justify-between w-full">
                    
                    {/* BRAND LOGO */}
                    <Link to="/" className="flex items-center gap-2.5 cursor-pointer group">
                        <div className="relative p-2 rounded-xl bg-indigo-600/10 border border-indigo-500/20 group-hover:bg-indigo-600/20 group-hover:border-indigo-500/40 group-hover:shadow-[0_0_15px_rgba(99,102,241,0.2)] transition-all duration-300">
                            <BrainCircuit className="text-indigo-400 group-hover:rotate-12 transition-transform duration-300" size={22} />
                            <span className="absolute inset-0 rounded-xl bg-indigo-500/20 blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                        </div>
                        <span className="text-lg font-semibold tracking-tight text-white transition-all duration-300 group-hover:text-indigo-100">
                            BitWise<span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent font-extrabold ml-0.5">Prep</span>
                        </span>
                    </Link>

                    {/* CENTRAL NAVIGATION (DESKTOP) */}
                    <div className="hidden md:flex items-center gap-1.5 bg-slate-900/20 p-1 rounded-xl border border-white/[0.02]">
                        {navLinks.map((link) => {
                            const Icon = link.icon;
                            const active = isActive(link.path);
                            return (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className={`
                                        relative flex items-center gap-2
                                        px-4 py-2 rounded-xl text-sm font-medium
                                        transition-all duration-300
                                        ${active 
                                            ? "text-white" 
                                            : "text-slate-400 hover:text-white"
                                        }
                                    `}
                                >
                                    {active && (
                                        <motion.span
                                            layoutId="active-nav-pill"
                                            className="absolute inset-0 bg-indigo-500/10 border border-indigo-500/20 rounded-xl z-0"
                                            transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                        />
                                    )}
                                    <Icon size={14} className={`relative z-10 transition-colors duration-300 ${active ? "text-indigo-400" : "text-slate-500"}`} />
                                    <span className="relative z-10">{link.name}</span>
                                </Link>
                            );
                        })}
                    </div>

                    {/* RIGHT ACTIONS */}
                    <div className="flex items-center gap-4">
                        {/* Glowing CTA Button */}
                        <button
                            onClick={() => navigate("/interview-setup")}
                            className="
                                hidden sm:flex items-center gap-2
                                relative overflow-hidden
                                bg-gradient-to-r from-indigo-500 to-purple-600
                                hover:from-indigo-600 hover:to-purple-700
                                text-white text-sm font-semibold
                                px-4.5 py-2.5 rounded-xl
                                shadow-[0_4px_12px_rgba(99,102,241,0.25)]
                                hover:shadow-[0_4px_20px_rgba(99,102,241,0.45)]
                                hover:-translate-y-0.5 active:translate-y-0
                                transition-all duration-200
                                cursor-pointer group
                            "
                        >
                            <span className="absolute inset-0 bg-white/10 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300" />
                            <Sparkles size={14} className="group-hover:rotate-12 transition-transform duration-300 text-indigo-200" />
                            <span className="relative z-10">Start Interview</span>
                        </button>

                        {/* Profile Dropdown Container */}
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className="
                                    flex items-center justify-center
                                    w-9 h-9
                                    rounded-full
                                    bg-gradient-to-tr from-indigo-500 to-purple-600
                                    text-white text-sm font-bold
                                    border border-indigo-400/30
                                    hover:shadow-[0_0_15px_rgba(99,102,241,0.4)]
                                    hover:scale-105
                                    transition-all duration-300
                                    cursor-pointer
                                "
                            >
                                {initial}
                            </button>

                            <AnimatePresence>
                                {isOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        transition={{ duration: 0.15, ease: "easeOut" }}
                                        className="absolute right-0 mt-3 w-56 rounded-2xl border border-slate-900 bg-slate-950/95 p-2 backdrop-blur-xl shadow-2xl z-50 flex flex-col gap-0.5"
                                    >
                                        <div className="px-3 py-2.5 text-xs font-semibold text-slate-400 border-b border-slate-900/60 pb-2.5 mb-1">
                                            <p className="text-slate-500 font-normal">Signed in as</p>
                                            <p className="text-slate-200 truncate font-medium mt-0.5">{user?.email}</p>
                                        </div>
                                        {navLinks.map((link) => {
                                            const Icon = link.icon;
                                            return (
                                                <Link
                                                    key={link.name}
                                                    to={link.path}
                                                    onClick={() => setIsOpen(false)}
                                                    className="flex items-center gap-2.5 p-2.5 text-sm text-slate-300 hover:text-white hover:bg-slate-900/60 rounded-xl transition duration-150"
                                                >
                                                    <Icon size={15} className="text-slate-500" />
                                                    {link.name}
                                                </Link>
                                            );
                                        })}
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center gap-2.5 p-2.5 text-sm text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition duration-150 text-left w-full cursor-pointer mt-1 border-t border-slate-900/60 pt-2"
                                        >
                                            <LogOut size={15} />
                                            Log Out
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Mobile Hamburger Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 md:hidden text-slate-400 hover:text-white transition duration-200 cursor-pointer"
                        >
                            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>

                {/* MOBILE DROPDOWN DRAWER */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="md:hidden overflow-hidden w-full"
                        >
                            <div className="mt-3 pt-4 border-t border-slate-900/60 flex flex-col gap-2 pb-2">
                                {navLinks.map((link) => {
                                    const Icon = link.icon;
                                    const active = isActive(link.path);
                                    return (
                                        <Link
                                            key={link.name}
                                            to={link.path}
                                            onClick={() => setMobileMenuOpen(false)}
                                            className={`
                                                flex items-center gap-3
                                                px-4 py-3 rounded-xl text-sm font-medium
                                                transition-all duration-200
                                                ${active 
                                                    ? "text-indigo-400 bg-indigo-500/10 border border-indigo-500/10" 
                                                    : "text-slate-400 hover:text-white hover:bg-slate-900/60"
                                                }
                                            `}
                                        >
                                            <Icon size={16} />
                                            {link.name}
                                        </Link>
                                    );
                                })}
                                <button
                                    onClick={() => {
                                        setMobileMenuOpen(false);
                                        navigate("/interview-setup");
                                    }}
                                    className="
                                        flex items-center justify-center gap-2
                                        bg-gradient-to-r from-indigo-500 to-purple-600
                                        text-white text-sm font-semibold
                                        py-3.5 rounded-xl mt-2
                                        shadow-md shadow-indigo-500/10
                                        cursor-pointer
                                    "
                                >
                                    <Sparkles size={15} />
                                    Start Interview
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </header>
    );
}

export default Navbar;