import Image from "next/image";

export const ContactCard = () => {
  const data = [
    {
      title: "Email Us",
      description: `Send us an email anytime`,
      icons: "/contactus/message.svg",
      contact: "support@notoverland.com",
    },
    {
      title: "Call Us",
      description: `Mon-Fri from 8am to 6pm MST`,
      contact: "+546875354346",
      icons: "/contactus/phone.svg",
    },
    {
      title: "Visit Us",
      description: `Come say hello at our office`,
      contact: "1234 Adventure Blvd",
      icons: "/contactus/location.svg",
    },
  ];

  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-6 py-12">
      {data.map((item, idx) => (
        <div
          key={idx}
          className="border border-primary/50 rounded-lg flex flex-col items-center text-center gap-4 p-8 bg-[#121212]"
        >
          <div className="w-16 h-16 rounded-full bg-primary/25 flex items-center justify-center ">
            <Image src={item.icons} alt={item.title} width={32} height={32} />
          </div>

          <h3 className="text-xl font-semibold text-white">{item.title}</h3>

          <p className="text-sm text-[#BAB8B8]">{item.description}</p>

          <p className="text-primary font-medium">{item.contact}</p>
        </div>
      ))}
    </div>
  );
};