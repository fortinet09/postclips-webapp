"use client";

import { useState, useEffect } from 'react';
import { stagger, useAnimate } from "framer-motion";
import Image from "next/image";

import {
    Availability,
    Colors,
    Music,
    SchedulingLinks,
    Team,
    Test,
    Todo,
} from "./FeatureCard";
import { OtherVisual, MusicVisual } from "./Visual";
import { FeatureTitle } from "./FeatureTitle";

// Define TypeScript interfaces
interface StepData {
    id: string;
    title: string;
    description: string;
    highlight: string;
    card: React.ComponentType<{ id: string }>;
}

// Define your steps data
const stepsData: StepData[] = [
    {
        id: "step-1",
        title: "Watch YOUR Favorite Networks",
        description:
            "Browse top content from major networks—Just pick your show or movie & watch right inside our app",
        highlight: "YOUR",
        card: Test,
    },
    {
        id: "step-2",
        title: "Clip YOUR Favorite Moments",
        description:
            "Select the scenes that will go viral—anything interesting, intense, or meme-worthy",
        highlight: "YOUR",
        card: Test,
    },
    {
        id: "step-3",
        title: "Post YOUR Clips",
        description:
            "Instantly Post to TikTok, Instagram, Facebook, X (Twitter), and YouTube Shorts all from one place",
        highlight: "YOUR",
        card: Test,
    },
    {
        id: "step-4",
        title: "You Get Paid!",
        description:
            "Get paid for every 1,000 views you get—the more views, the more you earn!",
        highlight: "Get Paid!",
        card: Test,
    },
];

const features = [
    {
        title: "Use your calendar as a todo list",
        id: "todo-list",
        card: Todo,
        visual: OtherVisual,
    },
    {
        title: "Color your calendar to organize",
        id: "colors",
        card: Colors,
        visual: OtherVisual,
    },
    {
        title: "Instantly know if someone is available",
        id: "availability",
        card: Availability,
        visual: OtherVisual,
    },
    {
        title: "Track what you listened to when",
        id: "music",
        card: Music,
        visual: MusicVisual,
    },
    {
        title: "Send scheduling links guests love",
        id: "scheduling-links",
        card: SchedulingLinks,
        visual: OtherVisual,
    },
    {
        title: "Always know what your team is up to",
        id: "team",
        card: Team,
        visual: OtherVisual,
    },
];

const HowItWorks = () => {
    // Function to create a title with highlighted text
    const createTitleWithHighlight = (title: string, highlight: string) => {
        // Find the word to highlight
        const parts = title.split(highlight);

        if (parts.length === 1) {
            return <span>{title}</span>;
        }

        return (
            <>
                {parts[0]}
                <span className="how-it-works-highlight">{highlight}</span>
                {parts[1]}
            </>
        );
    };

    return (
        <>
            <div className="how-it-works-container">
                <div className="featuresList">
                    <ul>
                        {stepsData.map((step) => (
                            <li key={step.id}>
                                <FeatureTitle id={step.id}>
                                    <>
                                        {createTitleWithHighlight(step.title, step.highlight)}
                                        <span className="feature-subtitle">
                                            {step.description}
                                        </span>
                                    </>
                                </FeatureTitle>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="visualContainer">
                    <div className="cardContainer">
                        {/* {stepsData.map((step) => (
                        <step.card id={step.id} key={step.id} />
                    ))} */}

                        <Image src="/assets/images/(postclips)/landing/how-it-works.svg" alt="Test" fill />
                    </div>
                </div>
            </div>

            <div className="mobile-image-container mb-5">
                <Image
                    src="/assets/images/(postclips)/landing/how-it-works.svg"
                    alt="How It Works"
                    width={400}
                    height={400}
                    className="mobile-steps-image"
                />
            </div></>
    );
};

export default HowItWorks;