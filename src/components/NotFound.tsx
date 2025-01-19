import { Oops } from "../assets";
import { useNavigate } from "react-router-dom";
const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <img src={Oops} alt="Page Not Found" className="w-96 h-auto mb-8" />

      <h1 className="text-4xl font-bold text-gray-900 mb-4">Page Not Found</h1>
      <p className="text-lg text-gray-600 mb-8">
        Oops! The page you're looking for doesn't exist.
      </p>
      <button
        onClick={() => navigate("/")}
        className="px-6 py-3 bg-[#014e7a] text-white rounded-lg hover:bg-[#A9DDD6] transition-colors"
      >
        Go Back
      </button>
    </div>
  );
};

export default NotFound;
