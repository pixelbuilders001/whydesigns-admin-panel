import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Film, Play, Search, Plus, Edit, Trash2, Eye, Heart, MessageCircle } from "lucide-react";

interface ReelItem {
  id: string;
  title: string;
  caption: string;
  duration: string;
  views: number;
  likes: number;
  comments: number;
  uploadDate: string;
  tags: string[];
}

const mockReels: ReelItem[] = [
  {
    id: "1",
    title: "Quick Pattern Cutting Tips",
    caption: "Master these 3 essential pattern cutting techniques in under 30 seconds! ✂️ #PatternMaking #FashionTips",
    duration: "0:28",
    views: 5420,
    likes: 284,
    comments: 45,
    uploadDate: "2024-01-15",
    tags: ["pattern", "cutting", "tips", "quick"]
  },
  {
    id: "2",
    title: "Color Matching Secrets", 
    caption: "The secret to perfect color coordination every fashion designer should know! 🎨 #ColorTheory #Fashion",
    duration: "0:31",
    views: 3890,
    likes: 201,
    comments: 32,
    uploadDate: "2024-01-12",
    tags: ["color", "theory", "matching", "design"]
  },
  {
    id: "3",
    title: "Fabric Draping Magic",
    caption: "Transform any fabric into stunning silhouettes with this simple draping technique! ✨ #Draping #FashionDesign",
    duration: "0:25",
    views: 7210,
    likes: 456,
    comments: 78,
    uploadDate: "2024-01-10",
    tags: ["draping", "fabric", "silhouette", "technique"]
  }
];

export default function Reels() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredReels = mockReels.filter(reel => {
    return reel.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
           reel.caption.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Reels</h1>
            <p className="text-muted-foreground">
              Manage your short-form video content and fashion tips.
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Reel
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search reels..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 max-w-md"
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredReels.map((reel) => (
            <Card key={reel.id} className="overflow-hidden">
              <div className="relative group">
                <div className="aspect-[9/16] bg-muted flex items-center justify-center">
                  <Film className="h-16 w-16 text-muted-foreground" />
                </div>
                <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                  {reel.duration}
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/20 transition-opacity">
                  <Button size="icon" variant="secondary" className="rounded-full">
                    <Play className="h-8 w-8" />
                  </Button>
                </div>
              </div>
              
              <CardHeader className="pb-3">
                <CardTitle className="text-lg leading-tight">{reel.title}</CardTitle>
                <CardDescription className="line-clamp-3 text-sm">
                  {reel.caption}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pt-0 space-y-4">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {reel.views.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="h-4 w-4" />
                      {reel.likes}
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="h-4 w-4" />
                      {reel.comments}
                    </div>
                  </div>
                </div>

                <div className="text-xs text-muted-foreground">
                  {new Date(reel.uploadDate).toLocaleDateString()}
                </div>
                
                <div className="flex flex-wrap gap-1">
                  {reel.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                  {reel.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{reel.tags.length - 3}
                    </Badge>
                  )}
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

        {filteredReels.length === 0 && (
          <div className="text-center py-12">
            <Film className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">No reels found</p>
            <p className="text-muted-foreground">Try adjusting your search or create your first reel.</p>
          </div>
        )}
      </div>
    </Layout>
  );
}