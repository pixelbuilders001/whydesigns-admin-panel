import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Plus, Edit, Trash2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiService } from "@/lib/api";
import type { Blog, CreateBlogResponse, GetBlogsResponse, UpdateBlogResponse, DeleteBlogResponse } from "@/lib/api";
import { Switch } from "@/components/ui/switch";
import { useToastAlert } from "@/components/AlertBox";


const Blogs = () => {
  const { showToast } = useToastAlert();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBlogs, setTotalBlogs] = useState(0);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    featuredImage: null as File | null,
    tags: "",
    status: "draft"
  });
  const { toast } = useToast();

  // Fetch blogs from API
  const fetchBlogs = async (page: number = 1) => {
    try {
      setLoading(true);
      const response = await apiService.getBlogs(page, 4);
      
      if (response.success) {
        setBlogs(response.data);
        setTotalPages(response.meta?.totalPages || 1);
        setTotalBlogs(response.meta?.total || 0);
        setCurrentPage(page);
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
      toast({
        title: "Error",
        description: "Failed to fetch blogs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchBlogs(newPage);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      content: "",
      excerpt: "",
      featuredImage: null,
      tags: "",
      status: "draft"
    });
  };

  const handleAddBlog = async () => {
    if (!formData.title || !formData.content || !formData.slug) {
      toast({
        title: "Error",
        description: "Please fill in all required fields (title, slug, content).",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('slug', formData.slug);
      submitData.append('content', formData.content);
      submitData.append('excerpt', formData.excerpt || "");
      submitData.append('tags', formData.tags || "[]");
      submitData.append('status', formData.status);

      if (formData.featuredImage) {
        submitData.append('featuredImage', formData.featuredImage);
      }

      const response = await apiService.createBlog(submitData);

      if (response.success) {
        toast({
          title: "Success",
          description: response.message,
        });
        setIsAddDialogOpen(false);
        resetForm();
        fetchBlogs(); // Refresh the list
      }
    } catch (error) {
      console.error('Error creating blog:', error);
      toast({
        title: "Error",
        description: "Failed to create blog",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditBlog = async () => {
    if (!editingBlog) return;

    if (!formData.title || !formData.content || !formData.slug) {
      toast({
        title: "Error",
        description: "Please fill in all required fields (title, slug, content).",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('slug', formData.slug);
      submitData.append('content', formData.content);
      submitData.append('excerpt', formData.excerpt || "");
      submitData.append('tags', formData.tags || "[]");
      submitData.append('status', formData.status);

      if (formData.featuredImage) {
        submitData.append('featuredImage', formData.featuredImage);
      }

      const response = await apiService.updateBlog(editingBlog.id, submitData);

      if (response.success) {
        toast({
          title: "Success",
          description: response.message,
        });
        setIsEditDialogOpen(false);
        setEditingBlog(null);
        resetForm();
        fetchBlogs(currentPage); // Refresh the current page
      }
    } catch (error) {
      console.error('Error updating blog:', error);
      toast({
        title: "Error",
        description: "Failed to update blog",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBlog = async (blog: any) => {
    if(blog.status==='published'){
      showToast("You can’t delete active or published items. Please make it inactive first.", "warning");
      return;
    }
    try {
      setDeleteLoading(true);
      const response = await apiService.deleteBlog(blog.id);

      if (response.success) {
        toast({
          title: "Success",
          description: response.message,
        });
        fetchBlogs(currentPage); // Refresh the current page
      }
    } catch (error) {
      console.error('Error deleting blog:', error);
      toast({
        title: "Error",
        description: "Failed to delete blog",
        variant: "destructive",
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  const openEditDialog = (blog: Blog) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title,
      slug: blog.slug,
      content: blog.content,
      excerpt: blog.excerpt,
      featuredImage: null,
      tags: blog.tags?.join(", ") || "",
      status: blog.status
    });
    setIsEditDialogOpen(true);
  };

  const openAddDialog = () => {
    setIsAddDialogOpen(true);
    resetForm()
  };

  // Helper function to generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
  };

  const handleTitleChange = (title: string) => {
    setFormData({
      ...formData,
      title,
      slug: generateSlug(title)
    });
  };

  const handleToggleBlogPublish = async (id: string, status: string) => {
    try {
      setLoading(true);
      let response;
      if (status === 'published') {
        // Blog is currently published, so unpublish it
        response = await apiService.unpublishBlog(id);
        toast({
          title: "Success",
          description: "Blog unpublished successfully",
        });
      } else {
        // Blog is currently draft, so publish it
        response = await apiService.publishBlog(id);
        toast({
          title: "Success",
          description: "Blog published successfully",
        });
      }

      if (response.success) {
        fetchBlogs(currentPage); // Refresh the current page
      }
    } catch (error) {
      console.error('Error updating blog:', error);
      toast({
        title: "Error",
        description: "Failed to update blog",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Blogs ({totalBlogs})</h1>
            <p className="text-muted-foreground">
              Manage and view all blog posts.
            </p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openAddDialog}>
                <Plus className="mr-2 h-4 w-4" />
                Add Blog
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[900px] max-h-[85vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Blog</DialogTitle>
                <DialogDescription>
                  Create a new blog post. Fill in the details below.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-3 py-3">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="Enter blog title"
                  />
                </div>
                {/* <div className="grid gap-2">
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="Enter blog slug"
                  />
                </div> */}
                <div className="grid gap-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Enter blog content"
                    rows={4}
                  />
                </div>
                {/* <div className="grid gap-2">
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Textarea
                    id="excerpt"
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    placeholder="Enter blog excerpt"
                    rows={2}
                  />
                </div> */}
                <div className="grid gap-2">
                  <Label htmlFor="featuredImage">Featured Image</Label>
                  <Input
                    id="featuredImage"
                    type="file"
                    onChange={(e) => setFormData({ ...formData, featuredImage: e.target.files?.[0] || null })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="tags">Tags</Label>
                  <Input
                    id="tags"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="Enter blog tags (comma separated)"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as "draft" | "published" })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddBlog} disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Blog
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Loading state */}
        {loading && (
          <Card>
            <CardContent className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin mr-2" />
              <span>Loading blogs...</span>
            </CardContent>
          </Card>
        )}

        {/* Empty state */}
        {!loading && blogs.length === 0 && (
          <Card>
            <CardContent className="flex items-center justify-center py-8">
              <span>No blogs found. Create your first blog!</span>
            </CardContent>
          </Card>
        )}

        {/* Blogs table */}
        {!loading && blogs.length > 0 && (
          <Card>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Published</TableHead>
                    <TableHead>Views</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {blogs.map((blog) => (
                    <TableRow key={blog.id}>
                      <TableCell className="font-medium">{blog.title}</TableCell>
                      <TableCell>{blog.authorId?.fullName || 'Unknown'}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          blog.status === 'published'
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}>
                          {blog.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        {blog.publishedAt ? new Date(blog.publishedAt).toLocaleDateString() : 'Not published'}
                      </TableCell>
                      <TableCell>{blog.viewCount || 0}</TableCell>
                      <TableCell>{new Date(blog.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                        <Switch
                            checked={blog.status === 'published'}
                            onCheckedChange={(checked) => {
                              const newStatus = checked ? 'published' : 'draft';
                              handleToggleBlogPublish(blog.id, blog.status);
                            }}
                            title={blog.status === 'published' ? 'Unpublish blog' : 'Publish blog'}
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditDialog(blog)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure you want to delete this post?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete the blog post "{blog.title}".
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleDeleteBlog(blog)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  disabled={deleteLoading}
                                >
                                  {deleteLoading ? (
                                    <>
                                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                      Deleting...
                                    </>
                                  ) : (
                                    "Delete Post"
                                  )}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
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
        )}

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[900px] max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Blog</DialogTitle>
              <DialogDescription>
                Update the blog post details below.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-3 py-3">
              <div className="grid gap-2">
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Enter blog title"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-slug">Slug</Label>
                <Input
                  id="edit-slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="Enter blog slug"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-content">Content</Label>
                <Textarea
                  id="edit-content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Enter blog content"
                  rows={4}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-excerpt">Excerpt</Label>
                <Textarea
                  id="edit-excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="Enter blog excerpt"
                  rows={2}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-featuredImage">Featured Image</Label>
                <Input
                  id="edit-featuredImage"
                  type="file"
                  onChange={(e) => setFormData({ ...formData, featuredImage: e.target.files?.[0] || null })}
                />
                {editingBlog?.featuredImage && (
                  <p className="text-sm text-muted-foreground">
                    Current image: {editingBlog.featuredImage}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-tags">Tags</Label>
                <Input
                  id="edit-tags"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="Enter blog tags (comma separated)"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-status">Status</Label>
                <select
                  id="edit-status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as "draft" | "published" })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditBlog} disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update Blog
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Blogs;