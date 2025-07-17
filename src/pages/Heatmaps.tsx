
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Map, 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Clock,
  CheckCircle,
  AlertTriangle,
  Layers
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const Heatmaps = () => {
  const [selectedLayer, setSelectedLayer] = useState("all");

  const mapLayers = [
    { id: "all", label: "All Issues", color: "#3B82F6" },
    { id: "potholes", label: "Potholes", color: "#EF4444" },
    { id: "garbage", label: "Garbage", color: "#F59E0B" },
    { id: "lighting", label: "Street Lighting", color: "#8B5CF6" },
    { id: "water", label: "Water Issues", color: "#06B6D4" },
    { id: "safety", label: "Public Safety", color: "#10B981" }
  ];

  const departmentData = [
    { department: "Roads & Transport", resolved: 85, pending: 15, total: 120 },
    { department: "Water & Sanitation", resolved: 67, pending: 23, total: 90 },
    { department: "Public Works", resolved: 92, pending: 18, total: 110 },
    { department: "Electricity", resolved: 78, pending: 12, total: 90 },
    { department: "Parks & Recreation", resolved: 95, pending: 5, total: 60 }
  ];

  const issueTypeData = [
    { name: "Potholes", value: 145, color: "#EF4444" },
    { name: "Garbage", value: 98, color: "#F59E0B" },
    { name: "Lighting", value: 76, color: "#8B5CF6" },
    { name: "Water", value: 54, color: "#06B6D4" },
    { name: "Safety", value: 32, color: "#10B981" }
  ];

  const trendData = [
    { month: "Jul", reports: 245, resolved: 198 },
    { month: "Aug", reports: 289, resolved: 234 },
    { month: "Sep", reports: 312, resolved: 267 },
    { month: "Oct", reports: 298, resolved: 276 },
    { month: "Nov", reports: 334, resolved: 301 },
    { month: "Dec", reports: 367, resolved: 329 },
    { month: "Jan", reports: 405, resolved: 378 }
  ];

  const getResolutionRate = (resolved: number, total: number) => {
    return Math.round((resolved / total) * 100);
  };

  const getResolutionColor = (rate: number) => {
    if (rate >= 85) return "text-green-600 dark:text-green-400";
    if (rate >= 70) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            City Insights & Heatmaps
          </h1>
          <p className="text-slate-600 dark:text-slate-300">
            Real-time civic data visualization and analytics
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Heatmap */}
        <div className="lg:col-span-2">
          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-slate-900 dark:text-white">
                <Map className="h-5 w-5" />
                <span>City Heatmap</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Map Layer Controls */}
              <div className="flex flex-wrap gap-2 mb-4">
                {mapLayers.map((layer) => (
                  <Button
                    key={layer.id}
                    variant={selectedLayer === layer.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedLayer(layer.id)}
                    className={`${
                      selectedLayer === layer.id 
                        ? 'bg-gradient-to-r from-teal-500 to-blue-600' 
                        : ''
                    }`}
                  >
                    <div 
                      className="w-3 h-3 rounded-full mr-2" 
                      style={{ backgroundColor: layer.color }}
                    />
                    {layer.label}
                  </Button>
                ))}
              </div>

              {/* Mock Heatmap Display */}
              <div className="bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 rounded-lg p-8 text-center relative overflow-hidden">
                <div className="relative z-10">
                  <Map className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Interactive City Map
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 mb-4">
                    Showing {mapLayers.find(l => l.id === selectedLayer)?.label.toLowerCase()} across the city
                  </p>
                  <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                    <Layers className="h-3 w-3 mr-1" />
                    {selectedLayer === "all" ? "All Layers" : "Filtered View"}
                  </Badge>
                </div>
                
                {/* Mock heat zones */}
                <div className="absolute inset-4 opacity-30">
                  <div className="absolute top-1/4 left-1/3 w-12 h-12 bg-red-500 rounded-full blur-sm"></div>
                  <div className="absolute top-1/2 right-1/4 w-8 h-8 bg-yellow-500 rounded-full blur-sm"></div>
                  <div className="absolute bottom-1/3 left-1/4 w-10 h-10 bg-orange-500 rounded-full blur-sm"></div>
                  <div className="absolute top-1/3 right-1/3 w-6 h-6 bg-purple-500 rounded-full blur-sm"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="space-y-4">
          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-900 dark:text-white">Live Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-400">Total Reports</span>
                <span className="text-xl font-bold text-slate-900 dark:text-white">1,247</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-400">Resolved</span>
                <div className="flex items-center space-x-2">
                  <span className="text-xl font-bold text-green-600 dark:text-green-400">1,089</span>
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-400">Pending</span>
                <div className="flex items-center space-x-2">
                  <span className="text-xl font-bold text-yellow-600 dark:text-yellow-400">158</span>
                  <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-400">Avg. Resolution</span>
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold text-blue-600 dark:text-blue-400">3.2 days</span>
                  <TrendingDown className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-900 dark:text-white">Issue Types</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={issueTypeData}
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    dataKey="value"
                  >
                    {issueTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-4">
                {issueTypeData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-slate-600 dark:text-slate-400">{item.name}</span>
                    </div>
                    <span className="font-medium text-slate-900 dark:text-white">{item.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Department Performance */}
      <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-slate-900 dark:text-white">
            <BarChart3 className="h-5 w-5" />
            <span>Department Resolution Rates</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {departmentData.map((dept) => (
              <div key={dept.department} className="text-center">
                <div className="mb-2">
                  <div className={`text-2xl font-bold ${getResolutionColor(getResolutionRate(dept.resolved, dept.total))}`}>
                    {getResolutionRate(dept.resolved, dept.total)}%
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    {dept.resolved}/{dept.total}
                  </div>
                </div>
                <div className="text-xs font-medium text-slate-900 dark:text-white">
                  {dept.department}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Trend Analysis */}
      <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-slate-900 dark:text-white">
            <TrendingUp className="h-5 w-5" />
            <span>Monthly Trends</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="month" 
                className="text-slate-600 dark:text-slate-400"
              />
              <YAxis className="text-slate-600 dark:text-slate-400" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgb(30 41 59)',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="reports" 
                stroke="#3B82F6" 
                strokeWidth={3}
                name="Reports"
              />
              <Line 
                type="monotone" 
                dataKey="resolved" 
                stroke="#10B981" 
                strokeWidth={3}
                name="Resolved"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default Heatmaps;
