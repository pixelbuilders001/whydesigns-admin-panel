import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Search, Plus, Edit, Trash2, Download, Eye, Upload } from "lucide-react";

interface PDFItem {
  id: string;
  title: string;
  description: string;
  category: string;
  fileSize: string;
  downloads: number;
  uploadDate: string;
  tags: string[];
}

interface FormData {
  title: string;
  description: string;
  category: string;
  file: File | null;
  tags: string;
}

const mockPDFs: PDFItem[] = [
  {
    id: "1",
    title: "Fashion Sketching Guide",
    description: "Complete guide to technical fashion illustration and sketching techniques",
    category: "Study Materials",
    fileSize: "2.4 MB",
    downloads: 450,
    uploadDate: "2024-01-15",
    tags: ["sketching", "illustration", "guide"]
  },
  {
    id: "2", 
    title: "Fabric Encyclopedia",
    description: "Comprehensive reference for different fabric types and their properties",
    category: "Reference",
    fileSize: "8.7 MB",
    downloads: 320,
    uploadDate: "2024-01-12",
    tags: ["fabric", "reference", "materials"]
  },
  {
    id: "3",
    title: "Spring Collection Lookbook",
    description: "Complete lookbook featuring the latest spring fashion trends",
    category: "Lookbooks",
    fileSize: "15.2 MB",
    downloads: 890,
    uploadDate: "2024-01-08",
    tags: ["spring", "lookbook", "trends"]
  }
];

export default function PDFs() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingPDF, setEditingPDF] = useState<PDFItem | null>(null);
  const [pdfs, setPdfs] = useState<PDFItem[]>(mockPDFs);

  // Form state for add/edit
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    category: "",
    file: null,
    tags: ""
  });

  const filteredPDFs = pdfs.filter(pdf => {
    const matchesSearch = pdf.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pdf.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || pdf.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Handler functions
  const handleAddPDF = () => {
    setFormData({
      title: "",
      description: "",
      category: "",
      file: null,
      tags: ""
    });
    setIsAddModalOpen(true);
  };

  const handleEditPDF = (pdf: PDFItem) => {
    setEditingPDF(pdf);
    setFormData({
      title: pdf.title,
      description: pdf.description,
      category: pdf.category,
      file: null,
      tags: pdf.tags.join(", ")
    });
    setIsEditModalOpen(true);
  };

  const handleDeletePDF = (id: string) => {
    if (window.confirm("Are you sure you want to delete this PDF?")) {
      setPdfs(pdfs.filter(pdf => pdf.id !== id));
    }
  };

  const handleSubmitAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.category || !formData.file) {
      alert("Please fill all required fields and select a file");
      return;
    }

    const newPDF: PDFItem = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      category: formData.category,
      fileSize: "0 MB", // In a real app, this would be calculated from the file
      downloads: 0,
      uploadDate: new Date().toISOString().split('T')[0],
      tags: formData.tags.split(",").map(tag => tag.trim()).filter(tag => tag)
    };

    setPdfs([...pdfs, newPDF]);
    setIsAddModalOpen(false);
    setFormData({
      title: "",
      description: "",
      category: "",
      file: null,
      tags: ""
    });
  };

  const handleSubmitEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPDF || !formData.title || !formData.description || !formData.category) {
      alert("Please fill all required fields");
      return;
    }

    const updatedPDF: PDFItem = {
      ...editingPDF,
      title: formData.title,
      description: formData.description,
      category: formData.category,
      tags: formData.tags.split(",").map(tag => tag.trim()).filter(tag => tag)
    };

    setPdfs(pdfs.map(pdf => pdf.id === editingPDF.id ? updatedPDF : pdf));
    setIsEditModalOpen(false);
    setEditingPDF(null);
    setFormData({
      title: "",
      description: "",
      category: "",
      file: null,
      tags: ""
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setFormData({ ...formData, file });
    } else {
      alert("Please select a valid PDF file");
      e.target.value = "";
    }
  };

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">PDF Materials</h1>
            <p className="text-muted-foreground">
              Manage your study guides, lookbooks, and reference materials.
            </p>
          </div>
          <Button onClick={handleAddPDF}>
            <Plus className="mr-2 h-4 w-4" />
            Upload PDF
          </Button>
        </div>

        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search PDFs..."
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
            <option value="Study Materials">Study Materials</option>
            <option value="Reference">Reference</option>
            <option value="Lookbooks">Lookbooks</option>
          </select>
        </div>

        <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filteredPDFs.map((pdf) => (
            <Card key={pdf.id} className="overflow-hidden">
              <div className="relative">
                <div className="aspect-[16/10] bg-muted flex items-center justify-center">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                </div>
              </div>
              <CardHeader className="pb-2 p-3">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-sm leading-tight line-clamp-2 flex-1">{pdf.title}</CardTitle>
                  <Badge variant="secondary" className="text-xs shrink-0">{pdf.category}</Badge>
                </div>
                <CardDescription className="line-clamp-2 text-xs">
                  {pdf.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0 space-y-2 p-3">
                <div className="flex items-center text-xs text-muted-foreground gap-3">
                  <span>{pdf.fileSize}</span>
                  <div className="flex items-center gap-1">
                    <Download className="h-3 w-3" />
                    {pdf.downloads}
                  </div>
                  <span>{new Date(pdf.uploadDate).toLocaleDateString()}</span>
                </div>
                
                <div className="flex flex-wrap gap-1">
                  {pdf.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {pdf.tags.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{pdf.tags.length - 2}
                    </Badge>
                  )}
                </div>

                <div className="flex gap-1">
                  <Button size="sm" variant="outline" className="flex-1 text-xs px-2">
                    <Eye className="mr-1 h-3 w-3" />
                    Preview
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 text-xs px-2" onClick={() => handleEditPDF(pdf)}>
                    <Edit className="mr-1 h-3 w-3" />
                    Edit
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 text-xs px-2" onClick={() => handleDeletePDF(pdf.id)}>
                    <Trash2 className="mr-1 h-3 w-3" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPDFs.length === 0 && (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">No PDFs found</p>
            <p className="text-muted-foreground">Try adjusting your search or upload your first PDF.</p>
          </div>
        )}
      </div>

      {/* Add PDF Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New PDF</DialogTitle>
            <DialogDescription>
              Upload a new PDF document and provide its details.
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
                  placeholder="Enter PDF title"
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
                    <SelectItem value="Study Materials">Study Materials</SelectItem>
                    <SelectItem value="Reference">Reference</SelectItem>
                    <SelectItem value="Lookbooks">Lookbooks</SelectItem>
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
              <Button type="submit">Add PDF</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit PDF Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit PDF</DialogTitle>
            <DialogDescription>
              Update the PDF details and optionally replace the PDF file.
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
                  placeholder="Enter PDF title"
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
                    <SelectItem value="Study Materials">Study Materials</SelectItem>
                    <SelectItem value="Reference">Reference</SelectItem>
                    <SelectItem value="Lookbooks">Lookbooks</SelectItem>
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
              <Button type="submit">Update PDF</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}