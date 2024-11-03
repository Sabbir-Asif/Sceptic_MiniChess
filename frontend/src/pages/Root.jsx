import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";

const Root = () => {
    return (
        <div className="bg-black-secondary font-poppins">
            <div className="flex">
                <Navbar />
                <span className=" max-h-screen my-auto overflow-scroll container mx-auto">
                    <Outlet />
                </span>
            </div>
        </div>
    );
};

export default Root;