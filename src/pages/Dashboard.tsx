import { Video, FileText, Image, Film, MessageSquare, Users, TrendingUp, Eye, TrendingDown, Loader2 } from "lucide-react";
import { StatsCard } from "@/components/StatsCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { apiService } from "@/lib/api";
import type { DashboardResponse } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";


export default function Dashboard() {
  const [stats, setStats] = useState<{
    title: string;
    value: string | number;
    icon: any;
    trend?: { value: number; label: string };
  }[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await apiService.getDashboardSummary();

        if (response.success && response.data) {
          const {
            users,
            blogs,
            testimonials,
            reels,
            videos,
            leads,
            materials,
            bookings,
            counselors,
          } = response.data;

          setStats([
            {
              title: "Users",
              value: users.total,
              icon: Users,
              trend: { value: users.active, label: "Active" },
            },
            {
              title: "Blogs",
              value: blogs.total,
              icon: FileText,
              trend: { value: blogs.published, label: "Published" },
            },
            {
              title: "Testimonials",
              value: testimonials.total,
              icon: MessageSquare,
              trend: { value: testimonials.approved, label: "Approved" },
            },
            {
              title: "Reels",
              value: reels.total,
              icon: Film,
              trend: { value: reels.published, label: "Published" },
            },
            {
              title: "Videos",
              value: videos.total,
              icon: Video,
            },
            {
              title: "Leads",
              value: leads.total,
              icon: TrendingUp,
              trend: { value: leads.active, label: "Active" },
            },
            {
              title: "Materials",
              value: materials.total,
              icon: Image,
            },
            {
              title: "Bookings",
              value: bookings.total,
              icon: TrendingUp,
              trend: { value: bookings.confirmed, label: "Confirmed" },
            },
            {
              title: "Counselors",
              value: counselors.total,
              icon: Users,
              trend: { value: counselors.active, label: "Active" },
            },
          ]);
        } else {
          toast({
            title: "Error",
            description: response.message,
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast({
          title: "Error",
          description: "Failed to fetch dashboard data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [toast]);

  if (loading) {
    return (
      <div className="p-6 space-y-6 bg-gray-100 dark:bg-gray-800 h-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
        Loading dashboard data...
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gray-100 dark:bg-gray-800 h-full">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
            Welcome back!
          </h1>
          <p className="text-gray-700 dark:text-gray-300">
            Here's an overview of your fashion education platform.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index} className="shadow-md rounded-lg bg-white dark:bg-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-gray-700 dark:text-gray-300 text-sm">{stat.title}</span>
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-50">{stat.value}</div>
                </div>
                <stat.icon className="h-8 w-8 text-blue-500" />
              </div>
              {stat.trend && (
                <div className="flex items-center mt-2 text-sm text-green-600 dark:text-green-400">
                  {stat.trend.value > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                  <span className="ml-1">{stat.trend.value} {stat.trend.label}</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/*  Recent Activity - Example
          <Card className="col-span-4 shadow-md rounded-lg bg-white dark:bg-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-gray-50">Recent Activity</CardTitle>
              <CardDescription className="text-gray-700 dark:text-gray-300">
                Latest uploads and updates to your content.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { type: "Video", title: "Advanced Draping Techniques", time: "2 hours ago" },
                { type: "PDF", title: "Color Theory Guide", time: "4 hours ago" },
                { type: "Image", title: "Spring Collection Gallery", time: "6 hours ago" },
                { type: "Reel", title: "Quick Pattern Tips", time: "1 day ago" },
              ].map((activity, index) => (
                <div key={index} className="flex items-center py-2 border-b border-gray-200 dark:border-gray-700 last:border-none">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-50">{activity.title}</p>
                    <p className="text-xs text-gray-700 dark:text-gray-300">{activity.type} • {activity.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        */}

        {/* Quick Actions - Example
          <Card className="col-span-3 shadow-md rounded-lg bg-white dark:bg-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-gray-50">Quick Actions</CardTitle>
              <CardDescription className="text-gray-700 dark:text-gray-300">
                Frequently used actions for content management.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start bg-blue-100 hover:bg-blue-200 text-blue-800 dark:bg-blue-800 dark:hover:bg-blue-700 dark:text-blue-50 rounded-md shadow-sm">
                <Video className="mr-2 h-4 w-4" />
                Upload Course Video
              </Button>
              <Button className="w-full justify-start bg-blue-100 hover:bg-blue-200 text-blue-800 dark:bg-blue-800 dark:hover:bg-blue-700 dark:text-blue-50 rounded-md shadow-sm">
                <Image className="mr-2 h-4 w-4" />
                Add Images
              </Button>
              <Button className="w-full justify-start bg-blue-100 hover:bg-blue-200 text-blue-800 dark:bg-blue-800 dark:hover:bg-blue-700 dark:text-blue-50 rounded-md shadow-sm">
                <Film className="mr-2 h-4 w-4" />
                Create Reel
              </Button>
              <Button className="w-full justify-start bg-blue-100 hover:bg-blue-200 text-blue-800 dark:bg-blue-800 dark:hover:bg-blue-700 dark:text-blue-50 rounded-md shadow-sm">
                <MessageSquare className="mr-2 h-4 w-4" />
                Add Testimonial
              </Button>
            </CardContent>
          </Card>
        */}
      </div>
    </div>
  );
}