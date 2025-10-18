import { useState, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload as UploadIcon, File, X, Video, FileText, Image as ImageIcon, Plus, Edit, Trash2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Layout } from "@/components/Layout";
import { apiService } from "@/lib/api";

interface UploadedFile extends File {
  preview?: string;
  id: string;
}

interface Banner {
  _id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  files: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface BannersResponse {
  success: boolean;
  message: string;
  data: Banner[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface CreateBannerRequest {
  title: string;
  description: string;
  category: string;
  tags: string[];
  files: File[];
}

export default function Upload() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [metadata, setMetadata] = useState({
    title: "",
    description: "",
    category: "",
    tags: [] as string[],
  });
  const [currentTag, setCurrentTag] = useState("");
  const { toast } = useToast();

  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBanners, setTotalBanners] = useState(0);

  // Fetch banners from API
  const fetchBanners = async (page: number = 1) => {
    try {
      setLoading(true);
      // You'll need to add getBanners method to your apiService
      const response: BannersResponse = await apiService.getBanners(page, 10);
      
      if (response.success) {
        setBanners(response.data);
        setTotalPages(response.meta?.totalPages || 1);
        setTotalBanners(response.meta?.total || 0);
        setCurrentPage(page);
      }
    } catch (error) {
      console.error('Error fetching banners:', error);
      toast({
        title: "Error",
        description: "Failed to fetch banners",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchBanners(newPage);
    }
  };

  const resetForm = () => {
    setFiles([]);
    setMetadata({ title: "", description: "", category: "", tags: [] });
    setCurrentTag("");
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map((file) => {
      const fileWithId = Object.assign(file, {
        id: Math.random().toString(36).substring(7),
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
      });
      return fileWithId;
    });
    setFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': ['.mp4', '.mov', '.avi', '.mkv'],
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
    },
    multiple: true,
  });

  const removeFile = (fileId: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== fileId));
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('video/')) return Video;
    if (file.type === 'application/pdf') return FileText;
    if (file.type.startsWith('image/')) return ImageIcon;
    return File;
  };

  const addTag = () => {
    if (currentTag.trim() && !metadata.tags.includes(currentTag.trim())) {
      setMetadata(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }));
      setCurrentTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setMetadata(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      toast({
        title: "No files selected",
        description: "Please select files to upload.",
        variant: "destructive",
      });
      return;
    }

    if (!metadata.title || !metadata.description || !metadata.category) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      setFormLoading(true);
      
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('title', metadata.title);
      formData.append('description', metadata.description);
      formData.append('category', metadata.category);
      formData.append('tags', JSON.stringify(metadata.tags));
      
      files.forEach((file) => {
        formData.append('files', file);
      });

      // You'll need to add createBanner method to your apiService
      const response = await apiService.createBanner(formData);
      
      if (response.success) {
        toast({
          title: "Upload successful",
          description: "Banner has been uploaded successfully.",
        });
        setIsAddDialogOpen(false);
        resetForm();
        fetchBanners(currentPage); // Refresh the list
      }
    } catch (error) {
      console.error('Error uploading banner:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload banner. Please try again.",
        variant: "destructive",
      });
    } finally {
      setFormLoading(false);
    }
  };

  const openAddDialog = () => {
    resetForm();
    setIsAddDialogOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
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
            <h1 className="text-3xl font-bold tracking-tight">Banners ({totalBanners})</h1>
            <p className="text-muted-foreground">
              Manage and view all uploaded banners.
            </p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openAddDialog}>
                <Plus className="mr-2 h-4 w-4" />
                Add Banner
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Upload Banner</DialogTitle>
                <DialogDescription>
                  Upload new banner videos and images with metadata.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>File Upload</CardTitle>
                    <CardDescription>
                      Drag and drop files or click to browse. Supports videos (MP4, MOV) and images.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div
                      {...getRootProps()}
                      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                        ${isDragActive 
                          ? 'border-primary bg-primary/5' 
                          : 'border-muted-foreground/25 hover:border-primary hover:bg-primary/5'
                        }`}
                    >
                      <input {...getInputProps()} />
                      {isDragActive ? (
                        <p className="text-primary font-medium">Drop the files here ...</p>
                      ) : (
                        <div className="space-y-4">
                          <UploadIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                          <div>
                            <p className="text-lg font-medium">Drop files here or click to browse</p>
                            <p className="text-sm text-muted-foreground">
                              Supports: MP4, MOV, AVI, MKV, PNG, JPG, JPEG, GIF, WEBP, PDF
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {files.length > 0 && (
                      <div className="mt-6 space-y-3">
                        <h3 className="font-medium">Uploaded Files ({files.length})</h3>
                        {files.map((file) => {
                          const Icon = getFileIcon(file);
                          return (
                            <div key={file.id} className="flex items-center justify-between p-3 border rounded-lg">
                              <div className="flex items-center space-x-3">
                                <Icon className="h-5 w-5 text-muted-foreground" />
                                <div>
                                  <p className="font-medium text-sm">{file.name}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {(file.size / 1024 / 1024).toFixed(2)} MB
                                  </p>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeFile(file.id)}
                                className="h-8 w-8"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Content Details</CardTitle>
                    <CardDescription>
                      Add titles, descriptions, and your content.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        placeholder="Enter content title"
                        value={metadata.title}
                        onChange={(e) => setMetadata(prev => ({ ...prev, title: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Describe your content"
                        value={metadata.description}
                        onChange={(e) => setMetadata(prev => ({ ...prev, description: e.target.value }))}
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Input
                        id="category"
                        placeholder="Enter category"
                        value={metadata.category}
                        onChange={(e) => setMetadata(prev => ({ ...prev, category: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tags">Tags</Label>
                      <div className="flex space-x-2">
                        <Input
                          id="tags"
                          placeholder="Add tags"
                          value={currentTag}
                          onChange={(e) => setCurrentTag(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                        />
                        <Button type="button" onClick={addTag} variant="outline">
                          Add
                        </Button>
                      </div>
                      {metadata.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {metadata.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="cursor-pointer">
                              {tag}
                              <X
                                className="ml-1 h-3 w-3"
                                onClick={() => removeTag(tag)}
                              />
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    <Button onClick={handleUpload} className="w-full" disabled={files.length === 0 || formLoading}>
                      {formLoading ? "Uploading..." : `Upload ${files.length > 0 ? `${files.length} file(s)` : ""}`}
                    </Button>
                  </CardContent>
                </Card>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
        
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead>Files</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {banners.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      No banners found.
                    </TableCell>
                  </TableRow>
                ) : (
                  banners.map((banner) => (
                    <TableRow key={banner._id}>
                      <TableCell className="font-medium">{banner.title}</TableCell>
                      <TableCell className="max-w-xs truncate">{banner.description}</TableCell>
                      <TableCell>{banner.category}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {banner.tags.slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {banner.tags.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{banner.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{banner.files.length} files</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          banner.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}>
                          {banner.isActive ? "Active" : "Inactive"}
                        </span>
                      </TableCell>
                      <TableCell>{formatDate(banner.createdAt)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {/* Handle edit */}}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {/* Handle delete */}}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}