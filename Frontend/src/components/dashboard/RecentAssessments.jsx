function RecentAssessments({ dashboardData }) {

  const assessments =
    dashboardData?.recent_assessments || [];

  if (assessments.length === 0) {
    return null;
  }

  return (
    <div className="mt-10 bg-slate-900 border border-slate-800 rounded-3xl p-8">

      <h2 className="text-2xl font-bold">
        Recent Assessments
      </h2>

      <p className="text-slate-400 mt-2 mb-8">
        Track your assessment performance.
      </p>

      <div className="space-y-4">

        {assessments.map((item, index) => (

          <div
            key={index}
            className="
              bg-slate-800/40
              border
              border-slate-800
              rounded-2xl
              p-5
              flex
              justify-between
              items-center
            "
          >

            <div>
              <h3 className="font-semibold">
                Assessment Attempt
              </h3>

              <p className="text-slate-400 text-sm">
                {new Date(item.date).toLocaleDateString()}
              </p>
            </div>

            <div className="text-right">

              <p className="text-indigo-400 font-bold text-xl">
                {item.score}/{item.total}
              </p>

              <p className="text-green-400">
                {Number(item.percentage).toFixed(1)}%
              </p>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}

export default RecentAssessments;