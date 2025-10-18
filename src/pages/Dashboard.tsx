import { Video, FileText, Image, Film, MessageSquare, Users, TrendingUp, Eye } from "lucide-react";
import { StatsCard } from "@/components/StatsCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const stats = [
    {
      title: "Course Videos",
      value: 24,
      icon: Video,
      trend: { value: 12, label: "from last month" },
    },
    {
      title: "PDF Materials",
      value: 18,
      icon: FileText,
      trend: { value: 5, label: "from last month" },
    },
    {
      title: "Images",
      value: 156,
      icon: Image,
      trend: { value: 23, label: "from last month" },
    },
    {
      title: "Reels",
      value: 8,
      icon: Film,
      trend: { value: 33, label: "from last month" },
    },
    {
      title: "Testimonials",
      value: 12,
      icon: MessageSquare,
      trend: { value: 8, label: "from last month" },
    },
    {
      title: "Total Views",
      value: "2.4K",
      icon: Eye,
      trend: { value: 18, label: "from last month" },
    },
    {
      title: "Users",
      value: 142,
      icon: Users,
      trend: { value: 15, label: "from last month" },
    },
    {
      title: "Pending Meetings",
      value: "94%",
      icon: TrendingUp,
      trend: { value: 3, label: "from last month" },
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's an overview of your fashion education platform.
          </p>
        </div>
        {/* <Button>Upload New Content</Button> */}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest uploads and updates to your content.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { type: "Video", title: "Advanced Draping Techniques", time: "2 hours ago" },
                { type: "PDF", title: "Color Theory Guide", time: "4 hours ago" },
                { type: "Image", title: "Spring Collection Gallery", time: "6 hours ago" },
                { type: "Reel", title: "Quick Pattern Tips", time: "1 day ago" },
              ].map((activity, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-2 h-2 bg-primary rounded-full mr-3" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">{activity.type} • {activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card> */}

        {/* <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Frequently used actions for content management.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline">
              <Video className="mr-2 h-4 w-4" />
              Upload Course Video
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Image className="mr-2 h-4 w-4" />
              Add Images
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Film className="mr-2 h-4 w-4" />
              Create Reel
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <MessageSquare className="mr-2 h-4 w-4" />
              Add Testimonial
            </Button>
          </CardContent>
        </Card> */}
      </div>
    </div>
  );
}