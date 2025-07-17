
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Award, 
  Star, 
  Target, 
  Users, 
  MapPin, 
  Clock,
  TrendingUp,
  CheckCircle,
  Zap,
  Heart,
  Shield,
  Crown
} from "lucide-react";

const Badges = () => {
  const userStats = {
    totalReports: 127,
    eventsAttended: 15,
    upvotesEarned: 342,
    civiEarned: 1247,
    streakDays: 7
  };

  const earnedBadges = [
    {
      id: 1,
      title: "Civic Champion",
      description: "Submitted 100+ civic reports",
      icon: Award,
      color: "from-yellow-400 to-orange-500",
      earnedDate: "2024-01-15",
      rarity: "Epic"
    },
    {
      id: 2,
      title: "Community Helper",
      description: "Attended 10+ volunteer events",
      icon: Users,
      color: "from-blue-400 to-purple-500",
      earnedDate: "2024-01-10",
      rarity: "Rare"
    },
    {
      id: 3,
      title: "Neighborhood Watch",
      description: "Reported issues in 5+ different areas",
      icon: MapPin,
      color: "from-green-400 to-teal-500",
      earnedDate: "2024-01-08",
      rarity: "Common"
    },
    {
      id: 4,
      title: "Early Bird",
      description: "Active during morning hours (6-9 AM)",
      icon: Clock,
      color: "from-pink-400 to-rose-500",
      earnedDate: "2024-01-05",
      rarity: "Common"
    },
    {
      id: 5,
      title: "Influencer",
      description: "Earned 300+ upvotes on reports",
      icon: TrendingUp,
      color: "from-purple-400 to-indigo-500",
      earnedDate: "2024-01-12",
      rarity: "Rare"
    },
    {
      id: 6,
      title: "Problem Solver",
      description: "10 reported issues resolved",
      icon: CheckCircle,
      color: "from-emerald-400 to-green-500",
      earnedDate: "2024-01-18",
      rarity: "Common"
    }
  ];

  const progressBadges = [
    {
      id: 7,
      title: "Super Contributor",
      description: "Submit 200 civic reports",
      icon: Zap,
      color: "from-yellow-400 to-orange-500",
      progress: (userStats.totalReports / 200) * 100,
      current: userStats.totalReports,
      target: 200,
      rarity: "Legendary"
    },
    {
      id: 8,
      title: "Event Master",
      description: "Attend 25 volunteer events",
      icon: Heart,
      color: "from-red-400 to-pink-500",
      progress: (userStats.eventsAttended / 25) * 100,
      current: userStats.eventsAttended,
      target: 25,
      rarity: "Epic"
    },
    {
      id: 9,
      title: "Guardian Angel",
      description: "Maintain 30-day reporting streak",
      icon: Shield,
      color: "from-blue-400 to-cyan-500",
      progress: (userStats.streakDays / 30) * 100,
      current: userStats.streakDays,
      target: 30,
      rarity: "Epic"
    },
    {
      id: 10,
      title: "CIVI Millionaire",
      description: "Earn 5,000 CIVI tokens",
      icon: Crown,
      color: "from-purple-400 to-violet-500",
      progress: (userStats.civiEarned / 5000) * 100,
      current: userStats.civiEarned,
      target: 5000,
      rarity: "Legendary"
    }
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Common':
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
      case 'Rare':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
      case 'Epic':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300';
      case 'Legendary':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header with Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {userStats.totalReports}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Reports</div>
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {userStats.eventsAttended}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Events</div>
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {userStats.upvotesEarned}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Upvotes</div>
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {userStats.civiEarned}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">CIVI</div>
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {userStats.streakDays}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Day Streak</div>
          </CardContent>
        </Card>
      </div>

      {/* Earned Badges */}
      <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-slate-900 dark:text-white">
            <Award className="h-5 w-5" />
            <span>Earned Badges ({earnedBadges.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {earnedBadges.map((badge) => (
              <Card key={badge.id} className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-800 border-slate-200 dark:border-slate-600 hover:shadow-lg transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${badge.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <badge.icon className="h-6 w-6 text-white" />
                    </div>
                    <Badge className={getRarityColor(badge.rarity)}>
                      {badge.rarity}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                    {badge.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
                    {badge.description}
                  </p>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Earned on {new Date(badge.earnedDate).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Progress Badges */}
      <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-slate-900 dark:text-white">
            <Target className="h-5 w-5" />
            <span>Progress Towards Next Badges</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {progressBadges.map((badge) => (
              <Card key={badge.id} className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-800 border-slate-200 dark:border-slate-600">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${badge.color} flex items-center justify-center`}>
                        <badge.icon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900 dark:text-white">
                          {badge.title}
                        </h3>
                        <Badge className={getRarityColor(badge.rarity)} variant="secondary">
                          {badge.rarity}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                    {badge.description}
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600 dark:text-slate-400">Progress</span>
                      <span className="font-medium text-slate-900 dark:text-white">
                        {badge.current} / {badge.target}
                      </span>
                    </div>
                    <Progress 
                      value={badge.progress} 
                      className="h-2"
                    />
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {Math.round(badge.progress)}% complete
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Badge Information */}
      <Card className="bg-gradient-to-r from-teal-50 to-blue-50 dark:from-teal-900/20 dark:to-blue-900/20 border-teal-200 dark:border-teal-800">
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-blue-600 rounded-full flex items-center justify-center">
              <Star className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                How to Earn More Badges
              </h3>
              <p className="text-slate-600 dark:text-slate-300 mb-4">
                Badges are earned through active civic participation. Keep reporting issues, 
                attending events, and engaging with your community to unlock new achievements!
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="font-medium text-slate-900 dark:text-white">Common</div>
                  <div className="text-slate-600 dark:text-slate-400">Easy to earn</div>
                </div>
                <div>
                  <div className="font-medium text-blue-600 dark:text-blue-400">Rare</div>
                  <div className="text-slate-600 dark:text-slate-400">Moderate effort</div>
                </div>
                <div>
                  <div className="font-medium text-purple-600 dark:text-purple-400">Epic</div>
                  <div className="text-slate-600 dark:text-slate-400">Significant dedication</div>
                </div>
                <div>
                  <div className="font-medium text-yellow-600 dark:text-yellow-400">Legendary</div>
                  <div className="text-slate-600 dark:text-slate-400">Ultimate achievement</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Badges;
