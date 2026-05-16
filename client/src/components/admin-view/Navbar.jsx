import {FaUser} from 'react-icons/fa6';

const Navbar = () => {
    return (
        <div className="bg-gray-700 text-white p-4 flex justify-between items-center">
            <h2 className="text-xl font-bold">E-Commerce Admin</h2>
            <div className="flex items-center">
                <span className="mr-4">Admin</span>
                <FaUser size={20} />
            </div>
        </div>
    );
};

export default Navbar;