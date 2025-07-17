
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Coins, 
  Search, 
  Filter,
  Car,
  Utensils,
  ShoppingBag,
  Zap,
  Coffee,
  Film
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const RedeemPoints = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const userBalance = 1247;

  const offers = [
    {
      id: 1,
      title: "Metro Card - 10 Rides",
      description: "Get 10 free metro rides with this transport voucher",
      brand: "City Metro",
      points: 200,
      category: "transport",
      icon: Car,
      discount: "Worth ₹100"
    },
    {
      id: 2,
      title: "Municipal Tax Discount",
      description: "5% discount on your next municipal tax payment",
      brand: "City Hall",
      points: 500,
      category: "utilities",
      icon: Zap,
      discount: "5% Off"
    },
    {
      id: 3,
      title: "Local Restaurant Voucher",
      description: "₹250 voucher for participating local restaurants",
      brand: "FoodieHub",
      points: 400,
      category: "food",
      icon: Utensils,
      discount: "₹250 Value"
    },
    {
      id: 4,
      title: "Coffee Shop Credits",
      description: "Free coffee voucher at partner coffee shops",
      brand: "Bean & Brew",
      points: 150,
      category: "food",
      icon: Coffee,
      discount: "Free Coffee"
    },
    {
      id: 5,
      title: "Shopping Mall Discount",
      description: "10% discount at City Center Mall",
      brand: "City Center",
      points: 300,
      category: "shopping",
      icon: ShoppingBag,
      discount: "10% Off"
    },
    {
      id: 6,
      title: "Movie Theater Tickets",
      description: "Buy 1 Get 1 free movie tickets",
      brand: "CineMax",
      points: 350,
      category: "entertainment",
      icon: Film,
      discount: "BOGO"
    },
    {
      id: 7,
      title: "Bus Pass - Monthly",
      description: "One month unlimited city bus travel",
      brand: "City Transport",
      points: 800,
      category: "transport",
      icon: Car,
      discount: "Worth ₹500"
    },
    {
      id: 8,
      title: "Electricity Bill Discount",
      description: "₹100 credit on your next electricity bill",
      brand: "Power Grid",
      points: 250,
      category: "utilities",
      icon: Zap,
      discount: "₹100 Credit"
    }
  ];

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "transport", label: "Transport" },
    { value: "utilities", label: "Utilities" },
    { value: "food", label: "Food & Dining" },
    { value: "shopping", label: "Shopping" },
    { value: "entertainment", label: "Entertainment" }
  ];

  const filteredOffers = offers.filter(offer => {
    const matchesSearch = offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         offer.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         offer.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || offer.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'transport':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
      case 'utilities':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'food':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300';
      case 'shopping':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300';
      case 'entertainment':
        return 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const canAfford = (points: number) => userBalance >= points;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header with Balance */}
      <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-800">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Redeem Your CIVI Points
              </h1>
              <p className="text-slate-600 dark:text-slate-300">
                Exchange your civic engagement points for real-world benefits
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-2 justify-end mb-1">
                <Coins className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                <span className="text-3xl font-bold text-yellow-700 dark:text-yellow-300">
                  {userBalance.toLocaleString()}
                </span>
              </div>
              <p className="text-sm text-yellow-600 dark:text-yellow-400">Available CIVI Points</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search offers..."
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

      {/* Offers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOffers.map((offer) => (
          <Card key={offer.id} className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-teal-100 to-blue-100 dark:from-teal-900/50 dark:to-blue-900/50 rounded-lg flex items-center justify-center">
                    <offer.icon className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white text-sm">
                      {offer.brand}
                    </h3>
                    <Badge className={getCategoryColor(offer.category)} variant="secondary">
                      {categories.find(c => c.value === offer.category)?.label.split(' ')[0]}
                    </Badge>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                  {offer.discount}
                </Badge>
              </div>

              <div className="mb-4">
                <h4 className="font-medium text-slate-900 dark:text-white mb-2">
                  {offer.title}
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {offer.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
                <div className="flex items-center space-x-2">
                  <Coins className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {offer.points.toLocaleString()}
                  </span>
                  <span className="text-sm text-slate-500 dark:text-slate-400">points</span>
                </div>
                <Button 
                  size="sm"
                  disabled={!canAfford(offer.points)}
                  className={`${
                    canAfford(offer.points) 
                      ? 'bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700' 
                      : 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed'
                  }`}
                >
                  {canAfford(offer.points) ? 'Redeem' : 'Insufficient'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredOffers.length === 0 && (
        <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          <CardContent className="p-8 text-center">
            <Search className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
              No offers found
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

export default RedeemPoints;
