import React, { useState } from "react";
import { Counters } from "./Counters";
import { SlideShow } from "./SlideShow";
import Image from "next/image";
const images = [
    "/assets/images/(postclips)/landing/carousel-1.png",
    "/assets/images/(postclips)/landing/carousel-2.png",
    "/assets/images/(postclips)/landing/carousel-3.png",
    "/assets/images/(postclips)/landing/carousel-4.png",
    "/assets/images/(postclips)/landing/carousel-5.png",
    "/assets/images/(postclips)/landing/carousel-6.png",
    "/assets/images/(postclips)/landing/carousel-7.png",
];

export const MainSlider: React.FC = () => {
    const [step, setStep] = useState(0);

    return (
        <div className="slider_container">
            <h2 className="earnings-title">We pay you for every<br />1,000 views you generate</h2>
            <Counters step={step} />
            {/* Glowline and Fadelogos */}
            <div className="glowline-row">
                <Image src="/assets/images/(postclips)/landing/glowline.svg" alt="Glowline" width={1400} height={4} style={{ width: '100%', height: 'auto' }} />
            </div>
            <div className="fadelogos-row">
                <Image src="/assets/images/(postclips)/landing/fadelogos.svg" alt="Faded Logos" width={1400} height={256} style={{ width: '100%', height: 'auto' }} />
            </div>
            <SlideShow images={images} onSlideChange={() => setStep((s) => s + 1)} />
        </div>
    );
};
