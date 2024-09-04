import { FaHome, FaMusic, FaUser } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="fixed bottom-0 w-full bg-gray-800 text-white py-4">
      <div className="container mx-auto flex justify-between items-center px-8">
        <FaHome className="text-2xl w-6 h-6" />
        <FaMusic className="text-2xl w-6 h-6" />
        <FaUser className="text-2xl w-6 h-6" />
      </div>
    </footer>
  );
};

export default Footer;