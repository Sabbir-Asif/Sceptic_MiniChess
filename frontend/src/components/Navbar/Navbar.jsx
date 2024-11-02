import { FaChessKnight } from "react-icons/fa6";
import { BiSolidChess } from "react-icons/bi";
import { MdRule, MdLeaderboard, MdInfo } from "react-icons/md";
import { NavLink } from "react-router-dom";

const Navbar = () => {
    return (
        <div className="relative z-10 max-w-44 h-screen p-4">

            <div className="absolute inset-0 bg-black opacity-30"></div>

            <div className="relative z-20 flex flex-col h-full">
                <div className="">
                    <div>
                        <NavLink to={"/"}>
                            <span className="flex items-end">
                                <FaChessKnight className="text-4xl text-green-secondary" />
                                <h2 className="text-md md:text-xl font-medium text-base-100 italic">
                                    MiniChess
                                </h2>
                            </span>
                        </NavLink>
                    </div>
                    <div className="mt-16 flex flex-col gap-6">
                        <NavLink to={'/play'}>
                            <span className="flex justify-start items-center gap-2">
                                <BiSolidChess className="text-2xl text-gray-400" />
                                <p className="text-md text-gray-300 font-semibold">Play</p>
                            </span>
                        </NavLink>
                        <NavLink to={'/rules'}>
                            <span className="flex justify-start items-center gap-2">
                                <MdRule className="text-2xl text-gray-400" />
                                <p className="text-md text-gray-300 font-semibold">Rules</p>
                            </span>
                        </NavLink>
                        <NavLink to={'/records'}>
                            <span className="flex justify-start items-center gap-2">
                                <MdLeaderboard className="text-2xl text-gray-400" />
                                <p className="text-md text-gray-300 font-semibold">Records</p>
                            </span>
                        </NavLink>
                    </div>
                    <div className="mt-24 space-y-5">
                        <button className="py-2.5 w-full text-center rounded-sm bg-black-secondary text-gray-300 font-medium hover:border hover:border-gray-400">
                            Sign Up
                        </button>
                        <button className="py-2.5 w-full text-center rounded-sm bg-gradient-to-r from-green-secondary to-green-600 text-gray-200 font-medium hover:border hover:border-gray-400">
                            Sign In
                        </button>
                    </div>
                </div>

                <div className="absolute bottom-1">
                    <span className="flex gap-1 items-center text-gray-400">
                        <MdInfo className="text-lg" />
                        <p className="font-medium">Sceptic</p>
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
