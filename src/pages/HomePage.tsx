
import { useState, useEffect } from "react";
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
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow, parseISO } from "date-fns";

const HomePage = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
    image: null as File | null
  });
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);

  // Track user votes per post in localStorage
  const [userVotes, setUserVotes] = useState<{ [postId: number]: 'up' | 'down' | null }>({});

  useEffect(() => {
    const storedVotes = localStorage.getItem('userVotes');
    if (storedVotes) {
      setUserVotes(JSON.parse(storedVotes));
    }
  }, []);

  // Fetch posts from Supabase on mount
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('timestamp', { ascending: false });
      if (!error && data) {
        setPosts(data);
      }
      setLoading(false);
    };
    fetchPosts();
  }, []);

  // Handle image file selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewPost({ ...newPost, image: e.target.files[0] });
    }
  };

  // Handle new post submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    let imageUrl = null;
    if (newPost.image) {
      const fileExt = newPost.image.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const { data: storageData, error: storageError } = await supabase.storage
        .from('post-images')
        .upload(fileName, newPost.image);
      if (storageError) {
        alert('Image upload failed: ' + storageError.message);
      }
      if (!storageError && storageData) {
        const { data: publicUrlData } = supabase.storage
          .from('post-images')
          .getPublicUrl(storageData.path);
        imageUrl = publicUrlData.publicUrl;
        if (!imageUrl) {
          imageUrl = `https://xehqydqnqzxbspsxwdff.supabase.co/storage/v1/object/public/post-images/${storageData.path}`;
        }
      }
    }
    // Insert post into Supabase
    const { error: insertError } = await supabase.from('posts').insert([
      {
        title: newPost.title,
        description: newPost.description,
        author: "Anonymous", // Replace with user info if using Auth
        timestamp: new Date().toISOString(),
        location: "Unknown", // Optionally add location input
        category: "General", // Optionally add category input
        severity: 5, // Optionally add severity input
        upvotes: 0,
        downvotes: 0,
        comments: 0,
        image_url: imageUrl,
        similar_posts: 0,
        ai_detected: false
      }
    ]);
    setUploading(false);
    if (!insertError) {
      setNewPost({ title: "", description: "", image: null });
      setDialogOpen(false);
      toast({ title: "Posted!", description: "Your report has been submitted." });
      // Refetch posts
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('timestamp', { ascending: false });
      if (!error && data) {
        setPosts(data);
      }
    } else {
      alert('Post creation failed: ' + insertError.message);
    }
  };

  const handleVote = (postId: number, type: 'up' | 'down') => {
    const prevVote = userVotes[postId];
    if (prevVote === type) return; // Already voted this way
    setPosts(posts.map(post => {
      if (post.id !== postId) return post;
      let upvotes = post.upvotes;
      let downvotes = post.downvotes;
      if (type === 'up') {
        upvotes += 1;
        if (prevVote === 'down') downvotes = Math.max(0, downvotes - 1);
      } else if (type === 'down') {
        downvotes += 1;
        if (prevVote === 'up') upvotes = Math.max(0, upvotes - 1);
      }
      return { ...post, upvotes, downvotes };
    }));
    const newVotes = { ...userVotes, [postId]: type };
    setUserVotes(newVotes);
    localStorage.setItem('userVotes', JSON.stringify(newVotes));
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
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
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
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="title">Issue Title</Label>
              <Input 
                id="title"
                placeholder="Brief description of the issue"
                value={newPost.title}
                onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                className="bg-white dark:bg-slate-700"
                required
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
                required
              />
            </div>
            <div>
              <Label htmlFor="image">Photo (Optional)</Label>
              <div className="flex items-center space-x-2">
                <Input type="file" accept="image/*" id="image" onChange={handleImageChange} />
              </div>
            </div>
            <Button className="w-full bg-gradient-to-r from-teal-500 to-blue-600" type="submit" disabled={uploading}>
              {uploading ? 'Submitting...' : 'Submit Report'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Civic Posts Feed */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center text-slate-500 dark:text-slate-400 py-8">Loading posts...</div>
        ) : (
          posts.map((post) => (
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
                        <span>{post.timestamp ? formatDistanceToNow(parseISO(post.timestamp), { addSuffix: true }) : ''}</span>
                        <MapPin className="h-3 w-3 ml-2" />
                        <span>{post.location}</span>
                      </div>
                    </div>
                  </div>
                  {post.ai_detected && (
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
                  {post.image_url && post.image_url !== 'null' && post.image_url !== '' ? (
                    <img
                      src={post.image_url}
                      alt="Post"
                      className="mb-3 rounded-lg"
                      style={{ maxWidth: '100%', maxHeight: 350, width: 'auto', height: 'auto', objectFit: 'contain', display: 'block', marginLeft: 'auto', marginRight: 'auto' }}
                    />
                  ) : null}
                  
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
                  {post.similar_posts > 0 && (
                    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3 mb-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-amber-700 dark:text-amber-300">
                          {post.similar_posts} similar report{post.similar_posts > 1 ? 's' : ''} found in this area
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
                      disabled={userVotes[post.id] === 'up'}
                    >
                      <ThumbsUp className="h-4 w-4 mr-1" />
                      {post.upvotes}
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleVote(post.id, 'down')}
                      className="hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400"
                      disabled={userVotes[post.id] === 'down'}
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
          ))
        )}
      </div>
    </div>
  );
};

export default HomePage;
