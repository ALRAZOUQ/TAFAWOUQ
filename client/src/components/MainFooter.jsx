export default function MainFooter() {
  return (
    <footer className="bg-blue-900 text-gray-300 py-8">
      <div className="max-w-6xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Branding Section */}
        <div>
          <h2 className="text-2xl font-bold text-white">UniConnect</h2>
          <p className="mt-2 text-sm">
            A student-driven platform for sharing course insights, rating
            courses, and collaborating on academic success.
          </p>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col">
          <h3 className="text-lg font-semibold text-white">Quick Links</h3>
          <ul className="mt-2 space-y-2">
            <li>
              <a href="/home" className="hover:text-yellow-400">
                Home
              </a>
            </li>
            <li>
              <a href="/courses" className="hover:text-yellow-400">
                Courses
              </a>
            </li>
            <li>
              <a href="/community" className="hover:text-yellow-400">
                Community
              </a>
            </li>
            <li>
              <a href="/about" className="hover:text-yellow-400">
                About Us
              </a>
            </li>
          </ul>
        </div>

        {/* Contact & Social Media */}
        <div>
          <h3 className="text-lg font-semibold text-white">Contact Us</h3>
          <p className="mt-2 text-sm">📍 King Saud University, Riyadh</p>
          <p className="text-sm">📧 support@uniconnect.com</p>
          <p className="text-sm">📞 +966 555 987 654</p>

          {/* Social Icons */}
          <div className="flex space-x-4 mt-4">
            <a href="#" className="text-gray-400 hover:text-yellow-400">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#" className="text-gray-400 hover:text-yellow-400">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" className="text-gray-400 hover:text-yellow-400">
              <i className="fab fa-instagram"></i>
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center text-sm border-t border-gray-700 mt-6 pt-4">
        © {new Date().getFullYear()} UniConnect. All rights reserved.
      </div>
    </footer>
  );
}
