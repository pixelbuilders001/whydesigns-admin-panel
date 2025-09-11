import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Video, Play, Search, Filter, Plus, Edit, Trash2, Eye } from "lucide-react";

interface VideoItem {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  category: string;
  views: number;
  uploadDate: string;
  tags: string[];
}

const mockVideos: VideoItem[] = [
  {
    id: "1",
    title: "Advanced Draping Techniques",
    description: "Learn professional draping methods for creating stunning silhouettes",
    thumbnail: "/api/placeholder/300/200",
    duration: "24:30",
    category: "Course Videos",
    views: 1250,
    uploadDate: "2024-01-15",
    tags: ["draping", "advanced", "technique"]
  },
  {
    id: "2", 
    title: "Pattern Making Basics",
    description: "Foundation course on creating your first patterns",
    thumbnail: "/api/placeholder/300/200",
    duration: "18:45",
    category: "Tutorials",
    views: 890,
    uploadDate: "2024-01-10",
    tags: ["pattern", "basics", "beginner"]
  },
  {
    id: "3",
    title: "Color Theory in Fashion",
    description: "Understanding color combinations and seasonal palettes",
    thumbnail: "/api/placeholder/300/200", 
    duration: "15:20",
    category: "Theory",
    views: 2100,
    uploadDate: "2024-01-08",
    tags: ["color", "theory", "palette"]
  }
];

export default function Videos() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredVideos = mockVideos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         video.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || video.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Course Videos</h1>
            <p className="text-muted-foreground">
              Manage your educational video content and tutorials.
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Upload Video
          </Button>
        </div>

        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search videos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="flex h-10 w-48 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <option value="all">All Categories</option>
            <option value="Course Videos">Course Videos</option>
            <option value="Tutorials">Tutorials</option>
            <option value="Theory">Theory</option>
          </select>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredVideos.map((video) => (
            <Card key={video.id} className="overflow-hidden">
              <div className="relative">
                <div className="aspect-video bg-muted flex items-center justify-center">
                  <Video className="h-12 w-12 text-muted-foreground" />
                </div>
                <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                  {video.duration}
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 bg-black/20 transition-opacity">
                  <Button size="icon" variant="secondary">
                    <Play className="h-6 w-6" />
                  </Button>
                </div>
              </div>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg leading-tight">{video.title}</CardTitle>
                  <Badge variant="secondary">{video.category}</Badge>
                </div>
                <CardDescription className="line-clamp-2">
                  {video.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                <div className="flex items-center text-sm text-muted-foreground gap-4">
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {video.views.toLocaleString()} views
                  </div>
                  <span>{new Date(video.uploadDate).toLocaleDateString()}</span>
                </div>
                
                <div className="flex flex-wrap gap-1">
                  {video.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Edit className="mr-2 h-3 w-3" />
                    Edit
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <Trash2 className="mr-2 h-3 w-3" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredVideos.length === 0 && (
          <div className="text-center py-12">
            <Video className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">No videos found</p>
            <p className="text-muted-foreground">Try adjusting your search or upload your first video.</p>
          </div>
        )}
      </div>
    </Layout>
  );
}