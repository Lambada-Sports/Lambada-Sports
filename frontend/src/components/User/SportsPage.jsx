import { useState, useEffect } from "react";
import { useSearchParams, useParams } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Filter, Grid, List, Search, Star } from "lucide-react";

const SportsPage = () => {
  const [searchParams] = useSearchParams();
  const { sport } = useParams();
  const [selectedSport, setSelectedSport] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");

  // Handle URL parameters for sport filtering
  useEffect(() => {
    const sportParam = searchParams.get("sport") || sport;

    if (sportParam) {
      setSelectedSport(sportParam);
    }
  }, [searchParams, sport]);

  const sports = [
    "All",
    "Cricket",
    "Football",
    "Rugby",
    "Volleyball",
    "Basketball",
    "Hockey",
  ];

  const categories = [
    "All",
    "Jerseys",
    "Tracksuits",
    "Bottom & Shorts",
    "Lifestyle Kits",
    "Hoodies",
    "Accessories",
  ];

  // Sample products data with sport associations
  const sampleProducts = [
    // Cricket Products
    {
      id: 1,
      name: "Premium Cricket Jersey",
      category: "Jerseys",
      sport: "Cricket",
      price: 49.99,
      image: "/assets/cricket.png",
      rating: 4.5,
      reviews: 124,
      description:
        "Professional grade cricket jersey with moisture-wicking fabric",
      isBestseller: true,
    },
    {
      id: 2,
      name: "Cricket Team Tracksuit",
      category: "Tracksuits",
      sport: "Cricket",
      price: 89.99,
      image: "/assets/cricket.png",
      rating: 4.6,
      reviews: 67,
      description: "Complete cricket tracksuit for training and warm-ups",
      isBestseller: false,
    },
    {
      id: 3,
      name: "Cricket Performance Shorts",
      category: "Bottom & Shorts",
      sport: "Cricket",
      price: 29.99,
      image: "/assets/cricket.png",
      rating: 4.4,
      reviews: 89,
      description: "Lightweight cricket shorts with flexible fabric",
      isBestseller: true,
    },
    {
      id: 4,
      name: "Cricket Team Hoodie",
      category: "Hoodies",
      sport: "Cricket",
      price: 64.99,
      image: "/assets/cricket.png",
      rating: 4.5,
      reviews: 45,
      description: "Comfortable cricket team hoodie for supporters",
      isBestseller: false,
    },

    // Football Products
    {
      id: 5,
      name: "Football Team Jersey",
      category: "Jerseys",
      sport: "Football",
      price: 54.99,
      image: "/assets/football.png",
      rating: 4.7,
      reviews: 156,
      description:
        "Professional football jersey with advanced fabric technology",
      isBestseller: true,
    },
    {
      id: 6,
      name: "Football Training Tracksuit",
      category: "Tracksuits",
      sport: "Football",
      price: 94.99,
      image: "/assets/football.png",
      rating: 4.8,
      reviews: 78,
      description: "Premium football tracksuit for training sessions",
      isBestseller: true,
    },
    {
      id: 7,
      name: "Football Shorts",
      category: "Bottom & Shorts",
      sport: "Football",
      price: 32.99,
      image: "/assets/football.png",
      rating: 4.3,
      reviews: 112,
      description: "Durable football shorts with moisture management",
      isBestseller: false,
    },

    // Basketball Products
    {
      id: 8,
      name: "Basketball Pro Jersey",
      category: "Jerseys",
      sport: "Basketball",
      price: 47.99,
      image: "/assets/basketball.png",
      rating: 4.6,
      reviews: 134,
      description: "Lightweight basketball jersey for peak performance",
      isBestseller: true,
    },
    {
      id: 9,
      name: "Basketball Training Shorts",
      category: "Bottom & Shorts",
      sport: "Basketball",
      price: 34.99,
      image: "/assets/basketball.png",
      rating: 4.4,
      reviews: 98,
      description: "High-performance basketball shorts with stretch fabric",
      isBestseller: false,
    },

    // Rugby Products
    {
      id: 10,
      name: "Rugby Team Jersey",
      category: "Jerseys",
      sport: "Rugby",
      price: 59.99,
      image: "/assets/rugby.png",
      rating: 4.8,
      reviews: 67,
      description: "Durable rugby jersey built for intense gameplay",
      isBestseller: true,
    },
    {
      id: 11,
      name: "Rugby Training Tracksuit",
      category: "Tracksuits",
      sport: "Rugby",
      price: 99.99,
      image: "/assets/rugby.png",
      rating: 4.7,
      reviews: 45,
      description: "Heavy-duty rugby tracksuit for training",
      isBestseller: false,
    },

    // Volleyball Products
    {
      id: 12,
      name: "Volleyball Team Jersey",
      category: "Jerseys",
      sport: "Volleyball",
      price: 44.99,
      image: "/assets/volleyball.png",
      rating: 4.5,
      reviews: 89,
      description: "Breathable volleyball jersey with quick-dry technology",
      isBestseller: false,
    },
    {
      id: 13,
      name: "Volleyball Performance Shorts",
      category: "Bottom & Shorts",
      sport: "Volleyball",
      price: 28.99,
      image: "/assets/volleyball.png",
      rating: 4.3,
      reviews: 76,
      description: "Flexible volleyball shorts for optimal movement",
      isBestseller: true,
    },

    // Hockey Products
    {
      id: 14,
      name: "Hockey Team Jersey",
      category: "Jerseys",
      sport: "Hockey",
      price: 52.99,
      image: "/assets/hockey.avif",
      rating: 4.6,
      reviews: 54,
      description: "Professional hockey jersey with reinforced design",
      isBestseller: false,
    },
    {
      id: 15,
      name: "Hockey Training Tracksuit",
      category: "Tracksuits",
      sport: "Hockey",
      price: 104.99,
      image: "/assets/hockey.avif",
      rating: 4.7,
      reviews: 32,
      description: "Warm hockey tracksuit for cold weather training",
      isBestseller: true,
    },

    // Universal/Multi-Sport Products
    {
      id: 16,
      name: "Sports Water Bottle",
      category: "Accessories",
      sport: "All",
      price: 19.99,
      image: "/assets/image.png",
      rating: 4.3,
      reviews: 267,
      description: "Insulated water bottle for all sports activities",
      isBestseller: false,
    },
    {
      id: 17,
      name: "Universal Sports Bag",
      category: "Accessories",
      sport: "All",
      price: 79.99,
      image: "/assets/image.png",
      rating: 4.6,
      reviews: 145,
      description: "Durable sports bag suitable for all sports",
      isBestseller: true,
    },
  ];

  // Filter products based on sport, category, and search term
  const filteredProducts = sampleProducts.filter((product) => {
    const matchesSport =
      selectedSport === "All" ||
      product.sport === selectedSport ||
      product.sport === "All";
    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesSport && matchesCategory && matchesSearch;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "rating":
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  const ProductCard = ({ product }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:scale-105">
      {product.isBestseller && (
        <div className="bg-green-500 text-white text-xs font-bold px-2 py-1 absolute z-10 rounded-br-lg">
          BESTSELLER
        </div>
      )}
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        <button className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md hover:bg-gray-50 transition-colors">
          <svg
            className="w-5 h-5 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-green-600 font-semibold uppercase tracking-wide">
              {product.category}
            </span>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-xs text-blue-600 font-semibold uppercase tracking-wide">
              {product.sport}
            </span>
          </div>
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm text-gray-600 ml-1">
              {product.rating} ({product.reviews})
            </span>
          </div>
        </div>
        <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
          {product.name}
        </h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-green-600">
            ${product.price}
          </span>
          <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors font-medium text-sm">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );

  const getSportIcon = (sportName) => {
    const iconMap = {
      Cricket: "🏏",
      Football: "⚽",
      Rugby: "🏈",
      Volleyball: "🏐",
      Basketball: "🏀",
      Hockey: "🏒",
    };
    return iconMap[sportName] || "🏆";
  };

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-600 via-gray-900 to-black text-white py-20">
        <div className="absolute inset-0 opacity-20">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, rgba(34, 197, 94, 0.3) 0%, transparent 50%),
                             radial-gradient(circle at 75% 75%, rgba(0, 0, 0, 0.4) 0%, transparent 50%)`,
            }}
          ></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="text-white">Sports </span>
            <span className="text-green-400">Collection</span>
          </h1>
          {selectedSport !== "All" && (
            <div className="flex items-center justify-center mb-4">
              <span className="text-4xl mr-3">
                {getSportIcon(selectedSport)}
              </span>
              <h2 className="text-2xl md:text-3xl font-semibold text-green-400">
                {selectedSport} Products
              </h2>
            </div>
          )}
          <p className="text-xl text-gray-200 max-w-2xl mx-auto">
            {selectedSport === "All"
              ? "Explore our complete range of sports-specific gear designed for peak performance"
              : `Professional ${selectedSport.toLowerCase()} gear built to perform and made to last`}
          </p>
        </div>
      </section>

      {/* Sports Products Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filters and Controls */}
          <div className="mb-8">
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative max-w-md mx-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search sports products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Sports Filter */}
            <div className="flex flex-wrap justify-center gap-2 mb-4">
              {sports.map((sport) => (
                <button
                  key={sport}
                  onClick={() => setSelectedSport(sport)}
                  className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedSport === sport
                      ? "bg-green-500 text-white"
                      : "bg-white text-gray-700 hover:bg-green-50 hover:text-green-600"
                  }`}
                >
                  {sport !== "All" && (
                    <span className="mr-2">{getSportIcon(sport)}</span>
                  )}
                  {sport}
                </button>
              ))}
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? "bg-blue-500 text-white"
                      : "bg-white text-gray-600 hover:bg-blue-50 hover:text-blue-600 border border-gray-300"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-4">
                <span className="text-gray-600">
                  {sortedProducts.length} products found
                  {selectedSport !== "All" && (
                    <span className="text-green-600 font-semibold">
                      {" "}
                      for {selectedSport}
                    </span>
                  )}
                </span>
              </div>
              <div className="flex items-center gap-4">
                {/* Sort Dropdown */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="name">Sort by Name</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>

                {/* View Mode Toggle */}
                <div className="flex bg-white rounded-lg border border-gray-300 overflow-hidden">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 ${
                      viewMode === "grid"
                        ? "bg-green-500 text-white"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 ${
                      viewMode === "list"
                        ? "bg-green-500 text-white"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div
            className={`grid gap-6 ${
              viewMode === "grid"
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "grid-cols-1"
            }`}
          >
            {sortedProducts.length > 0 ? (
              sortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  No products found
                </h3>
                <p className="text-gray-500">
                  Try selecting a different sport or adjusting your search
                  criteria
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Sport-Specific Call to Action */}
      <section className="relative bg-gradient-to-br from-green-600 via-gray-900 to-black text-white py-16">
        <div className="absolute inset-0 opacity-20">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, rgba(34, 197, 94, 0.3) 0%, transparent 50%),
                             radial-gradient(circle at 75% 75%, rgba(0, 0, 0, 0.4) 0%, transparent 50%)`,
            }}
          ></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {selectedSport !== "All"
              ? `Need Custom ${selectedSport} Gear?`
              : "Need Custom Sports Gear?"}
          </h2>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            {selectedSport !== "All"
              ? `Get custom ${selectedSport.toLowerCase()} uniforms designed specifically for your team's needs`
              : "Get custom sports uniforms designed specifically for your team's needs"}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-green-500 text-black px-8 py-3 rounded-lg hover:bg-green-400 transition-colors font-bold text-lg">
              Customize Your Gear
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-black transition-colors font-bold text-lg">
              Contact Our Team
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default SportsPage;
