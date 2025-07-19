
import { useState, useEffect, useMemo } from "react";
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
  Camera,
  Trash
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
    image: null as File | null,
    location: "",
    autoDetectLocation: false,
    category: "Potholes", // default value
    otherCategory: "",
    latitude: null,
    longitude: null,
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

  // Handle auto-detect location
  useEffect(() => {
    if (newPost.autoDetectLocation && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          // Call Nominatim API for reverse geocoding
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await response.json();
            setNewPost((prev) => ({
              ...prev,
              location: data.display_name || "Location unavailable",
              latitude,
              longitude,
            }));
          } catch (err) {
            setNewPost((prev) => ({ ...prev, location: "Location unavailable", latitude, longitude }));
          }
        },
        (err) => {
          setNewPost((prev) => ({ ...prev, location: "Location unavailable", latitude: null, longitude: null }));
        }
      );
    }
  }, [newPost.autoDetectLocation]);

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

  const [user, setUser] = useState<any>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [postAnonymous, setPostAnonymous] = useState(false);

  // Fetch user and username after login
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data?.user ?? null);
      if (data?.user) {
        supabase
          .from('profiles')
          .select('username')
          .eq('id', data.user.id)
          .single()
          .then(({ data: profile }) => {
            if (!profile?.username) setShowUsernameModal(true);
            else setUsername(profile.username);
          });
      }
    });
  }, []);

  // Handle username creation
  const handleSetUsername = async (e: React.FormEvent) => {
    e.preventDefault();
    setUsernameError('');
    // Check uniqueness
    const { data: existing } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', newUsername)
      .single();
    if (existing) {
      setUsernameError('Username already taken');
      return;
    }
    // Save to profiles
    if (user) {
      await supabase
        .from('profiles')
        .upsert({ id: user.id, username: newUsername });
      setUsername(newUsername);
      setShowUsernameModal(false);
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
    // Determine final category
    const finalCategory = newPost.category === 'Other' && newPost.otherCategory.trim() ? `Other: ${newPost.otherCategory.trim()}` : newPost.category;
    // Determine username for post
    const postUsername = postAnonymous ? 'Anonymous' : username;
    // Insert post into Supabase
    const { error: insertError } = await supabase.from('posts').insert([
      {
        title: newPost.title,
        description: newPost.description,
        author: postUsername,
        user_id: user?.id,
        timestamp: new Date().toISOString(),
        location: newPost.location,
        category: finalCategory,
        severity: 5, // Optionally add severity input
        upvotes: 0,
        downvotes: 0,
        comments: 0,
        image_url: imageUrl,
        similar_posts: 0,
        ai_detected: false,
        latitude: newPost.latitude,
        longitude: newPost.longitude,
      }
    ]);
    setUploading(false);
    if (!insertError) {
      setNewPost({ title: "", description: "", image: null, location: "", autoDetectLocation: false, category: "Potholes", otherCategory: "", latitude: null, longitude: null });
      setDialogOpen(false);
      setPostAnonymous(false);
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

  const handleVote = async (postId: number, type: 'up' | 'down') => {
    const prevVote = userVotes[postId];
    if (prevVote === type) return; // Already voted this way

    // Find the post
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    let upvotes = post.upvotes;
    let downvotes = post.downvotes;
    if (type === 'up') {
      upvotes += 1;
      if (prevVote === 'down') downvotes = Math.max(0, downvotes - 1);
    } else if (type === 'down') {
      downvotes += 1;
      if (prevVote === 'up') upvotes = Math.max(0, upvotes - 1);
    }

    // Update in Supabase
    await supabase
      .from('posts')
      .update({ upvotes, downvotes })
      .eq('id', postId);

    // Update local state
    setPosts(posts.map(p =>
      p.id === postId ? { ...p, upvotes, downvotes } : p
    ));
    const newVotes = { ...userVotes, [postId]: type };
    setUserVotes(newVotes);
    localStorage.setItem('userVotes', JSON.stringify(newVotes));
  };

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);

  // Handle deleting a post
  const handleDeletePost = async () => {
    if (!postToDelete) return;
    const { error } = await supabase.from('posts').delete().eq('id', postToDelete);
    if (!error) {
      setPosts(posts.filter(p => p.id !== postToDelete));
      toast({ title: "Deleted", description: "Your post has been deleted." });
    } else {
      toast({ title: "Error", description: "Failed to delete post." });
    }
    setDeleteDialogOpen(false);
    setPostToDelete(null);
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

  const categoryColors: { [key: string]: string } = {
    "Potholes": "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
    "Water Issues": "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300",
    "Street Lighting": "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
    "Garbage": "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
    "Public Safety": "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
    // For custom 'Other' categories, use a default color
    "Other": "bg-slate-200 text-slate-700 dark:bg-slate-700/30 dark:text-slate-300"
  };

  function getCategoryColor(category: string) {
    if (category.startsWith("Other:")) return categoryColors["Other"];
    return categoryColors[category] || "bg-slate-200 text-slate-700 dark:bg-slate-700/30 dark:text-slate-300";
  }

  // Helper to get top 5 severe posts from last 24 hours
  const topSeverePosts = useMemo(() => {
    const now = new Date();
    return posts
      .filter(post => {
        if (!post.timestamp) return false;
        const postTime = new Date(post.timestamp);
        return (now.getTime() - postTime.getTime()) < 24 * 60 * 60 * 1000;
      })
      .sort((a, b) => b.severity - a.severity)
      .slice(0, 5);
  }, [posts]);

  const [selectedStory, setSelectedStory] = useState<any | null>(null);
  const [comments, setComments] = useState<{ [postId: string]: any[] }>({});
  const [newComment, setNewComment] = useState<{ [postId: string]: string }>({});
  const [expandedComments, setExpandedComments] = useState<{ [postId: string]: boolean }>({});
  const [commentCounts, setCommentCounts] = useState<{ [postId: string]: number }>({});

  // Fetch comments for a post
  const fetchComments = async (postId: string) => {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', String(postId))
      .order('created_at', { ascending: true });
    if (!error) {
      setComments(prev => ({ ...prev, [postId]: data }));
      setCommentCounts(prev => ({ ...prev, [postId]: data.length }));
      console.log('Fetched comments for', postId, data);
    } else {
      console.error('Error fetching comments:', error);
    }
  };

  // Fetch comments when posts are loaded
  useEffect(() => {
    posts.forEach(post => {
      fetchComments(String(post.id));
    });
  }, [posts]);

  // Add a comment
  const handleAddComment = async (postId: string) => {
    if (!newComment[postId]?.trim()) return;
    console.log('Inserting comment for postId:', postId);
    const { error } = await supabase.from('comments').insert([{
      post_id: postId,
      user_id: user?.id,
      author: username || user?.email || 'Anonymous',
      content: newComment[postId],
    }]);
    if (error) {
      console.error('Insert comment error:', error);
    }
    if (!error) {
      setNewComment(prev => ({ ...prev, [postId]: '' }));
      await fetchComments(postId);
      setCommentCounts(prev => ({ ...prev, [postId]: (prev[postId] || 0) + 1 }));
    }
  };

  const handleDeleteComment = async (commentId: string, postId: string) => {
    const { error } = await supabase.from('comments').delete().eq('id', commentId);
    if (!error) {
      setComments(prev => ({
        ...prev,
        [postId]: (prev[postId] || []).filter(c => c.id !== commentId)
      }));
      setCommentCounts(prev => ({
        ...prev,
        [postId]: Math.max(0, (prev[postId] || 1) - 1)
      }));
      toast({ title: "Deleted", description: "Your comment has been deleted." });
    } else {
      toast({ title: "Error", description: "Failed to delete comment." });
    }
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
            {topSeverePosts.map((post) => (
              <div
                key={post.id}
                className="flex-shrink-0 w-32 cursor-pointer group"
                onClick={() => setSelectedStory(post)}
              >
                <div className="w-20 h-20 bg-gradient-to-br from-teal-100 to-blue-100 dark:from-teal-900/50 dark:to-blue-900/50 rounded-full flex items-center justify-center mb-2 mx-auto group-hover:scale-105 transition-transform">
                  <MapPin className="h-8 w-8 text-teal-600 dark:text-teal-400" />
                </div>
                <div className="text-center">
                  <div className="text-xs font-medium text-slate-900 dark:text-white truncate">
                    {post.title}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {post.location}
                  </div>
                  <div className="text-xs text-slate-400 dark:text-slate-500">
                    {post.timestamp ? formatDistanceToNow(parseISO(post.timestamp), { addSuffix: true }) : ''}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      {/* Story Popup Dialog */}
      <Dialog open={!!selectedStory} onOpenChange={open => !open && setSelectedStory(null)}>
        <DialogContent className="max-w-lg bg-white dark:bg-slate-800">
          {selectedStory && (
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <Avatar>
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                    {selectedStory.author?.split(' ').map((n: string) => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium text-slate-900 dark:text-white">{selectedStory.author}</div>
                  <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
                    <Clock className="h-3 w-3" />
                    <span>{selectedStory.timestamp ? formatDistanceToNow(parseISO(selectedStory.timestamp), { addSuffix: true }) : ''}</span>
                    <MapPin className="h-3 w-3 ml-2" />
                    <span>{selectedStory.location}</span>
                  </div>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{selectedStory.title}</h3>
              <p className="text-slate-600 dark:text-slate-300 mb-3">{selectedStory.description}</p>
              {selectedStory.image_url && selectedStory.image_url !== 'null' && selectedStory.image_url !== '' && (
                <img
                  src={selectedStory.image_url}
                  alt="Post"
                  className="mb-3 rounded-lg"
                  style={{ maxWidth: '100%', maxHeight: 350, width: 'auto', height: 'auto', objectFit: 'contain', display: 'block', marginLeft: 'auto', marginRight: 'auto' }}
                />
              )}
              <div className="flex items-center space-x-2 mb-3">
                <Badge variant="outline" className={getCategoryColor(selectedStory.category)}>
                  {selectedStory.category}
                </Badge>
                <Badge className={getSeverityColor(selectedStory.severity)}>
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  {getSeverityLabel(selectedStory.severity)} ({selectedStory.severity}/10)
                </Badge>
              </div>
              {/* Post Actions in Popup */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-700 mt-4">
                <div className="flex items-center space-x-4">
                  <span className="flex items-center text-green-600 dark:text-green-400"><ThumbsUp className="h-4 w-4 mr-1" />{selectedStory.upvotes}</span>
                  <span className="flex items-center text-red-600 dark:text-red-400"><ThumbsDown className="h-4 w-4 mr-1" />{selectedStory.downvotes}</span>
                  <span className="flex items-center text-blue-600 dark:text-blue-400"><MessageCircle className="h-4 w-4 mr-1" />{selectedStory.comments}</span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

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
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="Enter location or use auto-detect"
                value={newPost.location}
                onChange={(e) => setNewPost({ ...newPost, location: e.target.value, autoDetectLocation: false })}
                className="bg-white dark:bg-slate-700"
                disabled={newPost.autoDetectLocation}
              />
              <div className="flex items-center mt-2">
                <input
                  type="checkbox"
                  id="autoDetectLocation"
                  checked={newPost.autoDetectLocation}
                  onChange={(e) => setNewPost({ ...newPost, autoDetectLocation: e.target.checked })}
                  className="mr-2"
                />
                <Label htmlFor="autoDetectLocation">Detect my location automatically</Label>
              </div>
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                value={newPost.category}
                onChange={e => setNewPost({ ...newPost, category: e.target.value })}
                className="bg-white dark:bg-slate-700 w-full rounded border px-3 py-2"
                required
              >
                <option value="Potholes">Potholes</option>
                <option value="Water Issues">Water Issues</option>
                <option value="Street Lighting">Street Lighting</option>
                <option value="Garbage">Garbage</option>
                <option value="Public Safety">Public Safety</option>
                <option value="Other">Other</option>
              </select>
              {newPost.category === 'Other' && (
                <Input
                  id="otherCategory"
                  placeholder="Please specify the issue type in 1-2 words"
                  value={newPost.otherCategory}
                  onChange={e => setNewPost({ ...newPost, otherCategory: e.target.value })}
                  className="bg-white dark:bg-slate-700 mt-2"
                  required
                />
              )}
            </div>
            <div>
              <Label htmlFor="image">Photo (Optional)</Label>
              <div className="flex items-center space-x-2">
                <Input type="file" accept="image/*" id="image" onChange={handleImageChange} />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="postAnonymous"
                checked={postAnonymous}
                onChange={e => setPostAnonymous(e.target.checked)}
                className="mr-2"
              />
              <Label htmlFor="postAnonymous">Post as anonymous</Label>
            </div>
            <Button className="w-full bg-gradient-to-r from-teal-500 to-blue-600" type="submit" disabled={uploading}>
              {uploading ? 'Submitting...' : 'Submit Report'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Username modal */}
      <Dialog open={showUsernameModal}>
        <DialogContent>
          <form onSubmit={handleSetUsername} className="space-y-4">
            <Label htmlFor="newUsername">Choose a unique username</Label>
            <Input
              id="newUsername"
              value={newUsername}
              onChange={e => setNewUsername(e.target.value)}
              placeholder="Username"
              required
            />
            {usernameError && <div className="text-red-500 text-sm">{usernameError}</div>}
            <Button type="submit" className="w-full bg-gradient-to-r from-teal-500 to-blue-600">Set Username</Button>
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
                <div className="flex items-start justify-between mb-4 relative">
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
                 {post.user_id && user?.id && post.user_id === user.id && (
                    <button
                      onClick={() => { setDeleteDialogOpen(true); setPostToDelete(post.id); }}
                      className="absolute -top-3 right-2 p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 transition-colors"
                      title="Delete post"
                    >
                      <Trash className="h-5 w-5" />
                    </button>
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
                    <Badge variant="outline" className={getCategoryColor(post.category)}>
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
                      className={
                        (userVotes[post.id] === 'up'
                          ? 'bg-green-100 border border-green-300 dark:bg-green-900/40'
                          : 'hover:bg-green-50 hover:text-green-600 dark:hover:bg-green-900/30 dark:hover:text-green-400') +
                        ' flex items-center'
                      }
                      disabled={userVotes[post.id] === 'up'}
                    >
                      <ThumbsUp className={
                        `h-4 w-4 mr-1 ${userVotes[post.id] === 'up' ? 'text-black dark:text-white' : 'text-green-600 dark:text-green-400'}`
                      } />
                      <span className={userVotes[post.id] === 'up' ? 'text-black dark:text-white font-bold' : 'text-green-600 dark:text-green-400'}>
                        {post.upvotes}
                      </span>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleVote(post.id, 'down')}
                      className={
                        (userVotes[post.id] === 'down'
                          ? 'bg-red-100 border border-red-300 dark:bg-red-900/40'
                          : 'hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400') +
                        ' flex items-center'
                      }
                      disabled={userVotes[post.id] === 'down'}
                    >
                      <ThumbsDown className={
                        "h-4 w-4 mr-1 " +
                        (userVotes[post.id] === 'down' ? 'text-black dark:text-white' : 'text-red-600 dark:text-red-400')
                      } />
                      <span className={userVotes[post.id] === 'down' ? 'text-black dark:text-white font-bold' : 'text-red-600 dark:text-red-400'}>
                        {post.downvotes}
                      </span>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400"
                      onClick={() => setExpandedComments(prev => ({ ...prev, [String(post.id)]: !prev[String(post.id)] }))}
                    >
                      <MessageCircle className="h-4 w-4 mr-1" />
                      {commentCounts[String(post.id)] || 0}
                    </Button>
                  </div>
                </div>

                {/* Comments Section */}
                {expandedComments[String(post.id)] && (
                  <div className="mt-4">
                    <div className="font-semibold mb-2 text-slate-700 dark:text-slate-200">Comments</div>
                    <div className="space-y-2 mb-2">
                      {(comments[String(post.id)] || []).map(comment => (
                        <div key={comment.id} className="bg-slate-100 dark:bg-slate-700 rounded p-2 relative">
                          <div className="flex items-center justify-between mb-1">
                            <div className="text-xs text-slate-500 dark:text-slate-400">
                              {comment.author} • {comment.created_at ? formatDistanceToNow(new Date(comment.created_at), { addSuffix: true }) : ''}
                            </div>
                            {comment.user_id === user?.id && (
                              <button
                                onClick={() => handleDeleteComment(comment.id, String(post.id))}
                                className="p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 transition-colors absolute top-1 right-1"
                                title="Delete comment"
                              >
                                <Trash className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                          <div className="text-slate-900 dark:text-white">{comment.content}</div>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        value={newComment[String(post.id)] || ''}
                        onChange={e => setNewComment(prev => ({ ...prev, [String(post.id)]: e.target.value }))}
                        placeholder="Add a comment..."
                        className="flex-1"
                      />
                      <Button onClick={() => handleAddComment(String(post.id))} disabled={!newComment[String(post.id)]?.trim()}>Post</Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={open => { setDeleteDialogOpen(open); if (!open) setPostToDelete(null); }}>
        <DialogContent className="max-w-sm bg-white dark:bg-slate-800">
          <DialogHeader>
            <DialogTitle className="text-slate-900 dark:text-white">Delete Post</DialogTitle>
          </DialogHeader>
          <div className="mb-4 text-slate-700 dark:text-slate-300">
            Are you sure you want to delete this post? This action cannot be undone.
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => { setDeleteDialogOpen(false); setPostToDelete(null); }}>Cancel</Button>
            <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={handleDeletePost}>Delete</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HomePage;
