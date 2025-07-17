
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  FileText, 
  Search, 
  Filter,
  Download,
  Calendar,
  Folder,
  ChevronDown,
  ChevronRight,
  Pin,
  Zap,
  Droplets,
  Trash2,
  Building,
  AlertCircle
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const Documents = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    pinned: true,
    recent: true
  });

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "electricity", label: "Electricity" },
    { value: "water", label: "Water & Sanitation" },
    { value: "waste", label: "Waste Management" },
    { value: "transport", label: "Transportation" },
    { value: "planning", label: "Urban Planning" },
    { value: "emergency", label: "Emergency Services" }
  ];

  const pinnedDocuments = [
    {
      id: 1,
      title: "Emergency Contact Numbers",
      description: "Important phone numbers for police, fire, medical, and municipal services",
      category: "emergency",
      date: "2024-01-15",
      size: "245 KB",
      downloads: 1250,
      type: "announcement",
      urgent: true
    },
    {
      id: 2,
      title: "Water Supply Schedule - January 2024",
      description: "Updated water supply timings for all zones in the city",
      category: "water",
      date: "2024-01-10",
      size: "1.2 MB",
      downloads: 890,
      type: "document",
      urgent: false
    }
  ];

  const documents = [
    {
      id: 3,
      title: "Power Outage Schedule - January 2024",
      description: "Planned electricity maintenance and outage schedules",
      category: "electricity",
      date: "2024-01-18",
      size: "892 KB",
      downloads: 456,
      type: "document",
      urgent: false
    },
    {
      id: 4,
      title: "New Bus Route Announcements",
      description: "Additional bus routes and timings effective from February 1st",
      category: "transport",
      date: "2024-01-17",
      size: "634 KB",
      downloads: 234,
      type: "announcement",
      urgent: false
    },
    {
      id: 5,
      title: "Waste Collection Guidelines 2024",
      description: "Updated guidelines for household waste segregation and collection",
      category: "waste",
      date: "2024-01-16",
      size: "1.8 MB",
      downloads: 678,
      type: "document",
      urgent: false
    },
    {
      id: 6,
      title: "City Development Plan Draft",
      description: "Public consultation document for the 2024-2029 development plan",
      category: "planning",
      date: "2024-01-14",
      size: "5.2 MB",
      downloads: 123,
      type: "document",
      urgent: false
    },
    {
      id: 7,
      title: "Property Tax Payment Portal",
      description: "Online property tax payment system launch announcement",
      category: "planning",
      date: "2024-01-12",
      size: "345 KB",
      downloads: 567,
      type: "announcement",
      urgent: false
    },
    {
      id: 8,
      title: "Monsoon Preparedness Guidelines",
      description: "Citizen guidelines for monsoon season safety and preparedness",
      category: "emergency",
      date: "2024-01-11",
      size: "2.1 MB",
      downloads: 789,
      type: "document",
      urgent: false
    }
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'electricity':
        return Zap;
      case 'water':
        return Droplets;
      case 'waste':
        return Trash2;
      case 'transport':
        return Building;
      case 'planning':
        return Building;
      case 'emergency':
        return AlertCircle;
      default:
        return FileText;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'electricity':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'water':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
      case 'waste':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
      case 'transport':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300';
      case 'planning':
        return 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300';
      case 'emergency':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const getTypeColor = (type: string) => {
    return type === 'announcement' 
      ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300'
      : 'bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-300';
  };

  const allDocuments = [...pinnedDocuments, ...documents];
  const filteredDocuments = allDocuments.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const DocumentCard = ({ document, isPinned = false }: { document: any, isPinned?: boolean }) => {
    const CategoryIcon = getCategoryIcon(document.category);
    
    return (
      <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start space-x-3 flex-1">
              <div className="w-10 h-10 bg-gradient-to-r from-teal-100 to-blue-100 dark:from-teal-900/50 dark:to-blue-900/50 rounded-lg flex items-center justify-center">
                <CategoryIcon className="h-5 w-5 text-teal-600 dark:text-teal-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    {document.title}
                  </h3>
                  {isPinned && (
                    <Pin className="h-4 w-4 text-amber-500" />
                  )}
                  {document.urgent && (
                    <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300">
                      Urgent
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
                  {document.description}
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className={getCategoryColor(document.category)}>
                    {categories.find(c => c.value === document.category)?.label}
                  </Badge>
                  <Badge className={getTypeColor(document.type)}>
                    {document.type.charAt(0).toUpperCase() + document.type.slice(1)}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-center space-x-4 text-sm text-slate-600 dark:text-slate-400">
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{new Date(document.date).toLocaleDateString()}</span>
              </div>
              <div>Size: {document.size}</div>
              <div>{document.downloads} downloads</div>
            </div>
            <Button size="sm" className="bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Documents & Announcements
          </h1>
          <p className="text-slate-600 dark:text-slate-300">
            Access important civic documents and community announcements
          </p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white dark:bg-slate-800"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-48 bg-white dark:bg-slate-800">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-slate-800">
            {categories.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Pinned Documents */}
      <Collapsible 
        open={expandedSections.pinned} 
        onOpenChange={() => toggleSection('pinned')}
      >
        <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
              <CardTitle className="flex items-center justify-between text-slate-900 dark:text-white">
                <div className="flex items-center space-x-2">
                  <Pin className="h-5 w-5 text-amber-500" />
                  <span>Pinned Documents</span>
                  <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                    {pinnedDocuments.length}
                  </Badge>
                </div>
                {expandedSections.pinned ? (
                  <ChevronDown className="h-5 w-5" />
                ) : (
                  <ChevronRight className="h-5 w-5" />
                )}
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4">
              {pinnedDocuments
                .filter(doc => {
                  const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                       doc.description.toLowerCase().includes(searchTerm.toLowerCase());
                  const matchesCategory = selectedCategory === "all" || doc.category === selectedCategory;
                  return matchesSearch && matchesCategory;
                })
                .map((document) => (
                  <DocumentCard key={document.id} document={document} isPinned={true} />
                ))}
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Recent Documents */}
      <Collapsible 
        open={expandedSections.recent} 
        onOpenChange={() => toggleSection('recent')}
      >
        <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
              <CardTitle className="flex items-center justify-between text-slate-900 dark:text-white">
                <div className="flex items-center space-x-2">
                  <Folder className="h-5 w-5" />
                  <span>Recent Documents</span>
                  <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                    {documents.length}
                  </Badge>
                </div>
                {expandedSections.recent ? (
                  <ChevronDown className="h-5 w-5" />
                ) : (
                  <ChevronRight className="h-5 w-5" />
                )}
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4">
              {documents
                .filter(doc => {
                  const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                       doc.description.toLowerCase().includes(searchTerm.toLowerCase());
                  const matchesCategory = selectedCategory === "all" || doc.category === selectedCategory;
                  return matchesSearch && matchesCategory;
                })
                .map((document) => (
                  <DocumentCard key={document.id} document={document} />
                ))}
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* No Results */}
      {filteredDocuments.length === 0 && (
        <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          <CardContent className="p-8 text-center">
            <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
              No documents found
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Try adjusting your search terms or category filter.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Documents;
