
import { useEffect, useState, useRef } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./GetQuotWhatsapp.css";

const GetQuotWhatsapp = () => {
    const [showPopup, setShowPopup] = useState(true);
    const containerRef = useRef(null);

    const phoneNumber = import.meta.env.VITE_WHATSAPP_NUMBER;

    const message = encodeURIComponent(
        `Hello TX-Pathwing Team,

I visited your website and would like to know more about your training programs, courses, internship opportunities, and job openings.

Could you please share the relevant details?

Thank you. I look forward to your response.`
    );

    useEffect(() => {
        const container = containerRef.current;
        const footer = document.querySelector(".tx-footer");

        if (!container || !footer) return;

        let frameId = null;

        const updatePosition = () => {
            if (frameId !== null) return;

            frameId = requestAnimationFrame(() => {
                const footerRect = footer.getBoundingClientRect();
                const icon = container.querySelector(".whatsapp-float");

                if (!icon) {
                    frameId = null;
                    return;
                }

                const iconHeight = icon.offsetHeight;
                const normalBottom = 25;
                const gap = 8;

                // Normal icon position from the bottom of the viewport
                const iconBottom = window.innerHeight - normalBottom;

                // Move the icon up only when the footer reaches it
                const overlap = iconBottom + gap - footerRect.top;

                const offset = Math.max(0, overlap);

                container.style.transform =
                    `translate3d(0, -${offset}px, 0)`;

                frameId = null;
            });
        };

        window.addEventListener("scroll", updatePosition, { passive: true });
        window.addEventListener("resize", updatePosition);

        updatePosition();

        return () => {
            window.removeEventListener("scroll", updatePosition);
            window.removeEventListener("resize", updatePosition);

            if (frameId !== null) {
                cancelAnimationFrame(frameId);
            }
        };
    }, []);

    if (!phoneNumber) return null;

    const whatsappURL = `https://wa.me/${phoneNumber}?text=${message}`;

    return (
        <div className="whatsapp-container" ref={containerRef}>
           
            <a
                href={whatsappURL}
                className="whatsapp-float"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat with TX-Pathwing on WhatsApp"
            >
                <i className="bi bi-whatsapp"></i>
            </a>
        </div>
    );
};

export default GetQuotWhatsapp;
