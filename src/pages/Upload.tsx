import { useState, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload as UploadIcon, File, X, Image as ImageIcon, Plus, Edit, Trash2, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";
import { Layout } from "@/components/Layout";
import { apiService } from "@/lib/api";
import type { BannerData, CreateBannerResponse, BannersResponse } from "@/lib/api";
import { AlertDialogTrigger } from "@radix-ui/react-alert-dialog";
import { Switch } from "@/components/ui/switch";
import { useToastAlert } from "@/components/AlertBox";


type Banner = BannerData;

export default function Upload() {
  const { showToast } = useToastAlert();
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [metadata, setMetadata] = useState({
    title: "",
    description: "",
    image: null as File | null,
  });
  const { toast } = useToast();

  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBanners, setTotalBanners] = useState(0);

  // Fetch banners from API
  const fetchBanners = async (page: number = 1) => {
    try {
      setLoading(true);
      const response: BannersResponse = await apiService.getBanners(page, 10);
      
      if (response.success) {
        setBanners(response.data.banners);
        setTotalPages(response.data?.totalPages || 1);
        setTotalBanners(response.data?.total || 0);
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
    setMetadata({ title: "", description: "", image: null });
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // For single image, only take the first file
    const newFile = acceptedFiles[0];
    if (newFile) {
      const fileWithId = Object.assign(newFile, {
        id: Math.random().toString(36).substring(7),
        preview: newFile.type.startsWith('image/') ? URL.createObjectURL(newFile) : undefined,
      });
      setFiles([fileWithId]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
    },
    multiple: false,
  });

  const removeFile = (fileId: string) => {
    setFiles([]);
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return ImageIcon;
    }
    return File;
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      toast({
        title: "No image selected",
        description: "Please select an image to upload.",
        variant: "destructive",
      });
      return;
    }

    if (!metadata.title || !metadata.description) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      setFormLoading(true);
      
      const formData = new FormData();
      formData.append('title', metadata.title);
      formData.append('description', metadata.description);
      
      if (files.length > 0) {
        formData.append('image', files[0]);
      }

      const response = await apiService.createBanner(formData);
      
      if (response.success) {
        toast({
          title: "Success",
          description: "Banner has been created successfully.",
        });
        setIsAddDialogOpen(false);
        resetForm();
        fetchBanners(currentPage);
      }
    } catch (error) {
      console.error('Error creating banner:', error);
      toast({
        title: "Upload failed",
        description: "Failed to create banner. Please try again.",
        variant: "destructive",
      });
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditBanner = async () => {
    if (!editingBanner) return;

    if (!metadata.title || !metadata.description) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      setFormLoading(true);
      
      const formData = new FormData();
      formData.append('title', metadata.title);
      formData.append('description', metadata.description);
      
      if (files.length > 0) {
        formData.append('image', files[0]);
      }

      const response = await apiService.updateBanner(editingBanner._id, formData);
      
      if (response.success) {
        toast({
          title: "Success",
          description: "Banner has been updated successfully.",
        });
        setIsEditDialogOpen(false);
        setEditingBanner(null);
        resetForm();
        fetchBanners(currentPage);
      }
    } catch (error) {
      console.error('Error updating banner:', error);
      toast({
        title: "Update failed",
        description: "Failed to update banner. Please try again.",
        variant: "destructive",
      });
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteBanner = async (id: string) => {

    try {
      setDeleteLoading(true);
      const response = await apiService.deleteBanner(id);

      if (response.success) {
        toast({
          title: "Success",
          description: response.message || "Banner deleted successfully",
        });
        fetchBanners(currentPage);
      }
    } catch (error) {
      console.error('Error deleting banner:', error);
      toast({
        title: "Error",
        description: "Failed to delete banner",
        variant: "destructive",
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  const openEditDialog = (banner: Banner) => {
    setEditingBanner(banner);
    setMetadata({
      title: banner.title,
      description: banner.description,
      image: null,
    });
    setFiles([]);
    setIsEditDialogOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleToggleBlogPublish = async (id: string, currentStatus: boolean) => {
    console.log("New publish status:", currentStatus); // <-- now will be true/false correctly
    try {
      // Optimistically update UI
      setBanners((prevBanners) =>
        prevBanners.map((b) =>
          b._id === id ? { ...b, isPublished: currentStatus } : b
        )
      );
  
      // Call appropriate API
      if (currentStatus) {
        await apiService.unpublishBanner(id);
        fetchBanners();
      } else {
        await apiService.publishBanner(id);
        fetchBanners();
      }
    } catch (err) {
      console.error("Error toggling publish:", err);
  
      // Revert if failed
      setBanners((prevBanners) =>
        prevBanners.map((b) =>
          b._id === id ? { ...b, isPublished: !currentStatus } : b
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
            <h1 className="text-3xl font-bold tracking-tight">Banners ({totalBanners})</h1>
            <p className="text-muted-foreground">
              Manage and view all uploaded banners.
            </p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                resetForm();
                setIsAddDialogOpen(true);
              }}>
                <Plus className="mr-2 h-4 w-4" />
                Add Banner
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[900px] max-h-[85vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Banner</DialogTitle>
                <DialogDescription>
                  Create a new banner. Fill in the details below.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Image Upload</CardTitle>
                    <CardDescription>
                      Drag and drop an image or click to browse. Supports images only.
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
                        <p className="text-primary font-medium">Drop the image here ...</p>
                      ) : (
                        <div className="space-y-4">
                          <UploadIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                          <div>
                            <p className="text-lg font-medium">Drop image here or click to browse</p>
                            <p className="text-sm text-muted-foreground">
                              Supports: PNG, JPG, JPEG, GIF, WEBP
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {files.length > 0 && (
                      <div className="mt-6 space-y-3">
                        <h3 className="font-medium">Selected Image</h3>
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
                    <CardTitle>Banner Details</CardTitle>
                    <CardDescription>
                      Add title, description, and select an image for your banner.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title *</Label>
                      <Input
                        id="title"
                        placeholder="Enter banner title"
                        value={metadata.title}
                        onChange={(e) => setMetadata(prev => ({ ...prev, title: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description *</Label>
                      <Textarea
                        id="description"
                        placeholder="Enter banner description"
                        value={metadata.description}
                        onChange={(e) => setMetadata(prev => ({ ...prev, description: e.target.value }))}
                        rows={3}
                      />
                    </div>

                    <Button onClick={handleUpload} className="w-full" disabled={files.length === 0 || formLoading}>
                      {formLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {formLoading ? "Creating..." : `Create Banner`}
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

          {/* Edit Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="sm:max-w-[900px] max-h-[85vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Banner</DialogTitle>
                <DialogDescription>
                  Edit the banner details below.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Image Upload</CardTitle>
                    <CardDescription>
                      Drag and drop an image or click to browse. Supports images only.
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
                        <p className="text-primary font-medium">Drop the image here ...</p>
                      ) : (
                        <div className="space-y-4">
                          <UploadIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                          <div>
                            <p className="text-lg font-medium">Drop image here or click to browse</p>
                            <p className="text-sm text-muted-foreground">
                              Supports: PNG, JPG, JPEG, GIF, WEBP
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {files.length > 0 && (
                      <div className="mt-6 space-y-3">
                        <h3 className="font-medium">Selected Image</h3>
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
                    <CardTitle>Banner Details</CardTitle>
                    <CardDescription>
                      Edit title, description, and select an image for your banner.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-title">Title *</Label>
                      <Input
                        id="edit-title"
                        placeholder="Enter banner title"
                        value={metadata.title}
                        onChange={(e) => setMetadata(prev => ({ ...prev, title: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="edit-description">Description *</Label>
                      <Textarea
                        id="edit-description"
                        placeholder="Enter banner description"
                        value={metadata.description}
                        onChange={(e) => setMetadata(prev => ({ ...prev, description: e.target.value }))}
                        rows={3}
                      />
                    </div>

                    <Button onClick={handleEditBanner} className="w-full" disabled={formLoading}>
                      {formLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {formLoading ? "Updating..." : `Update Banner`}
                    </Button>
                  </CardContent>
                </Card>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
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
                  <TableHead>Image</TableHead>
                  {/* <TableHead>Link</TableHead> */}
                  {/* <TableHead>Status</TableHead> */}
                  <TableHead>Published</TableHead>
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
                      <TableCell>
                        <img src={banner.imageUrl} alt={banner.altText} className="w-16 h-16 object-cover rounded" />
                      </TableCell>
                      {/* <TableCell className="max-w-xs truncate">{banner.link}</TableCell> */}
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          banner.isPublished
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}>
                          {banner.isPublished ? "Published" : "Draft"}
                        </span>
                      </TableCell>
                      <TableCell>
                        {banner.publishedAt ? new Date(banner.publishedAt).toLocaleDateString() : 'Not published'}
                      </TableCell>
                      <TableCell>{formatDate(banner.createdAt)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                        <Switch
                            checked={banner.isPublished}
                            onCheckedChange={(checked) => {
                              const newStatus = checked ? 'published' : 'draft';
                              handleToggleBlogPublish(banner.id, banner.isPublished);
                            }}
                            title={banner.isPublished ? 'Unpublish blog' : 'Publish blog'}
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditDialog(banner)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure you want to delete this banner?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete the banner "{banner.title}".
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => {if(banner.isPublished){
                                    showToast("You can’t delete active or published items. Please make it inactive first.", "warning");
                      return;
                                  }else{ handleDeleteBanner(banner._id)}}}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  disabled={deleteLoading}
                                >
                                  {deleteLoading ? (
                                    <>
                                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                      Deleting...
                                    </>
                                  ) : (
                                    "Delete Banner"
                                  )}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
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