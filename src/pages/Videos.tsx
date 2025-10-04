import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Video, Play, Search, Filter, Plus, Edit, Trash2, Eye, Upload } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

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
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);
  const [metadata, setMetadata] = useState({
    title: "",
    description: "",
    category: "",
    tags: ""
  });
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<VideoItem | null>(null);
  const [editSelectedFile, setEditSelectedFile] = useState<File | null>(null);
  const [isEditDragOver, setIsEditDragOver] = useState(false);
  const { toast } = useToast();

  const resetUploadForm = () => {
    setSelectedFile(null);
    setUploadProgress(0);
    setIsUploading(false);
    setIsDragOver(false);
    setMetadata({
      title: "",
      description: "",
      category: "",
      tags: ""
    });
  };

  const openEditDialog = (video: VideoItem) => {
    setEditingVideo(video);
    setEditSelectedFile(null); // Reset file selection for edit
    setMetadata({
      title: video.title,
      description: video.description,
      category: video.category,
      tags: video.tags.join(', ')
    });
    setIsEditDialogOpen(true);
  };

  const handleEditVideo = () => {
    if (!metadata.title || !metadata.description || !metadata.category || !editingVideo) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Validate new file if selected
    if (editSelectedFile) {
      if (!editSelectedFile.type.startsWith('video/')) {
        toast({
          title: "Invalid file type",
          description: "Please select a video file (MP4, MOV, etc.)",
          variant: "destructive",
        });
        return;
      }

      if (editSelectedFile.size > 100 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select a video file smaller than 100MB",
          variant: "destructive",
        });
        return;
      }
    }

    const updatedVideos = mockVideos.map(video =>
      video.id === editingVideo.id
        ? {
            ...video,
            title: metadata.title,
            description: metadata.description,
            category: metadata.category,
            tags: metadata.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
          }
        : video
    );

    // Update the mockVideos array
    mockVideos.splice(0, mockVideos.length, ...updatedVideos);

    setIsEditDialogOpen(false);
    setEditingVideo(null);
    setEditSelectedFile(null);
    resetUploadForm();

    toast({
      title: "Success",
      description: editSelectedFile ? "Video and metadata updated successfully!" : "Video metadata updated successfully!",
    });
  };

  const handleCancelEdit = () => {
    setIsEditDialogOpen(false);
    setEditingVideo(null);
    setEditSelectedFile(null);
    resetUploadForm();
  };

  const handleFileSelect = (file: File) => {
    // Validate file type
    if (!file.type.startsWith('video/')) {
      toast({
        title: "Invalid file type",
        description: "Please select a video file (MP4, MOV, etc.)",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (100MB limit)
    if (file.size > 100 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select a video file smaller than 100MB",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const simulateUpload = async () => {
    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      setUploadProgress(i);
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    setIsUploading(false);

    // Create new video object
    const newVideo: VideoItem = {
      id: Date.now().toString(),
      title: metadata.title,
      description: metadata.description,
      thumbnail: "/api/placeholder/300/200",
      duration: "00:00", // Would be extracted from video file
      category: metadata.category,
      views: 0,
      uploadDate: new Date().toISOString().split('T')[0],
      tags: metadata.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
    };

    // Add to videos list (in a real app, this would be an API call)
    mockVideos.unshift(newVideo);

    setIsUploadDialogOpen(false);
    resetUploadForm();

    toast({
      title: "Upload successful",
      description: "Your video has been uploaded successfully!",
    });
  };

  const handleUpload = () => {
    if (!selectedFile || !metadata.title || !metadata.description || !metadata.category) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields and select a video file",
        variant: "destructive",
      });
      return;
    }

    simulateUpload();
  };

  const handleCancelUpload = () => {
    setIsUploadDialogOpen(false);
    resetUploadForm();
  };

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
          <Button onClick={() => setIsUploadDialogOpen(true)}>
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

        <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filteredVideos.map((video) => (
            <Card key={video.id} className="overflow-hidden">
              <div className="relative">
                <div className="aspect-[16/10] bg-muted flex items-center justify-center">
                  <Video className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                  {video.duration}
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 bg-black/20 transition-opacity">
                  <Button size="sm" variant="secondary">
                    <Play className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardHeader className="pb-2 p-3">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-sm leading-tight line-clamp-2 flex-1">{video.title}</CardTitle>
                  <Badge variant="secondary" className="text-xs shrink-0">{video.category}</Badge>
                </div>
                <CardDescription className="line-clamp-2 text-xs">
                  {video.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0 space-y-2 p-3">
                <div className="flex items-center text-xs text-muted-foreground gap-3">
                  <div className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {video.views.toLocaleString()}
                  </div>
                  <span>{new Date(video.uploadDate).toLocaleDateString()}</span>
                </div>
                
                <div className="flex flex-wrap gap-1">
                  {video.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {video.tags.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{video.tags.length - 2}
                    </Badge>
                  )}
                </div>

                <div className="flex gap-1">
                  <Button size="sm" variant="outline" className="flex-1 text-xs px-2" onClick={() => openEditDialog(video)}>
                    <Edit className="mr-1 h-3 w-3" />
                    Edit
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 text-xs px-2">
                    <Trash2 className="mr-1 h-3 w-3" />
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

      {/* Upload Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Upload Video</DialogTitle>
            <DialogDescription>
              Upload a new video file with metadata
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* File Upload Area */}
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                isDragOver ? 'border-primary bg-primary/10' : 'border-muted-foreground/25'
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <input
                type="file"
                accept="video/*"
                onChange={handleFileInputChange}
                className="hidden"
                id="video-file"
              />
              <label htmlFor="video-file" className="cursor-pointer">
                {selectedFile ? (
                  <div className="space-y-2">
                    <Video className="h-12 w-12 text-primary mx-auto" />
                    <div>
                      <p className="font-medium">{selectedFile.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="h-12 w-12 text-muted-foreground mx-auto" />
                    <div>
                      <p className="font-medium">Click to select or drag and drop</p>
                      <p className="text-sm text-muted-foreground">
                        MP4, MOV, AVI up to 100MB
                      </p>
                    </div>
                  </div>
                )}
              </label>
            </div>

            {/* Metadata Form */}
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="Enter video title"
                  value={metadata.title}
                  onChange={(e) => setMetadata({ ...metadata, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your video content"
                  value={metadata.description}
                  onChange={(e) => setMetadata({ ...metadata, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <select
                  id="category"
                  value={metadata.category}
                  onChange={(e) => setMetadata({ ...metadata, category: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="">Select Category</option>
                  <option value="Course Videos">Course Videos</option>
                  <option value="Tutorials">Tutorials</option>
                  <option value="Theory">Theory</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  placeholder="Enter tags separated by commas"
                  value={metadata.tags}
                  onChange={(e) => setMetadata({ ...metadata, tags: e.target.value })}
                />
              </div>
            </div>

            {/* Upload Progress */}
            {isUploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCancelUpload}>
              Cancel
            </Button>
            <Button onClick={handleUpload} disabled={isUploading || !selectedFile}>
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Video
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Video</DialogTitle>
            <DialogDescription>
              Edit video metadata
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Current Video Info */}
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm font-medium">Current Video:</p>
              <p className="text-sm text-muted-foreground">{editingVideo?.title}.mp4</p>
              <p className="text-xs text-muted-foreground mt-1">Optional: Select a new video file to replace the current one</p>
            </div>

            {/* File Upload Area */}
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                isEditDragOver ? 'border-primary bg-primary/10' : 'border-muted-foreground/25'
              }`}
              onDrop={(e) => {
                e.preventDefault();
                setIsEditDragOver(false);
                const files = Array.from(e.dataTransfer.files);
                if (files.length > 0) {
                  setEditSelectedFile(files[0]);
                }
              }}
              onDragOver={(e) => {
                e.preventDefault();
                setIsEditDragOver(true);
              }}
              onDragLeave={() => setIsEditDragOver(false)}
            >
              <input
                type="file"
                accept="video/*"
                onChange={(e) => {
                  const files = e.target.files;
                  if (files && files.length > 0) {
                    setEditSelectedFile(files[0]);
                  }
                }}
                className="hidden"
                id="edit-video-file"
              />
              <label htmlFor="edit-video-file" className="cursor-pointer">
                {editSelectedFile ? (
                  <div className="space-y-2">
                    <Video className="h-12 w-12 text-primary mx-auto" />
                    <div>
                      <p className="font-medium">{editSelectedFile.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(editSelectedFile.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="h-12 w-12 text-muted-foreground mx-auto" />
                    <div>
                      <p className="font-medium">Click to select new video file</p>
                      <p className="text-sm text-muted-foreground">
                        MP4, MOV, AVI up to 100MB (optional)
                      </p>
                    </div>
                  </div>
                )}
              </label>
            </div>

            {/* Metadata Form */}
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Title *</Label>
                <Input
                  id="edit-title"
                  placeholder="Enter video title"
                  value={metadata.title}
                  onChange={(e) => setMetadata({ ...metadata, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-description">Description *</Label>
                <Textarea
                  id="edit-description"
                  placeholder="Describe your video content"
                  value={metadata.description}
                  onChange={(e) => setMetadata({ ...metadata, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-category">Category *</Label>
                <select
                  id="edit-category"
                  value={metadata.category}
                  onChange={(e) => setMetadata({ ...metadata, category: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="">Select Category</option>
                  <option value="Course Videos">Course Videos</option>
                  <option value="Tutorials">Tutorials</option>
                  <option value="Theory">Theory</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-tags">Tags</Label>
                <Input
                  id="edit-tags"
                  placeholder="Enter tags separated by commas"
                  value={metadata.tags}
                  onChange={(e) => setMetadata({ ...metadata, tags: e.target.value })}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCancelEdit}>
              Cancel
            </Button>
            <Button onClick={handleEditVideo}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}