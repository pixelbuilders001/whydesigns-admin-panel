"use client";

import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import apiService from "@/lib/api";
import {
  Film,
  Play,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Heart,
  MessageCircle,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";

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
  videoUrl: string;
    isPublished: boolean; // ✅ ADD THIS
}

interface FormData {
  title: string;
  caption: string;
  video: File | null;
  tags: string;
  duration?: number;
  fileSize?: number;
}

export default function Reels() {
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
const [reelToDelete, setReelToDelete] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingReel, setEditingReel] = useState<ReelItem | null>(null);
  const [reels, setReels] = useState<ReelItem[]>([]);
  const [formData, setFormData] = useState<FormData>({
    title: "",
    caption: "",
    video: null,
    tags: "",
    duration: undefined,
    fileSize: undefined,
  });

  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string | null>(null);

  // Pagination state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 12; // Number of reels per page
  const [loading,setLoading]=useState(false)

  const fetchReels = async (pageNumber = 1) => {
        setLoading(true);
    try {
      const response = await apiService.getReels(pageNumber, limit);
      if (response.success && response.data) {
        const formattedReels: ReelItem[] = response.data.reels.map((r: any) => ({
          id: r.id,
          title: r.title,
          caption: r.description,
          duration: r.durationFormatted || "0:00",
          views: r.viewCount || 0,
          likes: r.likeCount || 0,
          comments: 0,
          uploadDate: r.createdAt,
          tags: r.tags || [],
          videoUrl: r.videoUrl,
          isPublished: r.isPublished,
        }));
        setReels(formattedReels);
        setTotalPages(response.data.totalPages);
        setPage(response.data.page);
            setLoading(false);
      }
    } catch (error) {
      console.error("Failed to fetch reels:", error);
          setLoading(false);
    }
  };

  useEffect(() => {
    fetchReels(page);
  }, [page]);

  const handleAddReel = () => {
    setFormData({
      title: "",
      caption: "",
      video: null,
      tags: "",
      duration: undefined,
      fileSize: undefined,
    });
    setIsAddModalOpen(true);
  };

  const handleEditReel = (reel: ReelItem) => {
    setEditingReel(reel);
    setFormData({
      title: reel.title,
      caption: reel.caption,
      video: null,
      tags: reel.tags.join(", "),
      duration: undefined,
      fileSize: undefined,
    });
    setIsEditModalOpen(true);
  };

  // Delete reel API
  const handleDeleteReel = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this reel?")) return;
    try {
      const response = await apiService.deleteReel(id);
      if (response.success) {
        setReels((prev) => prev.filter((r) => r.id !== id));
      } else {
        alert("Failed to delete reel");
      }
    } catch (error) {
      console.error("Delete reel error:", error);
    }
  };

  // Handle video upload + get duration and size
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("video/")) {
      alert("Please upload a valid video file");
      return;
    }

    const video = document.createElement("video");
    video.preload = "metadata";

    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src);
      setFormData({
        ...formData,
        video: file,
        duration: parseFloat(video.duration.toFixed(2)),
        fileSize: parseFloat((file.size / (1024 * 1024)).toFixed(2)),
      });
    };

    video.src = URL.createObjectURL(file);
  };

  // Create new reel
  const handleSubmitAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.caption || !formData.video) {
      alert("Please fill all required fields and upload a video");
      return;
    }

    const tagsArray = formData.tags
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t);

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.caption);
    data.append("video", formData.video);
    tagsArray.forEach((tag) => data.append("tags[]", tag));
    if (formData.duration) data.append("duration", String(formData.duration));
    if (formData.fileSize) data.append("fileSize", String(formData.fileSize));

    try {
      const response = await apiService.createReel(data);
      if (response.success && response.data) {
        fetchReels();
        setIsAddModalOpen(false);
      }
    } catch (error) {
      console.error("Create reel error:", error);
    }
  };

  // Update reel (supports video update)
  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReel) return;

    const tagsArray = formData.tags
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t);

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.caption);
    tagsArray.forEach((tag) => data.append("tags[]", tag));
    if (formData.video) {
      data.append("video", formData.video);
      if (formData.duration)
        data.append("duration", String(formData.duration));
      if (formData.fileSize)
        data.append("fileSize", String(formData.fileSize));
    }

    try {
      const response = await apiService.updateReel(editingReel.id, data);
      if (response.success && response.data) {
        fetchReels();
        setIsEditModalOpen(false);
        setEditingReel(null);
      }
    } catch (error) {
      console.error("Update reel error:", error);
    }
  };


