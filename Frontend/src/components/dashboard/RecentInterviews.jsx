function RecentInterviews({ dashboardData }) {

  const interviews = dashboardData?.recent_interviews || [];

  if (interviews.length === 0) {
    return (
      <div className="mt-10 bg-slate-900 border border-slate-800 rounded-3xl p-8">

        <div className="text-center py-12">

          <h2 className="text-2xl font-bold">
            No Interviews Yet
          </h2>

          <p className="text-slate-400 mt-3">
            Complete your first mock interview to see your performance history here.
          </p>

        </div>

      </div>
    );
  }

  return (
    <div className="mt-10 bg-slate-900 border border-slate-800 rounded-3xl p-8">

      {/* Heading */}
      <div className="flex items-center justify-between mb-8">

        <div>
          <h2 className="text-2xl font-bold">
            Recent Interviews
          </h2>

          <p className="text-slate-400 mt-2">
            Track your latest interview performance.
          </p>
        </div>

      </div>

      {/* Desktop Header */}
      <div className="hidden md:grid grid-cols-5 text-slate-400 text-sm border-b border-slate-800 pb-4">

        <p>Role</p>
        <p>Interview Type</p>
        <p>Score</p>
        <p>Date</p>
        <p>Status</p>

      </div>

      {/* Rows */}
      <div className="space-y-4 mt-6">

        {interviews.map((interview) => (

          <div
            key={interview.id}
            className="
              grid
              md:grid-cols-5
              gap-4
              bg-slate-800/40
              border
              border-slate-800
              rounded-2xl
              p-5
              hover:border-indigo-500/30
              transition-all
              duration-300
            "
          >

            {/* Role */}
            <div>
              <p className="text-sm text-slate-500 md:hidden">
                Role
              </p>

              <h3 className="font-semibold">
                {interview.role}
              </h3>
            </div>

            {/* Type */}
            <div>
              <p className="text-sm text-slate-500 md:hidden">
                Interview Type
              </p>

              <p className="text-slate-300">
                {interview.type}
              </p>
            </div>

            {/* Score */}
            <div>
              <p className="text-sm text-slate-500 md:hidden">
                Score
              </p>

              <p className="font-semibold text-indigo-400">
                {interview.score || 0}%
              </p>
            </div>

            {/* Date */}
            <div>
              <p className="text-sm text-slate-500 md:hidden">
                Date
              </p>

              <p className="text-slate-300">
                {interview.date}
              </p>
            </div>

            {/* Status */}
            <div>
              <p className="text-sm text-slate-500 md:hidden">
                Status
              </p>

              <span
                className="
                  px-4
                  py-2
                  rounded-full
                  text-sm
                  font-medium
                  bg-green-500/20
                  text-green-400
                "
              >
                Completed
              </span>
            </div>

          </div>

        ))}

      </div>

    </div>
  );
}

export default RecentInterviews;