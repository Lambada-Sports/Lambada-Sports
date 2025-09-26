import Navbar from "./Navbar";
import Footer from "./Footer";

const HomePage = () => {
  return (
    <>
      <Navbar />

      {/* Hero Section with Background Image */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url("/assets/image.png")',
          }}
        ></div>

        {/* Green and Black Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-600/80 via-gray-900/70 to-black/80"></div>

        {/* Additional Pattern Overlay */}
        <div className="absolute inset-0 opacity-20">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, rgba(34, 197, 94, 0.3) 0%, transparent 50%),
                             radial-gradient(circle at 75% 75%, rgba(0, 0, 0, 0.4) 0%, transparent 50%)`,
            }}
          ></div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 text-center text-white px-4 max-w-8xl mx-auto">
          {/* Main Heading */}
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight">
            <span className="inline text-white">Any Sport</span>
            <span className="inline text-white">|</span>
            <span className="inline text-green-400">Any Design</span>
            <span className="inline text-white">|</span>
            <span className="inline text-white">Any Size</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl lg:text-2xl mb-8 font-medium max-w-4xl mx-auto text-gray-200">
            Built to perform and made to last, our process delivers precise
            personalization and pro-grade materials from first mockup to final
            stitch.
          </p>

          {/* Buttons Container */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-12">
            {/* Customize Own Design Button */}
            <button className="group bg-green-500 text-black px-10 py-4 text-xl font-bold rounded-lg hover:bg-green-400 transition-all duration-300 transform hover:scale-105 shadow-lg min-w-[280px] border-2 border-green-500 hover:border-green-400">
              <span className="flex items-center justify-center gap-3">
                <svg
                  className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
                CUSTOMIZE OWN DESIGN
              </span>
            </button>

            {/* Choose Your Product Button */}
            <button
              onClick={() => (window.location.href = "/products")}
              className="group bg-black text-white px-10 py-4 text-xl font-bold rounded-lg hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 shadow-lg min-w-[280px] border-2 border-gray-700 hover:border-gray-600"
            >
              <span className="flex items-center justify-center gap-3">
                <svg
                  className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
                CHOOSE YOUR PRODUCT
              </span>
            </button>
          </div>

          {/* Additional Info */}
          <div className="mt-16">
            <p className="text-sm md:text-base opacity-90 text-gray-300">
              PREMIUM QUALITY • FAST DELIVERY • CUSTOM DESIGNS
            </p>
          </div>
        </div>

        {/* Floating Elements with Green/Black Theme */}
        <div className="absolute top-1/4 left-10 w-20 h-20 border-2 border-green-400/40 rounded-full animate-pulse hidden lg:block"></div>
        <div className="absolute bottom-1/4 right-10 w-16 h-16 border-2 border-gray-400/30 rounded-full animate-pulse hidden lg:block"></div>
        <div className="absolute top-1/2 right-1/4 w-12 h-12 border border-green-300/20 rounded-full animate-pulse hidden lg:block"></div>
      </section>

      {/* Latest Lineup Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              LATEST <span className="text-green-600">LINEUP</span>
            </h2>
            <p className="text-lg text-gray-600">
              New signature collections. Grab yours now!
            </p>
          </div>

          {/* Products will be loaded from backend - placeholder for now */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Product placeholders - these will be populated from backend */}
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="bg-gray-100 rounded-lg p-8 text-center"
              >
                <div className="h-48 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-gray-500 text-sm">Product Image</span>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">
                  Product Name
                </h3>
                <p className="text-green-600 font-bold">$XX.XX</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Your Colors Your Crest Your Fit Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-black text-white overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url("/assets/image.png")',
          }}
        ></div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-600/70 via-gray-900/80 to-black/90"></div>

        {/* Content - Centered */}
        <div className="relative z-10 text-center px-4 max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-7xl font-bold mb-6">
            <span className="inline text-white">Your Colors.</span>
            <span className="inline text-green-400">Your Crest.</span>
            <span className="inline text-white">Your Fit.</span>
          </h2>
          <p className="text-xl mb-8 text-gray-200 max-w-2xl mx-auto">
            Pro-grade jerseys & kits built to perform, made to last.
          </p>
          <button
            onClick={() => (window.location.href = "/products")}
            className="bg-green-500 text-black px-10 py-4 text-lg font-bold rounded-lg hover:bg-green-400 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Shop Now →
          </button>
        </div>
      </section>

      {/* Best Sellers Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              <span className="text-green-600">BEST SELLERS</span>
            </h2>
            <p className="text-lg text-gray-600">
              The ultimate fan-favorite collection. Grab yours now!
            </p>
          </div>

          {/* Products will be loaded from backend - placeholder for now */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Product placeholders - these will be populated from backend */}
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500 text-sm">Product Image</span>
                </div>
                <div className="p-4 text-center">
                  <h3 className="font-semibold text-gray-800 mb-2">
                    Product Name
                  </h3>
                  <p className="text-green-600 font-bold">$XX.XX</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Custom Jerseys Section */}
      <section className="relative py-16 bg-black text-white overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url("/assets/custom-jerseys-bg.png")', // You can change this to your desired background
          }}
        ></div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-600/70 via-gray-900/80 to-black/90"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-green-400">Customize your Jerseys</span>
          </h2>
          <p className="text-xl mb-4 text-gray-200">
            Your Design. Your Game. Your Uniform
          </p>
          <p className="text-lg mb-8 text-gray-300">
            Start with pro looks, finish with your crest.
          </p>
          <button className="bg-green-500 text-black px-10 py-4 text-lg font-bold rounded-lg hover:bg-green-400 transition-all duration-300 transform hover:scale-105 shadow-lg">
            Customize your jersey →
          </button>
        </div>
      </section>

      {/* Final Best Sellers Section with League Logos */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              <span className="text-green-600">BEST SELLERS</span>
            </h2>
            <p className="text-lg text-gray-600">
              Start with pro looks, finish with your crest
            </p>
          </div>

          {/* League Logos Section */}
          <div className="flex flex-wrap justify-center items-center gap-8 mb-12">
            {/* Placeholder for league logos - you'll add actual logo images */}
            {[1, 2, 3, 4, 5, 6].map((logo) => (
              <div
                key={logo}
                className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center"
              >
                <span className="text-xs text-gray-500">Logo</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Newsletter
            </h3>
            <p className="text-gray-600 mb-6">
              Subscribe for exclusive deals, product updates & early-bird deals.
              No spam, pinky promise.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <button className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors duration-300 font-semibold">
                Sign up
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default HomePage;
