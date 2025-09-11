import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { FileText, Search, Plus, Edit, Trash2, Download, Eye } from "lucide-react";

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

  const filteredPDFs = mockPDFs.filter(pdf => {
    const matchesSearch = pdf.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pdf.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || pdf.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
          <Button>
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

        <div className="grid gap-4">
          {filteredPDFs.map((pdf) => (
            <Card key={pdf.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <CardTitle className="text-lg">{pdf.title}</CardTitle>
                        <Badge variant="secondary">{pdf.category}</Badge>
                      </div>
                      <CardDescription className="mb-2">
                        {pdf.description}
                      </CardDescription>
                      <div className="flex items-center text-sm text-muted-foreground gap-4">
                        <span>{pdf.fileSize}</span>
                        <div className="flex items-center gap-1">
                          <Download className="h-4 w-4" />
                          {pdf.downloads} downloads
                        </div>
                        <span>{new Date(pdf.uploadDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="mr-2 h-3 w-3" />
                      Preview
                    </Button>
                    <Button size="sm" variant="outline">
                      <Edit className="mr-2 h-3 w-3" />
                      Edit
                    </Button>
                    <Button size="sm" variant="outline">
                      <Trash2 className="mr-2 h-3 w-3" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex flex-wrap gap-1">
                  {pdf.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
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
    </Layout>
  );
}