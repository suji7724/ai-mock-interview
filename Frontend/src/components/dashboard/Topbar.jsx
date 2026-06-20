import {
    Bell,
    Search,
} from "lucide-react";

function Topbar() {
    return (
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10">

            {/* Left */}
            <div>

                <h1 className="text-4xl font-bold">
                    Dashboard
                </h1>

                <p className="text-slate-400 mt-2">
                    Track your interview preparation progress.
                </p>

            </div>

            {/* Right */}
            <div className="flex items-center gap-4 w-full md:w-auto">

                {/* Search */}
                <div className="flex items-center bg-slate-900 border border-slate-800 rounded-2xl px-4 py-3 w-full md:w-80">

                    <Search
                        className="text-slate-400"
                        size={20}
                    />

                    <input
                        type="text"
                        placeholder="Search..."
                        className="bg-transparent outline-none px-3 w-full text-white placeholder:text-slate-500"
                    />

                </div>

                {/* Notification */}
                <button className="bg-slate-900 border border-slate-800 p-4 rounded-2xl hover:border-indigo-500/40 transition">

                    <Bell size={20} />

                </button>

            </div>

        </div>
    );
}

export default Topbar;