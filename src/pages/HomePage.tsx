
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  ThumbsUp, 
  ThumbsDown, 
  MessageCircle, 
  MapPin, 
  Clock,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Plus,
  Camera
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const HomePage = () => {
  const [posts, setPosts] = useState([
    {
      id: 1,
      title: "Large Pothole on Main Street",
      description: "Deep pothole causing traffic issues and potential vehicle damage. Multiple cars have been affected.",
      author: "Sarah Chen",
      timestamp: "2 hours ago",
      location: "Main Street, Downtown",
      category: "Road Infrastructure",
      severity: 8,
      upvotes: 15,
      downvotes: 2,
      comments: 7,
      image: null,
      similarPosts: 3,
      aiDetected: true
    },
    {
      id: 2,
      title: "Broken Streetlight in Park Area",
      description: "Streetlight has been non-functional for over a week, creating safety concerns for evening walkers.",
      author: "Mike Johnson",
      timestamp: "4 hours ago", 
      location: "Central Park, North Side",
      category: "Public Safety",
      severity: 6,
      upvotes: 23,
      downvotes: 1,
      comments: 12,
      image: null,
      similarPosts: 1,
      aiDetected: true
    },
    {
      id: 3,
      title: "Overflowing Garbage Bins",
      description: "Multiple garbage bins in the area are overflowing, attracting pests and creating unsanitary conditions.",
      author: "Emma Wilson",
      timestamp: "6 hours ago",
      location: "Market Square",
      category: "Waste Management",
      severity: 7,
      upvotes: 31,
      downvotes: 0,
      comments: 18,
      image: null,
      similarPosts: 5,
      aiDetected: true
    }
  ]);

  const stories = [
    {
      id: 1,
      title: "Water Leak Fixed",
      location: "Oak Avenue",
      image: null,
      timestamp: "3h ago"
    },
    {
      id: 2,
      title: "New Bike Lane",
      location: "City Center",
      image: null,
      timestamp: "8h ago"
    },
    {
      id: 3,
      title: "Park Renovation",
      location: "Green Park",
      image: null,
      timestamp: "12h ago"
    },
    {
      id: 4,
      title: "Traffic Light Fixed",
      location: "5th Street",
      image: null,
      timestamp: "18h ago"
    }
  ];

  const [newPost, setNewPost] = useState({
    title: "",
    description: "",
    image: null
  });

  const handleVote = (postId: number, type: 'up' | 'down') => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            upvotes: type === 'up' ? post.upvotes + 1 : post.upvotes,
            downvotes: type === 'down' ? post.downvotes + 1 : post.downvotes
          }
        : post
    ));
  };

  const getSeverityColor = (severity: number) => {
    if (severity >= 8) return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300";
    if (severity >= 6) return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300";
    return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300";
  };

  const getSeverityLabel = (severity: number) => {
    if (severity >= 8) return "Urgent";
    if (severity >= 6) return "Moderate";
    return "Low Priority";
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Stories Section */}
      <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">
            Recent Updates (Last 24 Hours)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4 overflow-x-auto pb-2">
            {stories.map((story) => (
              <div 
                key={story.id}
                className="flex-shrink-0 w-32 cursor-pointer group"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-teal-100 to-blue-100 dark:from-teal-900/50 dark:to-blue-900/50 rounded-full flex items-center justify-center mb-2 mx-auto group-hover:scale-105 transition-transform">
                  <MapPin className="h-8 w-8 text-teal-600 dark:text-teal-400" />
                </div>
                <div className="text-center">
                  <div className="text-xs font-medium text-slate-900 dark:text-white truncate">
                    {story.title}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {story.location}
                  </div>
                  <div className="text-xs text-slate-400 dark:text-slate-500">
                    {story.timestamp}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Create New Post */}
      <Dialog>
        <DialogTrigger asChild>
          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <Plus className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1 text-slate-500 dark:text-slate-400">
                  Report a new civic issue in your area...
                </div>
                <Camera className="h-5 w-5 text-slate-400" />
              </div>
            </CardContent>
          </Card>
        </DialogTrigger>
        <DialogContent className="bg-white dark:bg-slate-800 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-slate-900 dark:text-white">Report New Issue</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Issue Title</Label>
              <Input 
                id="title"
                placeholder="Brief description of the issue"
                value={newPost.title}
                onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                className="bg-white dark:bg-slate-700"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description"
                placeholder="Provide more details about the issue"
                value={newPost.description}
                onChange={(e) => setNewPost({...newPost, description: e.target.value})}
                className="bg-white dark:bg-slate-700"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="image">Photo (Optional)</Label>
              <div className="flex items-center space-x-2">
                <Button variant="outline" className="w-full">
                  <Camera className="h-4 w-4 mr-2" />
                  Upload Photo
                </Button>
              </div>
            </div>
            <Button className="w-full bg-gradient-to-r from-teal-500 to-blue-600">
              Submit Report
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Civic Posts Feed */}
      <div className="space-y-4">
        {posts.map((post) => (
          <Card key={post.id} className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              {/* Post Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                      {post.author.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium text-slate-900 dark:text-white">{post.author}</div>
                    <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
                      <Clock className="h-3 w-3" />
                      <span>{post.timestamp}</span>
                      <MapPin className="h-3 w-3 ml-2" />
                      <span>{post.location}</span>
                    </div>
                  </div>
                </div>
                {post.aiDetected && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                    AI Detected
                  </Badge>
                )}
              </div>

              {/* Post Content */}
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  {post.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-300 mb-3">
                  {post.description}
                </p>
                
                {/* Tags and Severity */}
                <div className="flex items-center space-x-2 mb-3">
                  <Badge variant="outline" className="border-slate-300 dark:border-slate-600">
                    {post.category}
                  </Badge>
                  <Badge className={getSeverityColor(post.severity)}>
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    {getSeverityLabel(post.severity)} ({post.severity}/10)
                  </Badge>
                </div>

                {/* Similar Posts */}
                {post.similarPosts > 0 && (
                  <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3 mb-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-amber-700 dark:text-amber-300">
                        {post.similarPosts} similar report{post.similarPosts > 1 ? 's' : ''} found in this area
                      </span>
                      <Button variant="link" className="text-amber-700 dark:text-amber-300 p-0 h-auto">
                        View All
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Post Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-700">
                <div className="flex items-center space-x-4">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleVote(post.id, 'up')}
                    className="hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-600 dark:hover:text-green-400"
                  >
                    <ThumbsUp className="h-4 w-4 mr-1" />
                    {post.upvotes}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleVote(post.id, 'down')}
                    className="hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400"
                  >
                    <ThumbsDown className="h-4 w-4 mr-1" />
                    {post.downvotes}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    <MessageCircle className="h-4 w-4 mr-1" />
                    {post.comments}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
