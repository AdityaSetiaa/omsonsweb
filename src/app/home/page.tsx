"use client";

import { GiHamburgerMenu } from "react-icons/gi";
import { useId, useState } from "react";
import { ImageSlider } from "@/Components/imageSlider";
import { bottleProducts } from "@/Assets/dataset";
import { NAV_LINKS } from "@/Assets/dataset";
import { CATEGORY_CARDS } from "@/Assets/dataset";
import Footer from "@/Components/Footer";
import Link from "next/link";
import Header from "@/Components/Header";

function page() {
    const [on, setON] = useState(false);
    const id = useId();

    const onToggle = () => setON(!on);

    return (
        <div className="w-full h-auto bg-gray-100 text-black">
            <div className="bg-slate-950 relative h-10 flex items-center text-white gap-4 text-sm w-full px-4">
                <GiHamburgerMenu className="h-5 w-5 cursor-pointer" onClick={onToggle} />

                <div className="hidden md:flex gap-4">
                    {NAV_LINKS.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="rounded-md px-3 py-2 text-sm font-medium hover:bg-slate-800 transition-colors"
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                {on && (
                    <div className="absolute top-10 left-0 py-4 px-2 z-50 w-48 bg-slate-900 text-white shadow-lg rounded-md flex flex-col gap-1 lg:hidden ml-2 mt-2">
                        {NAV_LINKS.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="px-4 py-2 text-sm hover:bg-slate-800 transition-colors rounded-md"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            <div className="relative w-full ">
                <div className="relative w-full bg-linear-to-b from-slate-800 to-gray-50 flex items-center">
                    <ImageSlider />
                </div>

                <div
                    id="products"
                    className=" mt-[-40] w-full mx-auto px-4 py-8 bg-transparent rounded-lg shadow-md z-30 "
                >
                    <div className="relative z-10  px-4 pb-8">
                        <div className="grid grid-cols-1 -mt-[clamp(20px,2vw,500px)]  sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-[1400px] mx-auto">
                            {CATEGORY_CARDS.map((cat) => (
                                <div
                                    key={cat.title}
                                    className="bg-card text-card-foreground p-5 rounded-sm shadow-sm flex flex-col bg-white"
                                >
                                    <h2 className="text-lg font-bold mb-3 dark:bg-white dark:text-black">
                                        {cat.title}{" "}
                                    </h2>
                                    <div className="grid grid-cols-2 gap-3 flex-1">
                                        {cat.items.map((item) => (
                                            <a key={item.label} href={cat.link} className="group">
                                                <img
                                                    src={item.imageUrl}
                                                    alt={item.label}
                                                    loading="lazy"
                                                    className="w-full aspect-square object-cover rounded-sm"
                                                />
                                                <span className="text-xs mt-1 block text-black transition-colors">
                                                    {item.label}
                                                </span>
                                            </a>
                                        ))}
                                    </div>
                                    <Link
                                        href="/Products"
                                        className="mt-3 text-sm text-black hover:underline"
                                    >
                                        See more
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-white p-4 shadow-md mx-auto w-full max-w-[1400px]">
                        <h2 className="text-lg font-bold mb-3">Recently Bought</h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 max-w-[1400px] mx-auto flex flex-col items-center gap-2 w-full hover:opacity-100 h-auto p-2 rounded-md transition relative group duration-500">
                            {bottleProducts.map((bottle) => (
                                <a
                                    key={bottle.name}
                                    href={bottle.link}
                                    className="block hover:opacity-90 transition"
                                >
                                    <img
                                        src={bottle.image}
                                        alt={bottle.name}
                                        className="w-full aspect-square object-cover rounded-sm"
                                    />
                                    <span className="text-xs mt-2 block text-black">
                                        {bottle.name}
                                    </span>
                                </a>
                            ))}
                        </div>
                    </div>
                    <div className=" mt-10 z-10  px-4 pb-8">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-[1400px] mx-auto">
                            {CATEGORY_CARDS.map((cat) => (
                                <div
                                    key={cat.title}
                                    className="bg-card text-card-foreground p-5 rounded-sm shadow-sm flex flex-col bg-white"
                                >
                                    <h2 className="text-lg font-bold mb-3">{cat.title}</h2>
                                    <div className="grid grid-cols-2 gap-3 flex-1">
                                        {cat.items.map((item) => (
                                            <a key={item.label} href={cat.link} className="group">
                                                <img
                                                    src={item.imageUrl}
                                                    alt={item.label}
                                                    loading="lazy"
                                                    className="w-full aspect-square object-cover rounded-sm"
                                                />
                                                <span className="text-xs mt-1 block text-black transition-colors">
                                                    {item.label}
                                                </span>
                                            </a>
                                        ))}
                                    </div>
                                    <a
                                        href={cat.link}
                                        className="mt-3 text-sm text-black hover:underline"
                                    >
                                        See more
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default page;
