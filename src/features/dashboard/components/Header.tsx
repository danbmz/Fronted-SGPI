import { Menu } from "lucide-react"
import { useClock } from "../hooks/useClock"
import { useLocation } from "react-router-dom";
import { getPageTitle } from "@/utils/getPageTitle";

function Header () {
    const { formattedTime, formattedDate } = useClock();
    const { pathname } = useLocation();
    const title = getPageTitle(pathname)

    return (
        <header className="px-4 py-6 flex justify-between shadow-md">
            <div className="flex items-center gap-3">
                <div className="block md:hidden"><Menu /></div>
                <span className="text-xl font-bold"> {title}</span>
            </div>
            <div className="flex gap-2">
                <p>
                    {formattedDate}
                </p>
                <span>
                    {formattedTime}
                </span>
            </div>
        </header>
    )
}

export default Header