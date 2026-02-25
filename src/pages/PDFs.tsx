import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Search, Plus, Edit, Trash2, Download, Eye, Upload, Loader2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { apiService } from "@/lib/api";
import { useToastAlert } from "@/components/AlertBox";


interface PDFMaterial {
  id: string;
  name: string;
  description: string;
  fileUrl: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  category: string;
  tags: string[];
  isPublished: boolean;
  uploadedBy: {
    id: string;
    name: string;
    email: string;
  };
  downloadCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface PDFResponse {
  success: boolean;
  message: string;
  data: PDFMaterial[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface CreatePDFRequest {
  name: string;
  description: string;
  category: string;
  tags: string[];
  file: File;
}



export default function PDFs() {
  const { showToast } = useToastAlert();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingPDF, setEditingPDF] = useState<PDFMaterial | null>(null);
  const [pdfs, setPdfs] = useState<PDFMaterial[]>([]);
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPDFs, setTotalPDFs] = useState(0);
  const { toast } = useToast();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [pdfIdToDelete, setPdfIdToDelete] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState("all");

  // Form state for add/edit
  const [formData, setFormData] = useState<CreatePDFRequest>({
    name: "",
    description: "",
    category: "",
    tags: [],
    file: null
  });

  // Fetch PDFs from API
  const fetchPDFs = async (page: number = 1) => {
    try {
      setLoading(true);

      // Build query parameters
      const queryParams = new URLSearchParams();
      queryParams.append('page', String(page));
      queryParams.append('limit', String(8));
      if (searchTerm) {
        queryParams.append('name', searchTerm);  // Assuming the API uses 'name' for name-based search
      }
      if (selectedCategory !== "all") {
        queryParams.append('category', selectedCategory);
      }
      if (selectedStatus !== "all") {
        queryParams.append('isActive', String(selectedStatus === "active")); //API expects boolean
      }

      const response: PDFResponse = await apiService.getMaterials(queryParams.toString());

      if (response.success) {
        setPdfs(response.data);
        setTotalPages(response.meta.totalPages);
        setTotalPDFs(response.meta.total);
        setCurrentPage(page);
      }
    } catch (error) {
      console.error('Error fetching PDFs:', error);
      toast({
        title: "Error",
        description: "Failed to fetch PDFs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPDFs();
  }, [searchTerm, selectedCategory, selectedStatus]); // Refetch when these change

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage); // Update current page
  };

  useEffect(() => {
    fetchPDFs(currentPage);
  }, [currentPage])

  // Handler functions
  const handleAddPDF = () => {
    setFormData({
      name: "",
      description: "",
      category: "",
      tags: [],
      file: null
    });
    setIsAddModalOpen(true);
  };

  const handleEditPDF = (pdf: PDFMaterial) => {
    setEditingPDF(pdf);
    setFormData({
      name: pdf.name,
      description: pdf.description,
      category: pdf.category,
      tags: pdf.tags,
      file: null
    });
    setIsEditModalOpen(true);
  };

  const handleDeletePDF = (id: string) => {
    setPdfIdToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDeletePDF = async () => {
    setFormLoading(true);
    if (pdfIdToDelete) {
      try {
        await apiService.deleteMaterial(pdfIdToDelete);
        toast({
          title: "Success",
          description: "PDF deleted successfully",
        });
        fetchPDFs(currentPage);
        setFormLoading(false);
      } catch (error) {
        setFormLoading(false);
        console.error("Error deleting PDF:", error);
        toast({
          title: "Error",
          description: "Failed to delete PDF",
          variant: "destructive",
        });
      } finally {
        setFormLoading(false);
        setIsDeleteModalOpen(false);
        setPdfIdToDelete(null);
      }
    }
  };

  const cancelDeletePDF = () => {
    setIsDeleteModalOpen(false);
    setPdfIdToDelete(null);
  };

  const handleSubmitAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.description || !formData.category || !formData.file) {
      toast({
        title: "Error",
        description: "Please fill all required fields and select a file",
        variant: "destructive",
      });
      return;
    }

    try {
      setFormLoading(true);

      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('description', formData.description);
      submitData.append('category', formData.category);
      submitData.append('tags', JSON.stringify(formData.tags));
      submitData.append('file', formData.file);

      const response = await apiService.createMaterial(submitData);

      if (response.success) {
        toast({
          title: "Success",
          description: "PDF uploaded successfully",
        });
        setIsAddModalOpen(false);
        setFormData({
          name: "",
          description: "",
          category: "",
          tags: [],
          file: null
        });
        fetchPDFs(currentPage);
      }
    } catch (error) {
      console.error('Error uploading PDF:', error);
      toast({
        title: "Error",
        description: "Failed to upload PDF",
        variant: "destructive",
      });
    } finally {
      setFormLoading(false);
    }
  };

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPDF || !formData.name || !formData.description || !formData.category) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setFormLoading(true);

      const updateData = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        tags: formData.tags,
        file: formData.file
      };
      // console.log("updateData",updateData)
      const updateData1 = new FormData();
      updateData1.append('name', formData.name);
      updateData1.append('description', formData.description);
      updateData1.append('category', formData.category);
      updateData1.append('tags', JSON.stringify(formData.tags));
      updateData1.append('file', formData.file);



      const response = await apiService.updateMaterial(editingPDF.id, updateData1);

      if (response.success) {
        toast({
          title: "Success",
          description: "PDF updated successfully",
        });
        setIsEditModalOpen(false);
        setEditingPDF(null);
        setFormData({
          name: "",
          description: "",
          category: "",
          tags: [],
          file: null
        });
        fetchPDFs(currentPage);
      }
    } catch (error) {
      console.error('Error updating PDF:', error);
      toast({
        title: "Error",
        description: "Failed to update PDF",
        variant: "destructive",
      });
    } finally {
      setFormLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setFormData({ ...formData, file });
    } else {
      toast({
        title: "Invalid file type",
        description: "Please select a PDF file",
        variant: "destructive",
      });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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

  const handleTogglePDF = async (id: string, currentStatus: boolean) => {

    try {
      // Optimistically update UI
      setPdfs((prevPDFs) =>
        prevPDFs.map((p) =>
          p.id === id ? { ...p, isPublished: currentStatus } : p
        )
      );

      // Call appropriate API
      if (currentStatus) {
        await apiService.unpublishPdf(id);
        fetchPDFs();
      } else {
        await apiService.publishPdf(id);
        fetchPDFs();
      }
    } catch (err) {
      console.error("Error toggling publish:", err);

      // Revert if failed
      setPdfs((prevPDFs) =>
        prevPDFs.map((p) =>
          p.id === id ? { ...p, isPublished: !currentStatus } : p
        )
      );
    }
  };

  function formatCareerGuide(str) {
    // Remove underscores and capitalize first letter
    return str
      .replace(/_/g, ' ')
      .replace(/^\w/, firstChar => firstChar.toUpperCase());
  }
  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">PDF Materials({totalPDFs})</h1>
            <p className="text-muted-foreground">
              Manage and view all PDF materials and documents.
            </p>
          </div>
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAddPDF}>
                <Plus className="mr-2 h-4 w-4" />
                Add PDF
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New PDF</DialogTitle>
                <DialogDescription>
                  Upload a new PDF material with metadata.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmitAdd}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter PDF name"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Enter PDF description"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="career_guide">Career Guide</SelectItem>
                        <SelectItem value="study_abroad">Study Abroad</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="file">PDF File *</Label>
                    <Input
                      id="file"
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                    />
                  </div>
                  {/* <div className="grid gap-2">
                    <Label htmlFor="tags">Tags (comma separated)</Label>
                    <Input
                      id="tags"

                      value={formData?.tags?.join(", ")}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value.split(", ").filter(tag => tag) })}
                      placeholder="Enter tags separated by commas"
                    />
                  </div> */}
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={formLoading}>
                    {formLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Add PDF
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex flex-1 items-center space-x-2">
            {/* <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search PDFs by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div> */}
            {/* <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="career_guide">Career Guide</SelectItem>
                <SelectItem value="study_abroad">Study Abroad</SelectItem>
         
              </SelectContent>
            </Select> */}
            {/* <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select> */}
          </div>
        </div>

        {/* PDFs Table */}
        <Card>

          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>File Size</TableHead>
                  <TableHead>Downloads</TableHead>
                  <TableHead>Uploaded By</TableHead>
                  <TableHead>Published</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pdfs.map((pdf) => (
                  <TableRow key={pdf.id}>
                    <TableCell className="font-medium">{pdf.name}</TableCell>
                    <TableCell className="max-w-xs truncate">{pdf.description}</TableCell>
                    <TableCell>{formatCareerGuide(pdf.category)}</TableCell>
                    <TableCell>{formatFileSize(pdf.fileSize)}</TableCell>
                    <TableCell>{pdf.downloadCount}</TableCell>
                    <TableCell>{pdf.uploadedBy.name}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${pdf.isPublished
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                        }`}>
                        {pdf.isPublished ? "Published" : "Unpublished"}
                      </span>
                    </TableCell>
                    <TableCell>{new Date(pdf.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex gap-2 items-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => window.open(pdf.fileUrl, '_blank')}
                          title="View PDF"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditPDF(pdf)}
                          title="Edit PDF"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            if (pdf.isPublished) {
                              showToast("You can’t delete active or published items. Please make it inactive first.", "warning");
                              return;
                            } else {
                              handleDeletePDF(pdf.id)
                            }
                          }

                          }
                          title="Delete PDF"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <Switch
                          checked={pdf.isPublished}
                          onCheckedChange={(checked) => handleTogglePDF(pdf.id, pdf.isPublished)}
                          title={pdf.isPublished ? "Deactivate PDF" : "Activate PDF"}
                        />
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

        {/* Edit PDF Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Edit PDF</DialogTitle>
              <DialogDescription>
                Update the PDF details and optionally replace the PDF file.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmitEdit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-name">Name *</Label>
                  <Input
                    id="edit-name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter PDF name"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-description">Description *</Label>
                  <Textarea
                    id="edit-description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter PDF description"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {/* <SelectItem value="all">All</SelectItem> */}
                      <SelectItem value="career_guide">Career Guide</SelectItem>
                      <SelectItem value="study_abroad">Study Abroad</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-file">Replace PDF File (optional)</Label>
                  <Input
                    id="edit-file"
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                  />
                  <p className="text-xs text-muted-foreground">
                    Leave empty to keep the current PDF file
                  </p>
                </div>
                {/* <div className="grid gap-2">
                  <Label htmlFor="edit-tags">Tags (comma separated)</Label>
                  <Input
                    id="edit-tags"
                    disabled
                    value={formData?.tags?.join(", ")}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value.split(", ").filter(tag => tag) })}
                    placeholder="Enter tags separated by commas"
                  />
                </div> */}
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={formLoading}>
                  {formLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Update PDF
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        {/* Delete Confirmation Modal */}
        <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>Delete Confirmation</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this PDF? This action cannot be
                undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={cancelDeletePDF}>
                Cancel
              </Button>
              <Button type="button" variant="destructive" onClick={confirmDeletePDF}>
                {formLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}