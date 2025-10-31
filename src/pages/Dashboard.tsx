"use client";

import {
  Video,
  FileText,
  Image,
  Film,
  MessageSquare,
  Users,
  TrendingUp,
  TrendingDown,
  Loader2,
  BookOpen,
  BarChart2,
  Star,
  Eye,
  Download,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { apiService } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip, PieChart, Pie, Cell } from "recharts";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#6366f1"];

export default function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await apiService.getDashboardSummary();
        if (response.success && response.data) {
          setData(response.data);
        } else {
          toast({
            title: "Error",
            description: response.message || "Failed to load dashboard data",
            variant: "destructive",
          });
        }
      } catch (err) {
        toast({
          title: "Error",
          description: "Unable to fetch dashboard data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [toast]);

  if (loading)
    return (
      <div className="flex h-full items-center justify-center bg-gray-100 dark:bg-gray-900">
        <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
      </div>
    );

  const { users, blogs, testimonials, reels, videos, leads, materials, bookings, counselors } = data;

  // Chart Data
  const contentChart = [
    { name: "Blogs", value: blogs.total },
    { name: "Reels", value: reels.total },
    { name: "Videos", value: videos.total },
    { name: "Materials", value: materials.total },
    { name: "Testimonials", value: testimonials.total },
  ];

  const performanceChart = [
    { name: "Blog Views", value: blogs.totalViews },
    { name: "Reel Views", value: reels.totalViews },
    { name: "Video Views", value: videos.totalViews },
  ];

  return (
    <div className="h-screen overflow-y-auto p-6 space-y-8 bg-gray-100 dark:bg-gray-900">
      {/* HEADER */}
      <header className="sticky bg-gray-100 dark:bg-gray-900 z-10 pb-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Here’s a detailed snapshot of your platform’s performance and engagement.
        </p>
      </header>
  
      {/* TOP SUMMARY GRID */}
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <SummaryCard title="Total Users" value={users.total} icon={Users} subtitle={`${users.active} active`} />
        <SummaryCard title="Total Blogs" value={blogs.total} icon={FileText} subtitle={`${blogs.published} published`} />
        <SummaryCard title="Total Reels" value={reels.total} icon={Film} subtitle={`${reels.published} live`} />
        <SummaryCard title="Total Videos" value={videos.total} icon={Video} subtitle={`${videos.published} live`} />
        <SummaryCard title="Testimonials" value={testimonials.total} icon={MessageSquare} subtitle={`${testimonials.published} live`} />
        <SummaryCard title="Leads" value={leads.total} icon={TrendingUp} subtitle={`${leads.notContacted} not contacted`} />
        <SummaryCard title="Materials" value={materials.total} icon={Image} subtitle={`${materials.published} published`} />
        <SummaryCard title="Meetings" value={bookings.total} icon={BookOpen} subtitle={`${bookings.confirmed} confirmed`} />
        <SummaryCard title="Counselors" value={counselors.total} icon={Users} subtitle={`${counselors.active} active`} />
      </div>
  
      {/* ANALYTICS SECTION */}
      <div className="grid gap-6 md:grid-cols-2 min-h-0">
        {/* Content Distribution Pie */}
        <Card className="shadow-lg border dark:border-gray-700 overflow-hidden">
          <CardHeader>
            <CardTitle>Content Distribution</CardTitle>
            <CardDescription>Breakdown of content types on the platform</CardDescription>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={contentChart} dataKey="value" nameKey="name" outerRadius={90} label>
                  {contentChart.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
  
        {/* Engagement Bar Chart */}
        <Card className="shadow-lg border dark:border-gray-700 overflow-hidden">
          <CardHeader>
            <CardTitle>Engagement Overview</CardTitle>
            <CardDescription>Views and activity across blogs, reels, and videos</CardDescription>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceChart}>
                <XAxis dataKey="name" />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
  
      {/* QUICK INSIGHTS */}
      {/* <div className="grid gap-6 md:grid-cols-3">
        <InsightCard
          title="Top Performing Content"
          description="Reels have the highest engagement rate with an average of 13.2 views per reel."
          icon={TrendingUp}
        />
        <InsightCard
          title="User Activity"
          description={`${users.active} out of ${users.total} users are active.`}
          icon={Users}
        />
        <InsightCard
          title="Content Health"
          description={`${blogs.published} blogs, ${videos.published} videos, and ${materials.published} PDFs published successfully.`}
          icon={BarChart2}
        />
      </div> */}
    </div>
  );
  
}

/* ---------------- Helper Components ---------------- */

const SummaryCard = ({ title, value, icon: Icon, subtitle }: any) => (
  <Card className="bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition rounded-xl border border-gray-200 dark:border-gray-700">
    <CardContent className="p-5 flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{value}</h3>
        <p className={title==="Leads"? "text-xs text-red-500 dark:text-gray-400" : "text-xs text-green-500 dark:text-gray-400"}>{subtitle}</p>
      </div>
      <Icon className="h-8 w-8 text-blue-500" />
    </CardContent>
  </Card>
);

const InsightCard = ({ title, description, icon: Icon }: any) => (
  <Card className="bg-white dark:bg-gray-800 shadow-md rounded-xl border border-gray-200 dark:border-gray-700">
    <CardHeader className="flex flex-row items-center space-x-3">
      <Icon className="h-5 w-5 text-blue-500" />
      <CardTitle className="text-lg">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
    </CardContent>
  </Card>
);
