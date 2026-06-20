import {
    LayoutDashboard,
    PlayCircle,
    History,
    BarChart3,
    FileText,
    LogOut,
    BrainCircuit,
} from "lucide-react";
import { useNavigate, useLocation, Link } from "react-router-dom";

function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();

    const userString = localStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : null;
    const initial = user?.email ? user.email.charAt(0).toUpperCase() : "U";
    
    const fullName = user?.first_name 
        ? `${user.first_name} ${user.last_name || ""}`.trim() 
        : (user?.username || user?.email?.split('@')[0] || "User");

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        navigate("/login");
    };

    const handleScroll = (id) => {
        if (location.pathname !== "/dashboard") {
            navigate("/dashboard");
            setTimeout(() => {
                const element = document.getElementById(id);
                if (element) {
                    element.scrollIntoView({ behavior: "smooth" });
                }
            }, 150);
        } else {
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({ behavior: "smooth" });
            }
        }
    };

    const menuItems = [
        {
            icon: LayoutDashboard,
            title: "Dashboard",
            path: "/dashboard",
        },
        {
            icon: PlayCircle,
            title: "Start Interview",
            path: "/interview-setup",
        },
        {
            icon: FileText,
            title: "Resume Analyzer",
            path: "/resume-analyzer",
        },
        {
            icon: History,
            title: "Interview History",
            action: () => handleScroll("recent-interviews"),
        },
        {
            icon: BarChart3,
            title: "Analytics",
            action: () => handleScroll("dashboard-stats"),
        },
    ];

    return (
        <aside className="w-72 min-h-screen bg-slate-900/60 border-r border-slate-800/80 p-6 flex flex-col justify-between backdrop-blur-md">

            {/* Top */}
            <div>

                {/* Logo */}
                <div className="mb-10 flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-indigo-600/10 border border-indigo-500/20">
                        <BrainCircuit className="text-indigo-400" size={22} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-white">
                            BitWise<span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent font-extrabold ml-0.5">Prep</span>
                        </h1>
                        <p className="text-[10px] text-slate-500 font-medium tracking-wider uppercase mt-0.5">
                            AI INTERVIEW PREP
                        </p>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="space-y-2">
                    {menuItems.map((item, index) => {
                        const Icon = item.icon;
                        const active = item.path ? location.pathname === item.path : false;

                        if (item.path) {
                            return (
                                <Link
                                    key={index}
                                    to={item.path}
                                    className={`
                                        w-full
                                        flex
                                        items-center
                                        gap-4
                                        px-5
                                        py-3.5
                                        rounded-xl
                                        transition
                                        duration-200
                                        ${active
                                            ? "bg-indigo-600/15 text-indigo-400 border border-indigo-500/20 font-semibold shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]"
                                            : "text-slate-400 hover:bg-slate-800/50 hover:text-white border border-transparent"
                                        }
                                    `}
                                >
                                    <Icon size={20} className={active ? "text-indigo-400" : "text-slate-500"} />
                                    <span className="text-sm font-medium">
                                        {item.title}
                                    </span>
                                </Link>
                            );
                        } else {
                            return (
                                <button
                                    key={index}
                                    onClick={item.action}
                                    className="
                                        w-full
                                        flex
                                        items-center
                                        gap-4
                                        px-5
                                        py-3.5
                                        rounded-xl
                                        transition
                                        duration-200
                                        text-slate-400 hover:bg-slate-800/50 hover:text-white
                                        border border-transparent
                                        cursor-pointer
                                        text-left
                                    "
                                >
                                    <Icon size={20} className="text-slate-500" />
                                    <span className="text-sm font-medium">
                                        {item.title}
                                    </span>
                                </button>
                            );
                        }
                    })}
                </nav>

            </div>

            {/* Bottom User Card */}
            <div className="bg-slate-950/40 border border-slate-800/80 rounded-2xl p-4.5 backdrop-blur-md">

                <div className="flex items-center gap-3">

                    {/* Avatar */}
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white text-base font-bold shadow-[0_0_15px_rgba(99,102,241,0.25)] border border-indigo-400/20">
                        {initial}
                    </div>

                    {/* User Info */}
                    <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-sm text-slate-100 truncate">
                            {fullName}
                        </h3>

                        <p className="text-slate-500 text-xs truncate mt-0.5">
                            {user?.email}
                        </p>
                    </div>

                </div>

                {/* Logout */}
                <button 
                    onClick={handleLogout} 
                    className="
                        mt-4 w-full flex items-center justify-center gap-2 
                        bg-slate-900 border border-slate-800 hover:border-red-500/20 
                        hover:bg-red-500/5 hover:text-red-400 text-slate-400 
                        py-2.5 rounded-xl transition duration-200 text-xs font-semibold
                        cursor-pointer
                    "
                >
                    <LogOut size={14} />
                    Log Out
                </button>

            </div>

        </aside>
    );
}

export default Sidebar;