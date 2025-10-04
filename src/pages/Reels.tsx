import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Film, Play, Search, Plus, Edit, Trash2, Eye, Heart, MessageCircle, Upload } from "lucide-react";

interface ReelItem {
  id: string;
  title: string;
  caption: string;
  videoFile?: string;
  duration: string;
  views: number;
  likes: number;
  comments: number;
  uploadDate: string;
  tags: string[];
}

interface FormData {
  title: string;
  caption: string;
  videoFile: File | null;
  tags: string;
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
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingReel, setEditingReel] = useState<ReelItem | null>(null);
  const [reels, setReels] = useState<ReelItem[]>(mockReels);

  // Form state for add/edit
  const [formData, setFormData] = useState<FormData>({
    title: "",
    caption: "",
    videoFile: null,
    tags: ""
  });

  const filteredReels = reels.filter(reel => {
    return reel.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
           reel.caption.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Handler functions
  const handleAddReel = () => {
    setFormData({
      title: "",
      caption: "",
      videoFile: null,
      tags: ""
    });
    setIsAddModalOpen(true);
  };

  const handleEditReel = (reel: ReelItem) => {
    setEditingReel(reel);
    setFormData({
      title: reel.title,
      caption: reel.caption,
      videoFile: null,
      tags: reel.tags.join(", ")
    });
    setIsEditModalOpen(true);
  };

  const handleDeleteReel = (id: string) => {
    if (window.confirm("Are you sure you want to delete this reel?")) {
      setReels(reels.filter(reel => reel.id !== id));
    }
  };

  const handleSubmitAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.caption || !formData.videoFile) {
      alert("Please fill all required fields and select a video file");
      return;
    }

    const newReel: ReelItem = {
      id: Date.now().toString(),
      title: formData.title,
      caption: formData.caption,
      duration: "0:00", // Will be updated after video processing
      views: 0,
      likes: 0,
      comments: 0,
      uploadDate: new Date().toISOString().split('T')[0],
      tags: formData.tags.split(",").map(tag => tag.trim()).filter(tag => tag)
    };

    setReels([...reels, newReel]);
    setIsAddModalOpen(false);
    setFormData({
      title: "",
      caption: "",
      videoFile: null,
      tags: ""
    });
  };

  const handleSubmitEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReel || !formData.title || !formData.caption) {
      alert("Please fill all required fields");
      return;
    }

    const updatedReel: ReelItem = {
      ...editingReel,
      title: formData.title,
      caption: formData.caption,
      tags: formData.tags.split(",").map(tag => tag.trim()).filter(tag => tag)
    };

    setReels(reels.map(reel => reel.id === editingReel.id ? updatedReel : reel));
    setIsEditModalOpen(false);
    setEditingReel(null);
    setFormData({
      title: "",
      caption: "",
      videoFile: null,
      tags: ""
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("video/")) {
      setFormData({ ...formData, videoFile: file });
    } else {
      alert("Please select a valid video file");
      e.target.value = "";
    }
  };

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
          <Button onClick={handleAddReel}>
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

        <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filteredReels.map((reel) => (
            <Card key={reel.id} className="overflow-hidden">
              <div className="relative group">
                <div className="aspect-[9/6] bg-muted flex items-center justify-center">
                  <Film className="h-12 w-12 text-muted-foreground" />
                </div>
                <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                  {reel.duration}
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/20 transition-opacity">
                  <Button size="icon" variant="secondary" className="rounded-full">
                    <Play className="h-6 w-6" />
                  </Button>
                </div>
              </div>
              
              <CardHeader className="pb-2 p-3">
                <CardTitle className="text-sm leading-tight line-clamp-2">{reel.title}</CardTitle>
                <CardDescription className="line-clamp-2 text-xs">
                  {reel.caption}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pt-0 space-y-2 p-3">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {reel.views.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="h-3 w-3" />
                      {reel.likes}
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="h-3 w-3" />
                      {reel.comments}
                    </div>
                  </div>
                </div>

                <div className="text-xs text-muted-foreground">
                  {new Date(reel.uploadDate).toLocaleDateString()}
                </div>
                
                <div className="flex flex-wrap gap-1">
                  {reel.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                  {reel.tags.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{reel.tags.length - 2}
                    </Badge>
                  )}
                </div>

                <div className="flex gap-1">
                  <Button size="sm" variant="outline" className="flex-1 text-xs px-2" onClick={() => handleEditReel(reel)}>
                    <Edit className="mr-1 h-3 w-3" />
                    Edit
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 text-xs px-2" onClick={() => handleDeleteReel(reel.id)}>
                    <Trash2 className="mr-1 h-3 w-3" />
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

      {/* Add Reel Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Reel</DialogTitle>
            <DialogDescription>
              Upload a new video reel and provide its details.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitAdd}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter reel title"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="caption">Caption *</Label>
                <Textarea
                  id="caption"
                  value={formData.caption}
                  onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                  placeholder="Enter reel caption"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="videoFile">Video File *</Label>
                <Input
                  id="videoFile"
                  type="file"
                  accept="video/*"
                  onChange={handleFileChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="Enter tags separated by commas"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Create Reel</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Reel Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Reel</DialogTitle>
            <DialogDescription>
              Update the reel details and optionally replace the video file.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitEdit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-title">Title *</Label>
                <Input
                  id="edit-title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter reel title"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-caption">Caption *</Label>
                <Textarea
                  id="edit-caption"
                  value={formData.caption}
                  onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                  placeholder="Enter reel caption"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-videoFile">Replace Video File (optional)</Label>
                <Input
                  id="edit-videoFile"
                  type="file"
                  accept="video/*"
                  onChange={handleFileChange}
                />
                <p className="text-xs text-muted-foreground">
                  Leave empty to keep the current video file
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-tags">Tags (comma separated)</Label>
                <Input
                  id="edit-tags"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="Enter tags separated by commas"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Update Reel</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}