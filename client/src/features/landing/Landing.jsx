import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-green-100">

      {/* Navigation */}
      <nav className="container mx-auto flex flex-col sm:flex-row items-center justify-between px-4 sm:px-6 py-4 sm:py-6 gap-4 sm:gap-0">
        <h1 className="text-xl sm:text-2xl font-bold text-green-800 text-center sm:text-left">
          Livestock DMS
        </h1>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
          <Link to="/sign-in" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto px-6 py-2 rounded-full border border-green-700 text-green-700 hover:bg-green-700 hover:text-white transition">
              Login
            </button>
          </Link>

          <Link to="/sign-up" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto px-6 py-2 rounded-full bg-green-700 text-white hover:bg-green-800 transition">
              Register
            </button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="container mx-auto px-4 sm:px-6 py-16 sm:py-20 text-center">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
          Smart Livestock Health Management
        </h2>

        <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10">
          Track animal diseases, manage treatments, store health records,
          and use AI-powered diagnosis tools to keep your livestock healthy
          and productive.
        </p>

        <Link to="/sign-up">
          <button className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white px-8 py-3 sm:py-4 rounded-xl text-lg shadow-lg transition">
            Get Started Free
          </button>
        </Link>

        {/* Features */}
        <section className="mt-16 sm:mt-24 grid gap-6 sm:gap-8 md:grid-cols-3 text-left">

          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow hover:shadow-lg transition">
            <h3 className="text-lg sm:text-xl font-semibold mb-3 text-green-700">
              AI Symptom Checker
            </h3>
            <p className="text-gray-600 text-sm sm:text-base">
              Select symptoms and receive instant disease predictions,
              prevention tips, and treatment recommendations.
            </p>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow hover:shadow-lg transition">
            <h3 className="text-lg sm:text-xl font-semibold mb-3 text-green-700">
              Health Records
            </h3>
            <p className="text-gray-600 text-sm sm:text-base">
              Maintain complete medical histories for cows, goats, sheep,
              and poultry in one centralized dashboard.
            </p>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow hover:shadow-lg transition">
            <h3 className="text-lg sm:text-xl font-semibold mb-3 text-green-700">
              Farmer & Animal Management
            </h3>
            <p className="text-gray-600 text-sm sm:text-base">
              Register farmers, manage livestock, monitor status, and
              streamline farm operations efficiently.
            </p>
          </div>

        </section>
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-gray-500 text-sm px-4">
        © {new Date().getFullYear()} Livestock DMS. All rights reserved.
      </footer>

    </div>
  );
};

export default Landing;