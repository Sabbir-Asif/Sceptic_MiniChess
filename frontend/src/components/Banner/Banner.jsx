import { FaUserFriends } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
const Banner = () => {

    const navigate = useNavigate();

    return (
        <div className="flex justify-center items-center gap-16 p-4 max-w-5xl mx-auto">
            <div className="">
                <img src="/images/minichess.png" alt="Chess Image" />
            </div>
            <div className="">
                <div className="space-y-4">
                    <h2 className="text-5xl text-base-300 font-bold">Play an exciting version of chess!</h2>
                    <span className="flex justify-start gap-10 text-sm font-medium italic text-gray-400">
                        <p>Mini Chess 6x5 version</p>
                        <p>play now!</p>
                    </span>
                </div>
                <div className="mt-9 flex flex-col gap-4 max-w-80 justify-center">
                    <button className="p-6 bg-green-secondary rounded-md border-b-green-700 border-b-4 text-base-300 text-3xl font-semibold hover:border hover:border-b-green-600 hover:border-b-4">
                        <span className="flex items-center gap-2">
                            <img src="https://cdn.iconscout.com/icon/free/png-256/free-ai-robot-icon-download-in-svg-png-gif-file-formats--robotic-machine-artificial-intelligence-deep-learning-pack-network-communication-icons-3339935.png?f=webp&h=112" alt="ai" className="w-10" />
                            <p className="mt-1">Play with AI</p>
                        </span>
                    </button>
                    <button className="p-6 bg-black-primary rounded-md border-black border text-base-300 text-2xl font-semibold hover:border hover:border-b-green-600 hover:border-b-4"
                    onClick={()=> {navigate('/play-human')}}
                    >
                        <span className="flex items-center gap-2">
                            <FaUserFriends className="text-3xl" />
                            <p className="mt-1">Play with Friend</p>
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Banner;