import Sidebar from "../components/dashboard/Sidebar";
import Topbar from "../components/dashboard/Topbar";
import StatsCards from "../components/dashboard/StatesCards";
import RecentInterviews from "../components/dashboard/RecentInterviews";
import RecentAssessments from "../components/dashboard/RecentAssessments";
import { useEffect, useState } from "react";
import api from "../api/axios";

function Dashboard() {
  // Create State

  const [dashboardData, setDashboardData] = useState(null);

  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Fetch Function
  const fetchDashboardData = async () => {
    try {
        const response = await api.get("/users/dashboard/");

        console.log(response.data);

        setDashboardData(response.data);

    } catch (error) {
        console.log(error);
    } finally {
        setLoading(false);
    }
  };
  // loading Dashboard
  if (loading) {
    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
            Loading Dashboard...
        </div>
    );
}

  //  Final function Return
  return (
    <div className="bg-slate-950 text-white min-h-screen flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-8 max-w-7xl mx-auto w-full overflow-y-auto">
        {/* Topbar */}
        <Topbar />

        {/* Stats Cards */}
        <div id="dashboard-stats" className="scroll-mt-6">
          <StatsCards dashboardData={dashboardData} />
        </div>

        {/*  Recent Interviews */}
        <div id="recent-interviews" className="scroll-mt-6">
          <RecentInterviews dashboardData={dashboardData} />
        </div>
        
        <div id="recent-assessments" className="scroll-mt-6">
          <RecentAssessments dashboardData={dashboardData} />
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
