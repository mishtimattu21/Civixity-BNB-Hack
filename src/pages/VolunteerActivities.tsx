
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
  ChevronRight
} from "lucide-react";

const VolunteerActivities = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const events = [
    {
      id: 1,
      title: "Beach Cleanup Drive",
      description: "Join us for a community beach cleanup to protect marine life and keep our shores beautiful.",
      date: "2024-01-20",
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
      title: "Tree Planting Initiative",
      description: "Help us plant native trees in the city park to improve air quality and create green spaces.",
      date: "2024-01-25",
      time: "8:00 AM - 11:00 AM", 
      location: "Central City Park",
      participants: 32,
      maxParticipants: 40,
      points: 75,
      status: "upcoming",
      category: "Environment"
    },
    {
      id: 3,
      title: "Community Garden Setup",
      description: "Participate in setting up a community garden where residents can grow their own vegetables.",
      date: "2024-01-15",
      time: "10:00 AM - 2:00 PM",
      location: "Riverside Community Center",
      participants: 25,
      maxParticipants: 25,
      points: 100,
      status: "completed",
      category: "Community"
    },
    {
      id: 4,
      title: "Senior Citizens Support",
      description: "Volunteer to assist senior citizens with grocery shopping and basic errands.",
      date: "2024-01-12",
      time: "2:00 PM - 5:00 PM",
      location: "Various Locations",
      participants: 18,
      maxParticipants: 20,
      points: 60,
      status: "completed",
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
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300';
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
              {selectedDate ? (
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
          </div>

          {selectedDate && getEventsForDate(selectedDate).length === 0 ? (
            <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <CardContent className="p-8 text-center">
                <CalendarIcon className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                  No events scheduled
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  There are no volunteer activities scheduled for this date.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {(selectedDate ? getEventsForDate(selectedDate) : events).map((event) => (
                <Card key={event.id} className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                            {event.title}
                          </h3>
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
