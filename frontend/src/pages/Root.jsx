import Banner from "../components/Banner/Banner";
import Navbar from "../components/Navbar/Navbar";

const Root = () => {
    return (
        <div className="bg-black-secondary font-poppins">
            <div className="flex">
                <Navbar />
                <span className="mt-24 container mx-auto">
                    <Banner />
                </span>
            </div>
        </div>
    );
};

export default Root;