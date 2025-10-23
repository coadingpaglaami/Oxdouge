import Image from "next/image";

export const  Work=()=> {
    const cards = [
        {
            id: 1,
            title: "Browse",
            description: "Designed to deliver maximum heat while consuming minimal power.",
            icon: "/temp/fire.svg"
        },
        {
            id: 2,
            title: "Choose",
            description: "Enjoy clean, odorless warmth — no smoke, no fumes, just pure comfort.",
            icon: "/temp/air.svg"
        },
        {
            id: 3,
            title: "Checkout",
            description: "Weather-resistant and durable construction for harsh outdoor conditions.",
            icon: "/temp/shield.svg"
        },
        {
            id: 4,
            title: "Adventure Ready",
            description: "Designed for hiking, camping, overlanding, and emergency preparedness.",
            icon: "/temp/badge.svg"
        },
    ];
 
    return (
        <div className="bg-[#001211] text-white py-10 px-4">
            {/* Header */}
            <div className="text-center max-w-2xl mx-auto mb-10">
                <div className="text-[#FFD345] border border-[#FFD345D6] px-4 py-2 rounded-lg inline-flex items-center justify-center mb-4">
                    <Image src="/temp/starts.svg" alt="Starts" className="h-6 w-6 mr-2" height={40} width={40} />
                    <p className="font-medium">Simple Process</p>
                </div>
                <h1 className="text-3xl md:text-5xl font-bold mb-2">How it works</h1>
                <p className="text-base md:text-lg text-[#C2C2C2]">Four simple steps to warmth and comfort</p>
            </div>
 
            {/* Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, index) => (
                    <div
                        key={card.id}
                        className="relative border border-[#FFD34599] p-6 rounded-md bg-opacity-10"
                    >
                        {/* Icon */}
                        <Image
                            src={card.icon}
                            alt={card.title}
                            height={40}
                            width={40}
                            className="h-14 w-14 mb-4 bg-[#FFD34540] p-3 rounded-md"
                        />
 
                        {/* Step Number */}
                        <h1 className="font-bold text-[#FFD34538] absolute -top-2.5 right-4 text-[48px] md:text-[64px] select-none">
                            0{card.id}
                        </h1>
 
                        {/* Title and Description */}
                        <h2 className="font-semibold text-[#FFD345] text-xl md:text-2xl mb-2">
                            {card.title}
                        </h2>
                        <p className="text-sm text-[#D9D9D9]">{card.description}</p>
 
                        {/* Connector line (only on larger screens) */}
                        {index !== cards.length - 1 && (
                            <div className="hidden lg:block h-1 w-7 bg-linear-to-r from-[#FFD345] to-[#241C05] absolute right-[-22px] top-1/2 transform -translate-y-1/2" />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
 