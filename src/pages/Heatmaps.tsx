import { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, HeatmapLayer } from '@react-google-maps/api';
import { supabase } from '@/lib/supabaseClient';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Map, BarChart3, TrendingUp, TrendingDown, Clock, CheckCircle, AlertTriangle, Layers } from "lucide-react";
import { BarChart as RBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const mapContainerStyle = {
  width: '100%',
  height: '420px',
};

const center = { lat: 10.0, lng: 76.0 }; // Default center (e.g., Kochi)

const initialHeatmapData = [];

const Heatmaps = () => {
  const [selectedLayer, setSelectedLayer] = useState("all");
  const [heatmapData, setHeatmapData] = useState(initialHeatmapData);
  const [mapsApiLoaded, setMapsApiLoaded] = useState(false);
  const [mapsObj, setMapsObj] = useState(null);
  const [issueTypeData, setIssueTypeData] = useState([
    { name: "Potholes", value: 0, color: "#EF4444" },
    { name: "Garbage", value: 0, color: "#F59E0B" },
    { name: "Lighting", value: 0, color: "#8B5CF6" },
    { name: "Water", value: 0, color: "#06B6D4" },
    { name: "Safety", value: 0, color: "#10B981" },
    { name: "Other", value: 0, color: "#64748B" },
  ]);

  const mapLayers = [
    { id: "all", label: "All Issues", color: "#3B82F6" },
    { id: "potholes", label: "Potholes", color: "#EF4444" },
    { id: "garbage", label: "Garbage", color: "#F59E0B" },
    { id: "lighting", label: "Street Lighting", color: "#8B5CF6" },
    { id: "water", label: "Water Issues", color: "#06B6D4" },
    { id: "safety", label: "Public Safety", color: "#10B981" },
    { id: "others", label: "Others", color: "#64748B" }
  ];

  const departmentData = [
    { department: "Roads & Transport", resolved: 85, pending: 15, total: 120 },
    { department: "Water & Sanitation", resolved: 67, pending: 23, total: 90 },
    { department: "Public Works", resolved: 92, pending: 18, total: 110 },
    { department: "Electricity", resolved: 78, pending: 12, total: 90 },
    { department: "Parks & Recreation", resolved: 95, pending: 5, total: 60 }
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

  // Fetch civic issue locations from Supabase
  useEffect(() => {
    async function fetchHeatmapData() {
      const { data, error } = await supabase
        .from('posts')
        .select('latitude, longitude, category');
      if (error) {
        console.error('Error fetching heatmap data:', error);
        return;
      }
      const filtered = data
        .filter(p => p.latitude && p.longitude && (selectedLayer === 'all' || p.category === selectedLayer))
        .map(p => ({ lat: parseFloat(p.latitude), lng: parseFloat(p.longitude) }));
      setHeatmapData(filtered);
    }
    fetchHeatmapData();
  }, [selectedLayer]);

  // Fetch issue type counts from Supabase
  useEffect(() => {
    async function fetchIssueTypeCounts() {
      const { data, error } = await supabase
        .from('posts')
        .select('category');
      if (error) {
        console.error('Error fetching issue type data:', error);
        return;
      }
      const counts = {
        Potholes: 0,
        Garbage: 0,
        Lighting: 0,
        Water: 0,
        Safety: 0,
        Other: 0,
      };
      data.forEach(post => {
        if (post.category === 'Potholes') counts.Potholes++;
        else if (post.category === 'Garbage') counts.Garbage++;
        else if (post.category === 'Street Lighting') counts.Lighting++;
        else if (post.category === 'Water Issues') counts.Water++;
        else if (post.category === 'Public Safety') counts.Safety++;
        else counts.Other++;
      });
      setIssueTypeData([
        { name: "Potholes", value: counts.Potholes, color: "#EF4444" },
        { name: "Garbage", value: counts.Garbage, color: "#F59E0B" },
        { name: "Lighting", value: counts.Lighting, color: "#8B5CF6" },
        { name: "Water", value: counts.Water, color: "#06B6D4" },
        { name: "Safety", value: counts.Safety, color: "#10B981" },
        { name: "Other", value: counts.Other, color: "#64748B" },
      ]);
    }
    fetchIssueTypeCounts();
  }, []);

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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Interactive Heatmap */}
        <div className="lg:col-span-2 h-full flex flex-col">
          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 flex-1 flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-slate-900 dark:text-white">
                <Map className="h-5 w-5" />
                <span>City Heatmap</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-0">
              {/* Map Layer Controls */}
              <div className="flex flex-wrap gap-2 mb-4 p-4 pb-0">
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
              {/* Google Maps Heatmap */}
              <div className="flex-1 w-full h-full relative rounded-b-lg overflow-hidden">
                <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY} libraries={['visualization']}>
                  <GoogleMap
                    mapContainerStyle={{ width: '100%', height: '100%' }}
                    center={center}
                    zoom={12}
                    onLoad={map => {
                      setMapsApiLoaded(true);
                      setMapsObj(window.google.maps);
                    }}
                  >
                    {mapsApiLoaded && mapsObj && (
                      <HeatmapLayer
                        data={heatmapData.map(p => new mapsObj.LatLng(p.lat, p.lng))}
                      />
                    )}
                  </GoogleMap>
                </LoadScript>
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
