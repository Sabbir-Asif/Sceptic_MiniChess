import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";

const Root = () => {
    return (
        <div className="bg-black-secondary font-poppins">
            <div className="flex">
                <Navbar />
                <span className="mt-24 container mx-auto">
                    <Outlet />
                </span>
            </div>
        </div>
    );
};

export default Root;