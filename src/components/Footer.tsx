import { FaHome, FaMusic, FaUser } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white py-2">
      <div className="mx-auto max-w-[350px] px-4">
        <div className="flex justify-between items-center">
          <button className="focus:outline-none focus:ring-2 focus:ring-white rounded-full p-2 transition-colors duration-200 hover:bg-gray-700">
            <FaHome className="w-5 h-5" />
          </button>
          <button className="focus:outline-none focus:ring-2 focus:ring-white rounded-full p-2 transition-colors duration-200 hover:bg-gray-700">
            <FaMusic className="w-5 h-5" />
          </button>
          <button className="focus:outline-none focus:ring-2 focus:ring-white rounded-full p-2 transition-colors duration-200 hover:bg-gray-700">
            <FaUser className="w-5 h-5" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;