const handleTogglePublish = async (id: string, newStatus: boolean) => {
  console.log("New publish status:", newStatus); // <-- now will be true/false correctly

  try {
    // Optimistically update UI
    setReels((prevReels) =>
      prevReels.map((r) =>
        r._id === id ? { ...r, isPublished: newStatus } : r
      )
    );

    // Call appropriate API
    if (newStatus) {
      await apiService.publishReel(id);
      fetchReels()
    } else {
      await apiService.unpublishReel(id);
      fetchReels()
    }
  } catch (err) {
    console.error("Error toggling publish:", err);

    // Revert if failed
    setReels((prevReels) =>
      prevReels.map((r) =>
        r._id === id ? { ...r, isPublished: !newStatus } : r
      )
    );
  }
};

  if (loading) {
    return (
      <Layout>
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </Layout>
    );
  }
  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Reels</h1>
            <p className="text-muted-foreground">
              Manage your short-form video content and updates.
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
          {reels.map((reel) => (
            <Card key={reel.id} className="overflow-hidden">
              <div className="relative group">
                <div className="aspect-[9/6] bg-muted flex items-center justify-center">
                  <Film className="h-12 w-12 text-muted-foreground" />
                </div>
                <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                  {reel.duration}
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/20 transition-opacity">
                  <Button
                    size="icon"
                    variant="secondary"
                    className="rounded-full"
                    onClick={() => {
                      setCurrentVideoUrl(reel.videoUrl);
                      setIsVideoModalOpen(true);
                    }}
                  >
                    <Play className="h-6 w-6" />
                  </Button>
                </div>
              </div>
              <CardHeader className="pb-2 p-3">
                <CardTitle className="text-sm leading-tight line-clamp-2">
                  {reel.title}
                </CardTitle>
                <CardDescription className="line-clamp-2 text-xs">
                  {reel.caption}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0 space-y-2 p-3">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <Eye className="h-3 w-3" /> {reel.views}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Heart className="h-3 w-3" /> {reel.likes}
                  </div>
                  <div className="flex items-center space-x-2">
                    <MessageCircle className="h-3 w-3" /> {reel.comments}
                  </div>
                </div>



                <div className="flex flex-wrap gap-1">
                  {reel.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex justify-end gap-2 mt-2 items-center">
                
                  <Switch
                  checked={Boolean(reel.isPublished)}
                  onCheckedChange={(checked) => handleTogglePublish(reel.id, checked)}
                />
                
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => handleEditReel(reel)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
              <Button
  size="icon"
  variant="destructive"
  onClick={() => {
    setReelToDelete(reel.id);
    setDeleteConfirmOpen(true);
  }}
>
  <Trash2 className="h-5 w-5" />
</Button>
                </div>
                   {/* <div className="p-3">
          

              <div className="flex items-center justify-between mt-3">
                <span className="text-sm font-medium">
                  {reel.isPublished ? "Published" : "Unpublished"}
                </span>
             
              </div>
            </div> */}
              </CardContent>
            </Card>
          ))}
        </div>
             {/* Pagination */}
        <div className="flex justify-center gap-2 mt-6">
          <Button
            variant="outline"
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <span className="px-4 py-2 bg-muted rounded">
            {page} / {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
          >
            Next
          </Button>
        </div>
      </div>

      {/* ADD MODAL */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Reel</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmitAdd} className="space-y-4 mt-4">
            <div>
              <Label>Title</Label>
              <Input
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div>
              <Label>Caption</Label>
              <Textarea
                required
                value={formData.caption}
                onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
              />
            </div>
            <div>
              <Label>Tags (comma separated)</Label>
              <Input
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              />
            </div>
            <div>
              <Label>Video File</Label>
              <Input type="file" accept="video/*" required onChange={handleFileChange} />
              {formData.duration && (
                <p className="text-xs text-muted-foreground mt-1">
                  Duration: {formData.duration}s | Size: {formData.fileSize} MB
                </p>
              )}
            </div>
            <DialogFooter>
              <Button type="submit">Upload Reel</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* EDIT MODAL */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Reel</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmitEdit} className="space-y-4 mt-4">
            <div>
              <Label>Title</Label>
              <Input
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div>
              <Label>Caption</Label>
              <Textarea
                required
                value={formData.caption}
                onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
              />
            </div>
            <div>
              <Label>Tags (comma separated)</Label>
              <Input
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              />
            </div>
            <div>
              <Label>Change Video (optional)</Label>
              <Input type="file" accept="video/*" onChange={handleFileChange} />
              {formData.video && (
                <p className="text-xs text-muted-foreground mt-1">
                  New video selected ({formData.fileSize} MB, {formData.duration}s)
                </p>
              )}
            </div>
            <DialogFooter>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* VIDEO MODAL */}
      <Dialog
        open={isVideoModalOpen}
        onOpenChange={(open) => {
          setIsVideoModalOpen(open);
          if (!open) setCurrentVideoUrl(null);
        }}
      >
        <DialogContent className="max-w-3xl w-full p-4">
          <DialogHeader>
            <DialogTitle>Video Preview</DialogTitle>
          </DialogHeader>
          <div className="mt-4 flex justify-center">
            {currentVideoUrl && (
              <video
                src={currentVideoUrl}
                controls
                autoPlay
                className="w-full max-h-[60vh] rounded"
              />
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setIsVideoModalOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
  <DialogContent className="max-w-sm">
    <DialogHeader>
      <DialogTitle>Are you sure?</DialogTitle>
      <CardDescription>
        This action will permanently delete this reel. You can’t undo this.
      </CardDescription>
    </DialogHeader>
    <DialogFooter className="flex justify-end space-x-2">
      <Button
        variant="outline"
        onClick={() => setDeleteConfirmOpen(false)}
      >
        Cancel
      </Button>
      <Button
        variant="destructive"
        onClick={async () => {
          if (reelToDelete) {
            try {
              await apiService.deleteReel(reelToDelete);
              setDeleteConfirmOpen(false);
              setReelToDelete(null);
              // refresh list after deletion
              fetchReels(); 
            } catch (err) {
              console.error("Delete failed:", err);
            }
          }
        }}
      >
        Yes, Delete
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

    </Layout>
  );
}
