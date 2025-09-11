import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Image as ImageIcon, Search, Plus, Edit, Trash2, Eye, Grid, List } from "lucide-react";

interface ImageItem {
  id: string;
  title: string;
  description: string;
  category: string;
  dimensions: string;
  fileSize: string;
  uploadDate: string;
  tags: string[];
  alt: string;
}

const mockImages: ImageItem[] = [
  {
    id: "1",
    title: "Evening Gown Collection",
    description: "Elegant evening wear designs for formal occasions",
    category: "Portfolio",
    dimensions: "1920x1080",
    fileSize: "3.2 MB",
    uploadDate: "2024-01-15",
    tags: ["evening", "gown", "formal"],
    alt: "Elegant evening gown designs"
  },
  {
    id: "2", 
    title: "Street Style Inspiration",
    description: "Modern street fashion and casual wear concepts",
    category: "Inspiration",
    dimensions: "1600x900",
    fileSize: "2.8 MB", 
    uploadDate: "2024-01-12",
    tags: ["street", "casual", "modern"],
    alt: "Street style fashion inspiration"
  },
  {
    id: "3",
    title: "Fabric Texture Samples",
    description: "High-quality fabric textures for reference",
    category: "Reference",
    dimensions: "2048x1536",
    fileSize: "4.1 MB",
    uploadDate: "2024-01-10",
    tags: ["fabric", "texture", "reference"],
    alt: "Various fabric texture samples"
  }
];

export default function Images() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredImages = mockImages.filter(image => {
    const matchesSearch = image.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         image.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || image.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Images</h1>
            <p className="text-muted-foreground">
              Manage your fashion photography, designs, and reference images.
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Upload Images
          </Button>
        </div>

        <div className="flex gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search images..."
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
            <option value="Portfolio">Portfolio</option>
            <option value="Inspiration">Inspiration</option>
            <option value="Reference">Reference</option>
          </select>
          <div className="flex border rounded-md">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="rounded-r-none"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="rounded-l-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {viewMode === "grid" ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredImages.map((image) => (
              <Card key={image.id} className="overflow-hidden">
                <div className="relative group">
                  <div className="aspect-square bg-muted flex items-center justify-center">
                    <ImageIcon className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/20 transition-opacity">
                    <Button size="icon" variant="secondary">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                  <Badge className="absolute top-2 left-2" variant="secondary">
                    {image.category}
                  </Badge>
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base leading-tight">{image.title}</CardTitle>
                  <CardDescription className="text-sm line-clamp-2">
                    {image.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0 space-y-3">
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div>{image.dimensions} • {image.fileSize}</div>
                    <div>{new Date(image.uploadDate).toLocaleDateString()}</div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {image.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {image.tags.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{image.tags.length - 2}
                      </Badge>
                    )}
                  </div>

                  <div className="flex gap-1">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredImages.map((image) => (
              <Card key={image.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                        <ImageIcon className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <CardTitle className="text-lg">{image.title}</CardTitle>
                          <Badge variant="secondary">{image.category}</Badge>
                        </div>
                        <CardDescription className="mb-2">
                          {image.description}
                        </CardDescription>
                        <div className="flex items-center text-sm text-muted-foreground gap-4">
                          <span>{image.dimensions}</span>
                          <span>{image.fileSize}</span>
                          <span>{new Date(image.uploadDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="mr-2 h-3 w-3" />
                        View
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
                    {image.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {filteredImages.length === 0 && (
          <div className="text-center py-12">
            <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">No images found</p>
            <p className="text-muted-foreground">Try adjusting your search or upload your first image.</p>
          </div>
        )}
      </div>
    </Layout>
  );
}