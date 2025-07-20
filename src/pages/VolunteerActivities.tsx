
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { 
  Calendar as CalendarIcon, 
  MapPin, 
  Clock, 
  Users, 
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Leaf,
  Heart,
  BookOpen,
  PawPrint,
  GraduationCap
} from "lucide-react";

const VolunteerActivities = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date('2024-07-20'));
  const [currentMonth, setCurrentMonth] = useState(new Date('2024-07-01'));
  const [showAllEvents, setShowAllEvents] = useState(false);

  const events = [
    {
      id: 1,
      title: "Beach Cleanup Drive",
      description: "Join us for a community beach cleanup to protect marine life and keep our shores beautiful. We'll collect plastic waste, clean up debris, and educate visitors about marine conservation.",
      date: "2024-07-20",
      time: "9:00 AM - 12:00 PM",
      location: "Marina Beach, South End",
      participants: 45,
      maxParticipants: 60,
      points: 50,
      status: "upcoming",
      category: "Environment"
    },
    {
      id: 2,
      title: "Orphanage Donation Drive",
      description: "Help collect and organize donations for local orphanages. We'll gather books, toys, clothes, and educational materials to support children in need.",
      date: "2024-07-22",
      time: "10:00 AM - 3:00 PM",
      location: "Community Center, Downtown",
      participants: 28,
      maxParticipants: 35,
      points: 75,
      status: "upcoming",
      category: "Community"
    },
    {
      id: 3,
      title: "Tree Planting Initiative",
      description: "Help us plant native trees in the city park to improve air quality and create green spaces. Learn about local flora and contribute to urban reforestation.",
      date: "2024-07-25",
      time: "8:00 AM - 11:00 AM", 
      location: "Central City Park",
      participants: 32,
      maxParticipants: 40,
      points: 75,
      status: "upcoming",
      category: "Environment"
    },
    {
      id: 4,
      title: "Senior Citizens Support",
      description: "Volunteer to assist senior citizens with grocery shopping, basic errands, and provide companionship. Help make their day brighter with your presence.",
      date: "2024-07-27",
      time: "2:00 PM - 5:00 PM",
      location: "Various Locations",
      participants: 18,
      maxParticipants: 20,
      points: 60,
      status: "upcoming",
      category: "Community"
    },
    {
      id: 5,
      title: "Blood Donation Camp",
      description: "Participate in our blood donation drive to help save lives. Medical professionals will be present to ensure a safe and comfortable donation experience.",
      date: "2024-07-29",
      time: "9:00 AM - 4:00 PM",
      location: "City Hospital, Main Wing",
      participants: 55,
      maxParticipants: 80,
      points: 100,
      status: "upcoming",
      category: "Health"
    },
    {
      id: 6,
      title: "Street Art & Graffiti Cleanup",
      description: "Help clean up unwanted graffiti and create beautiful street art in designated areas. Transform urban spaces with positive community art.",
      date: "2024-07-31",
      time: "10:00 AM - 2:00 PM",
      location: "Downtown Art District",
      participants: 22,
      maxParticipants: 30,
      points: 65,
      status: "upcoming",
      category: "Community"
    },
    {
      id: 7,
      title: "Food Bank Volunteering",
      description: "Sort, package, and distribute food items to families in need. Help ensure no one goes hungry in our community.",
      date: "2024-08-02",
      time: "11:00 AM - 3:00 PM",
      location: "Community Food Bank",
      participants: 35,
      maxParticipants: 45,
      points: 55,
      status: "upcoming",
      category: "Community"
    },
    {
      id: 8,
      title: "Animal Shelter Support",
      description: "Help care for abandoned animals at the local shelter. Activities include feeding, cleaning, walking dogs, and socializing with cats.",
      date: "2024-08-05",
      time: "9:00 AM - 1:00 PM",
      location: "City Animal Shelter",
      participants: 15,
      maxParticipants: 20,
      points: 70,
      status: "upcoming",
      category: "Animals"
    },
    {
      id: 9,
      title: "Digital Literacy Workshop",
      description: "Teach basic computer skills to senior citizens and help them stay connected with their families through technology.",
      date: "2024-08-07",
      time: "2:00 PM - 5:00 PM",
      location: "Senior Community Center",
      participants: 12,
      maxParticipants: 15,
      points: 80,
      status: "upcoming",
      category: "Education"
    },
    {
      id: 10,
      title: "Community Garden Maintenance",
      description: "Help maintain the community garden by weeding, watering, and harvesting vegetables. Learn sustainable gardening practices.",
      date: "2024-08-10",
      time: "8:00 AM - 11:00 AM",
      location: "Riverside Community Garden",
      participants: 20,
      maxParticipants: 25,
      points: 45,
      status: "upcoming",
      category: "Environment"
    },
    {
      id: 11,
      title: "Library Book Drive",
      description: "Collect and organize books for underprivileged schools. Help promote literacy and education in our community.",
      date: "2024-08-12",
      time: "10:00 AM - 4:00 PM",
      location: "Central Library",
      participants: 25,
      maxParticipants: 30,
      points: 60,
      status: "upcoming",
      category: "Education"
    },
    {
      id: 12,
      title: "Elderly Home Visit",
      description: "Visit elderly residents in nursing homes, provide companionship, read to them, and help with recreational activities.",
      date: "2024-08-15",
      time: "3:00 PM - 6:00 PM",
      location: "Sunset Nursing Home",
      participants: 18,
      maxParticipants: 25,
      points: 65,
      status: "upcoming",
      category: "Community"
    }
  ];

  const getEventsForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return events.filter(event => event.date === dateString);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
      case 'completed':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Environment':
        return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300';
      case 'Community':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300';
      case 'Health':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300';
      case 'Animals':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300';
      case 'Education':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Environment':
        return Leaf;
      case 'Community':
        return Heart;
      case 'Health':
        return Heart;
      case 'Animals':
        return PawPrint;
      case 'Education':
        return GraduationCap;
      default:
        return BookOpen;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Calendar Section */}
        <Card className="lg:w-1/3 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          <CardHeader>
            <CardTitle className="text-slate-900 dark:text-white">Activity Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              month={currentMonth}
              onMonthChange={setCurrentMonth}
              className="rounded-md border border-slate-200 dark:border-slate-700"
              modifiers={{
                hasEvent: (date) => getEventsForDate(date).length > 0
              }}
              modifiersStyles={{
                hasEvent: { 
                  backgroundColor: 'rgb(20 184 166)', 
                  color: 'white',
                  fontWeight: 'bold'
                }
              }}
            />
            <div className="mt-4 text-sm text-slate-600 dark:text-slate-400">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-3 h-3 bg-teal-500 rounded-full"></div>
                <span>Days with events</span>
              </div>
              <div className="text-xs">
                Click on highlighted dates to view events
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Events List */}
        <div className="lg:w-2/3 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              {showAllEvents ? (
                'All Upcoming Events'
              ) : selectedDate ? (
                `Events for ${selectedDate.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}`
              ) : (
                'All Events'
              )}
            </h2>
            <div className="flex space-x-2">
              <Button
                variant={showAllEvents ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setShowAllEvents(!showAllEvents);
                  if (showAllEvents) {
                    setSelectedDate(new Date('2024-07-20'));
                  } else {
                    setSelectedDate(undefined);
                  }
                }}
              >
                {showAllEvents ? 'View by Date' : 'View All Events'}
              </Button>
            </div>
          </div>

          {!showAllEvents && selectedDate && getEventsForDate(selectedDate).length === 0 ? (
            <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <CardContent className="p-8 text-center">
                <CalendarIcon className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                  No events scheduled
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  There are no volunteer activities scheduled for this date.
                </p>
                <Button 
                  className="mt-4 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700"
                  onClick={() => setShowAllEvents(true)}
                >
                  View All Events
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {(showAllEvents ? events : (selectedDate ? getEventsForDate(selectedDate) : events)).map((event) => (
                <Card key={event.id} className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="flex items-center space-x-2">
                            {(() => {
                              const IconComponent = getCategoryIcon(event.category);
                              return <IconComponent className="h-4 w-4 text-slate-600 dark:text-slate-400" />;
                            })()}
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                              {event.title}
                            </h3>
                          </div>
                          <Badge className={getStatusColor(event.status)}>
                            {event.status === 'completed' ? (
                              <>
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Completed
                              </>
                            ) : (
                              'Upcoming'
                            )}
                          </Badge>
                          <Badge className={getCategoryColor(event.category)}>
                            {event.category}
                          </Badge>
                        </div>
                        <p className="text-slate-600 dark:text-slate-300 mb-3">
                          {event.description}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                        <CalendarIcon className="h-4 w-4" />
                        <span>{new Date(event.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                        <Clock className="h-4 w-4" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                        <MapPin className="h-4 w-4" />
                        <span>{event.location}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center space-x-1 text-slate-600 dark:text-slate-400">
                          <Users className="h-4 w-4" />
                          <span>{event.participants}/{event.maxParticipants} participants</span>
                        </div>
                        <div className="flex items-center space-x-1 text-yellow-600 dark:text-yellow-400">
                          <span className="font-medium">+{event.points} CIVI</span>
                        </div>
                      </div>
                      
                      {event.status === 'upcoming' ? (
                        <Button 
                          className="bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700"
                          disabled={event.participants >= event.maxParticipants}
                        >
                          {event.participants >= event.maxParticipants ? 'Full' : 'Register'}
                        </Button>
                      ) : (
                        <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                          +{event.points} CIVI Earned
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VolunteerActivities;
