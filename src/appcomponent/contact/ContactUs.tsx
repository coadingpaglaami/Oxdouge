import { ContactCard } from "./ContactCard";
import { ContactForm } from "./ContactForm";
import { ContactHero } from "./ContactHero";

export const ContactUs = () => {
    return (
        <div className="my-20">
        <ContactHero />
        <ContactCard />
        <ContactForm />
        </div>
    )
};