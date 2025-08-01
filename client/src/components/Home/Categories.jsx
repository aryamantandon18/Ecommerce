import mobiles from "../../assets/images/Categories/phone.png";
import fashion from "../../assets/images/Categories/fashion.png";
import electronics from "../../assets/images/Categories/electronics.png";
import home from "../../assets/images/Categories/home.png";
import travel from "../../assets/images/Categories/travel.png";
import appliances from "../../assets/images/Categories/appliances.png";
import furniture from "../../assets/images/Categories/furniture.png";
import beauty from "../../assets/images/Categories/beauty.png";
import grocery from "../../assets/images/Categories/grocery.png";
import { Link } from "react-router-dom";

const catNav = [
    {
        name: "Mobiles",
        icon: mobiles,
    },
    {
        name: "Fashion",
        icon: fashion,
    },
    {
        name: "Electronics",
        icon: electronics,
    },
    {
        name: "Home",
        icon: home,
    },
    {
        name: "Travel",
        icon: travel,
    },
    {
        name: "Appliances",
        icon: appliances,
    },
    {
        name: "Furniture",
        icon: furniture,
    },
    {
        name: "Beauty,Toys & more",
        icon: beauty,
    },
    {
        name: "Grocery",
        icon: grocery,
    },
];

const Categories = () => {
    return (
        <section className="overflow-x-auto bg-white p-0 min-w-full px-1 pt-3 sm:pt-0 sm:px-12 shadow overflow-hidden scrollbar-none">
            <div className="flex items-center justify-between group">
                {catNav.map((item, i) => (
                    <Link
                        to={`/products`}
                        className="flex flex-col gap-1 items-center p-2"
                        key={i}
                    >
                        <div className="sm:h-20 sm:w-20 h-10 w-10">
                            <img
                                draggable="false"
                                className="h-full w-full object-contain"
                                src={item.icon}
                                alt={item.name}
                            />
                        </div>
                        <span className="text-xs sm:text-sm text-gray-800 font-medium group-hover:text-primary-blue">
                            {item.name.slice(0,11)}
                        </span>
                    </Link>
                ))}
            </div>
        </section>
    );
};

export default Categories;
