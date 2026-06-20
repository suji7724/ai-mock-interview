import {
  FileQuestion,
  Trophy,
  ClipboardCheck,
  Brain,
} from "lucide-react";

function StatsCards({ dashboardData }) {

  const stats = [
    {
      title: "Interviews Taken",
      value: dashboardData?.total_interviews || 0,
      icon: FileQuestion,
      color: "from-indigo-500 to-indigo-700",
    },

    {
      title: "Average Score",
      value: `${dashboardData?.average_score || 0}%`,
      icon: Trophy,
      color: "from-green-500 to-emerald-700",
    },

    {
      title: "Assessment Attempts",
      value: dashboardData?.assessment_attempts || 0,
      icon: ClipboardCheck,
      color: "from-purple-500 to-violet-700",
    },

    {
      title: "Questions Practiced",
      value: dashboardData?.questions_practiced || 0,
      icon: Brain,
      color: "from-orange-500 to-red-600",
    },
  ];

  return (
    <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;

        return (
          <div
            key={index}
            className="
              relative
              overflow-hidden
              bg-slate-900
              border
              border-slate-800
              rounded-3xl
              p-6
              hover:border-indigo-500/30
              hover:-translate-y-1
              transition-all
              duration-300
            "
          >
            {/* Glow */}
            <div
              className={`
                absolute
                top-[-40px]
                right-[-40px]
                w-32
                h-32
                rounded-full
                blur-3xl
                opacity-20
                bg-gradient-to-br
                ${stat.color}
              `}
            />

            <div className="relative z-10">
              <div className="flex items-center justify-between">

                <div>
                  <p className="text-slate-400 text-sm">
                    {stat.title}
                  </p>

                  <h2 className="text-4xl font-bold mt-3">
                    {stat.value}
                  </h2>
                </div>

                <div
                  className={`
                    p-4
                    rounded-2xl
                    bg-gradient-to-br
                    ${stat.color}
                  `}
                >
                  <Icon size={28} />
                </div>

              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default StatsCards;