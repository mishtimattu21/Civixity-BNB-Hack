import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { CheckCircle, Clock, MapPin, Search, ThumbsUp, ThumbsDown, Eye } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/hooks/use-toast';

const Polls = () => {
  const [search, setSearch] = useState('');
  const [polls, setPolls] = useState<any[]>([]);
  const [votes, setVotes] = useState<{ [pollId: string]: string }>({});
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();
  const [otherText, setOtherText] = useState<{ [pollId: string]: string }>({});
  const [otherError, setOtherError] = useState<{ [pollId: string]: string }>({});
  const [showOtherResponses, setShowOtherResponses] = useState<{ [pollId: string]: boolean }>({});
  const [otherResponses, setOtherResponses] = useState<{ [pollId: string]: any[] }>({});
  const [otherLikes, setOtherLikes] = useState<{ [voteId: string]: { like: number, dislike: number, userType?: string } }>({});

  const filteredPolls = polls.filter(
    (poll) =>
      poll.question.toLowerCase().includes(search.toLowerCase()) ||
      (poll.location || '').toLowerCase().includes(search.toLowerCase())
  );

  const activePolls = filteredPolls.filter((poll) => poll.status === 'active');
  const endedPolls = filteredPolls.filter((poll) => poll.status === 'ended');

  // Fetch user
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data?.user ?? null);
    });
  }, []);

  // Fetch polls
  useEffect(() => {
    const fetchPolls = async () => {
      const { data, error } = await supabase
        .from('polls')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) {
        setPolls(data);
      }
    };
    fetchPolls();
  }, []);

  // Fetch user votes
  useEffect(() => {
    if (!user) return;
    const fetchVotes = async () => {
      const { data, error } = await supabase
        .from('poll_votes')
        .select('poll_id, option')
        .eq('user_id', user.id);
      if (!error && data) {
        const voteMap: { [pollId: string]: string } = {};
        data.forEach((vote) => {
          voteMap[vote.poll_id] = vote.option;
        });
        setVotes(voteMap);
      }
    };
    fetchVotes();
  }, [user, polls]);

  // Handle voting
  const handleVote = async (pollId: string, option: string, otherTextValue?: string) => {
    if (!user) {
      toast({ title: 'Sign in required', description: 'Please sign in to vote.' });
      return;
    }
    // Prevent double voting
    if (votes[pollId]) return;
    if (option === 'Other' && (!otherTextValue || otherTextValue.trim() === '')) {
      setOtherError((prev) => ({ ...prev, [pollId]: 'Please enter your response.' }));
      return;
    }
    setOtherError((prev) => ({ ...prev, [pollId]: '' }));
    const insertObj: any = {
      poll_id: pollId,
      user_id: user.id,
      option,
    };
    if (option === 'Other') {
      insertObj.other_text = otherTextValue;
    }
    const { error } = await supabase.from('poll_votes').insert([insertObj]);
    if (!error) {
      setVotes((prev) => ({ ...prev, [pollId]: option }));
      toast({ title: 'Vote submitted', description: 'Thank you for voting!' });
    } else {
      toast({ title: 'Error', description: 'Failed to submit vote.' });
    }
  };

  // Add a new function to remove a user's vote for a poll
  const handleRemoveVote = async (pollId: string, refetch = false) => {
    if (!user) return;
    // Find the user's vote for this poll
    const { data, error } = await supabase
      .from('poll_votes')
      .select('id')
      .eq('poll_id', pollId)
      .eq('user_id', user.id)
      .single();
    if (!error && data) {
      await supabase.from('poll_votes').delete().eq('id', data.id);
      setVotes((prev) => {
        const newVotes = { ...prev };
        delete newVotes[pollId];
        return newVotes;
      });
      setOtherText((prev) => ({ ...prev, [pollId]: '' }));
      toast({ title: 'Vote removed', description: 'You can vote again.' });
      if (refetch) {
        const fetchVotes = async () => {
          const { data, error } = await supabase
            .from('poll_votes')
            .select('poll_id, option')
            .eq('user_id', user.id);
          if (!error && data) {
            const voteMap: { [pollId: string]: string } = {};
            data.forEach((vote) => {
              voteMap[vote.poll_id] = vote.option;
            });
            setVotes(voteMap);
          }
        };
        fetchVotes();
      }
    }
  };

  // Add a new function to remove a user's 'Other' response for a poll
  const handleRemoveOtherResponse = async (pollId: string, refetch = false) => {
    if (!user) return;
    // Find the user's 'Other' vote for this poll
    const { data, error } = await supabase
      .from('poll_votes')
      .select('id')
      .eq('poll_id', pollId)
      .eq('user_id', user.id)
      .eq('option', 'Other')
      .single();
    if (!error && data) {
      await supabase.from('poll_votes').delete().eq('id', data.id);
      setVotes((prev) => {
        const newVotes = { ...prev };
        delete newVotes[pollId];
        return newVotes;
      });
      setOtherText((prev) => ({ ...prev, [pollId]: '' }));
      toast({ title: 'Other response removed', description: 'You can enter a new response.' });
      if (refetch) {
        const fetchVotes = async () => {
          const { data, error } = await supabase
            .from('poll_votes')
            .select('poll_id, option')
            .eq('user_id', user.id);
          if (!error && data) {
            const voteMap: { [pollId: string]: string } = {};
            data.forEach((vote) => {
              voteMap[vote.poll_id] = vote.option;
            });
            setVotes(voteMap);
          }
        };
        fetchVotes();
      }
    }
  };

  // Fetch poll results for ended polls
  const [results, setResults] = useState<{ [pollId: string]: { [option: string]: number } }>({});
  useEffect(() => {
    const fetchResults = async () => {
      const endedPolls = polls.filter((poll) => poll.status === 'ended');
      for (const poll of endedPolls) {
        const { data, error } = await supabase
          .from('poll_votes')
          .select('option')
          .eq('poll_id', poll.id);
        if (!error && data) {
          // Always count Yes, No, Other
          const counts: { [option: string]: number } = { Yes: 0, No: 0, Other: 0 };
          data.forEach((vote) => {
            if (vote.option in counts) counts[vote.option] += 1;
          });
          setResults((prev) => ({ ...prev, [poll.id]: counts }));
        }
      }
    };
    if (polls.length > 0) fetchResults();
  }, [polls]);

  // Fetch 'Other' responses and their like/dislike counts for ended polls
  useEffect(() => {
    const fetchOtherResponses = async () => {
      for (const poll of endedPolls) {
        const { data: votes, error } = await supabase
          .from('poll_votes')
          .select('id, user_id, other_text, created_at')
          .eq('poll_id', poll.id)
          .eq('option', 'Other');
        if (!error && votes) {
          setOtherResponses(prev => ({ ...prev, [poll.id]: votes }));
          // Fetch likes/dislikes for these votes
          const voteIds = votes.map(v => v.id);
          if (voteIds.length > 0) {
            const { data: likesData, error: likesError } = await supabase
              .from('poll_other_likes')
              .select('poll_vote_id, type, user_id')
              .in('poll_vote_id', voteIds);
            if (!likesError && likesData) {
              const likeMap: { [voteId: string]: { like: number, dislike: number, userType?: string } } = {};
              voteIds.forEach(id => { likeMap[id] = { like: 0, dislike: 0 }; });
              likesData.forEach(like => {
                if (like.type === 'like') likeMap[like.poll_vote_id].like += 1;
                if (like.type === 'dislike') likeMap[like.poll_vote_id].dislike += 1;
                if (like.user_id === user?.id) likeMap[like.poll_vote_id].userType = like.type;
              });
              setOtherLikes(prev => ({ ...prev, ...likeMap }));
            }
          }
        }
      }
    };
    if (endedPolls.length > 0 && user) fetchOtherResponses();
  }, [endedPolls, user]);

  // Like/dislike handler
  const handleOtherLike = async (voteId: string, type: 'like' | 'dislike') => {
    if (!user) {
      toast({ title: 'Sign in required', description: 'Please sign in to like/dislike.' });
      return;
    }
    // Upsert like/dislike
    const { error } = await supabase.from('poll_other_likes').upsert([
      {
        poll_vote_id: voteId,
        user_id: user.id,
        type,
      }
    ], { onConflict: 'poll_vote_id,user_id' });
    if (!error) {
      setOtherLikes(prev => ({
        ...prev,
        [voteId]: {
          ...prev[voteId],
          [type]: (prev[voteId]?.[type] || 0) + 1,
          userType: type
        }
      }));
    }
  };

  const fetchVotes = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('poll_votes')
      .select('poll_id, option')
      .eq('user_id', user.id);
    if (!error && data) {
      const voteMap: { [pollId: string]: string } = {};
      data.forEach((vote) => {
        voteMap[vote.poll_id] = vote.option;
      });
      setVotes(voteMap);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">City Polls</h1>
          <p className="text-slate-600 dark:text-slate-300">Participate in civic polls and make your voice heard in Kochi!</p>
        </div>
        <div className="mt-4 lg:mt-0 flex items-center gap-2">
          <Input
            placeholder="Search polls..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-64"
          />
          <Search className="h-5 w-5 text-slate-400" />
        </div>
      </div>

      {/* Active Polls */}
      <div>
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Active Polls</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {activePolls.length === 0 && <div className="text-slate-500">No active polls found.</div>}
          {activePolls.map((poll) => (
            <Card key={poll.id} className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="text-lg text-slate-900 dark:text-white flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-blue-500" />
                  {poll.location}
                </CardTitle>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Posted {formatDistanceToNow(new Date(poll.created_at), { addSuffix: true })}
                </div>
              </CardHeader>
              <CardContent>
                <div className="font-medium text-slate-900 dark:text-white mb-2">{poll.question}</div>
                <div className="flex flex-col gap-2 mb-4">
                  {["Yes", "No", "Other"].map((option) => (
                    <div key={option} className="flex flex-col gap-1">
                      <Button
                        variant={votes[poll.id] === option ? 'default' : 'outline'}
                        className="justify-start"
                        onClick={async () => {
                          // If double-click just removed the vote, allow immediate re-vote
                          if (votes[poll.id] === option) return;
                          // Remove previous vote if any
                          if (votes[poll.id]) {
                            if (votes[poll.id] === 'Other') {
                              await handleRemoveOtherResponse(poll.id, false);
                            } else {
                              await handleRemoveVote(poll.id, false);
                            }
                          }
                          if (option === 'Other') {
                            setOtherText((prev) => ({ ...prev, [poll.id]: '' }));
                          } else {
                            handleVote(poll.id, option);
                          }
                          // Refetch votes in the background for consistency
                          fetchVotes();
                        }}
                        onDoubleClick={async () => {
                          if (votes[poll.id] === option) {
                            if (option === 'Other') {
                              await handleRemoveOtherResponse(poll.id, false);
                            } else {
                              await handleRemoveVote(poll.id, false);
                            }
                            // Update local state immediately, then refetch
                            setVotes((prev) => {
                              const newVotes = { ...prev };
                              delete newVotes[poll.id];
                              return newVotes;
                            });
                            fetchVotes();
                          }
                        }}
                      >
                        {option}
                        {votes[poll.id] === option && <CheckCircle className="h-4 w-4 ml-2 text-green-500" />}
                      </Button>
                      {/* Show input for Other if not voted, or if switching to Other */}
                      {option === 'Other' && (!votes[poll.id] || votes[poll.id] === 'Other') && (
                        <div className="flex gap-2 mt-2">
                          <Input
                            placeholder="Please specify..."
                            value={otherText[poll.id] || ''}
                            onChange={e => setOtherText(prev => ({ ...prev, [poll.id]: e.target.value }))}
                            className="w-48"
                            disabled={votes[poll.id] && votes[poll.id] !== 'Other'}
                          />
                          <Button
                            onClick={() => handleVote(poll.id, 'Other', otherText[poll.id])}
                            disabled={!otherText[poll.id] || otherText[poll.id].trim() === ''}
                          >
                            Submit
                          </Button>
                        </div>
                      )}
                      {option === 'Other' && otherError[poll.id] && (
                        <div className="text-red-500 text-xs mt-1">{otherError[poll.id]}</div>
                      )}
                      {/* If user voted 'Other', show their response with double click to remove */}
                      {option === 'Other' && votes[poll.id] === 'Other' && (
                        <div className="mt-2 text-xs text-slate-500">
                          <span
                            className="cursor-pointer underline"
                            title="Double click to remove your response"
                            onDoubleClick={() => handleRemoveOtherResponse(poll.id, false)}
                          >
                            (Double click to remove your response)
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                {votes[poll.id] && (
                  <div className="text-green-600 dark:text-green-400 font-medium flex items-center gap-2">
                    Thank you for voting!
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Ended Polls */}
      <div>
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 mt-8">Ended Polls</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {endedPolls.length === 0 && <div className="text-slate-500">No ended polls found.</div>}
          {endedPolls.map((poll) => {
            const pollResults = results[poll.id] || {};
            const totalVotes = Object.values(pollResults).reduce((a, b) => a + b, 0);
            const hasOtherResponses = otherResponses[poll.id] && otherResponses[poll.id].length > 0;
            return (
              <Card key={poll.id} className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                <CardHeader>
                  <CardTitle className="text-lg text-slate-900 dark:text-white flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-blue-500" />
                    {poll.location}
                  </CardTitle>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Posted {formatDistanceToNow(new Date(poll.created_at), { addSuffix: true })}
                  </div>
                  <div className="text-xs text-yellow-600 dark:text-yellow-400 mt-1 flex items-center gap-1">
                    <Clock className="h-4 w-4" /> Poll Ended
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="font-medium text-slate-900 dark:text-white mb-2">{poll.question}</div>
                  <div className="space-y-2">
                    {["Yes", "No", "Other"].map((option) => (
                      <div key={option} className="flex items-center gap-2">
                        <Badge className="min-w-[60px] justify-center" variant="outline">{option}</Badge>
                        <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded h-2">
                          <div
                            className="bg-blue-500 h-2 rounded"
                            style={{ width: `${((pollResults[option] || 0) / (totalVotes || 1)) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-slate-700 dark:text-slate-300">{pollResults[option] || 0} votes</span>
                      </div>
                    ))}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                    Total votes: {totalVotes}
                  </div>
                </CardContent>
                {showOtherResponses[poll.id] && hasOtherResponses && (
                  <div className="mt-4 border-t pt-3">
                    <div className="font-semibold mb-2">Other Responses:</div>
                    <div className="space-y-3">
                      {otherResponses[poll.id].map((resp) => (
                        <div key={resp.id} className="bg-slate-100 dark:bg-slate-700 rounded p-3 flex flex-col md:flex-row md:items-center md:justify-between">
                          <div className="mb-2 md:mb-0 flex-1">
                            <div className="text-slate-900 dark:text-white">{resp.other_text}</div>
                            <div className="text-xs text-slate-500">By User {resp.user_id.slice(0, 6)}... at {formatDistanceToNow(new Date(resp.created_at), { addSuffix: true })}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant={otherLikes[resp.id]?.userType === 'like' ? 'default' : 'outline'} size="sm" onClick={() => handleOtherLike(resp.id, 'like')}>
                              <ThumbsUp className="h-4 w-4 mr-1" /> {otherLikes[resp.id]?.like || 0}
                            </Button>
                            <Button variant={otherLikes[resp.id]?.userType === 'dislike' ? 'default' : 'outline'} size="sm" onClick={() => handleOtherLike(resp.id, 'dislike')}>
                              <ThumbsDown className="h-4 w-4 mr-1" /> {otherLikes[resp.id]?.dislike || 0}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {hasOtherResponses && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-4"
                    onClick={() => setShowOtherResponses(prev => ({ ...prev, [poll.id]: !prev[poll.id] }))}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    {showOtherResponses[poll.id] ? 'Hide' : 'View'} Other Responses
                  </Button>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Polls; 