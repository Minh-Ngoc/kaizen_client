import Profile from "app/components/Navbar/components/Profile";

function Navbar() {
    return (  
        <div className="absolute top-2 right-12 text-white">
            <div className="flex items-center pr-4 w-full">
                <Profile />
            </div>
        </div>
    );
}

export default Navbar;