import Profile from "app/components/Navbar/components/Profile";

function Navbar() {
    return (  
        <div className="absolute top-2 right-4 text-white">
            <div className="bg-table rounded-lg shadow-wrapper flex items-center pl-2 pr-6 w-full">
                <Profile />
            </div>
        </div>
    );
}

export default Navbar;