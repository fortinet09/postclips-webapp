"use client";
import { HowItWorks, Step } from "@/Components/(postclips)/landing/HowItWorks";
import { StartRightNow } from "@/Components/(postclips)/landing/StartRightNow";
import PhoneAnimation from "@/Components/(postclips)/landing/PhoneAnimation";
import { MainSlider } from "@/Components/(postclips)/landing/MainSlider";
import { AppStore } from "@/Components/(postclips)/landing/AppStore";
import { Header } from "@/Components/(postclips)/landing/Header";
import Footer from "@/Components/(postclips)/landing/Footer";
import Image from "next/image";
import FAQs from "@/Components/(postclips)/landing/FAQs";

export default function NetworkLP() {
  return (
    <div className="network-lp">
      <Header />

      <section className="section-hero">
        <div className="hero-text-block">
          <h1 className="hero-title">
            Stop Spending,<br />
            <span className="text-gradient">Start Posting</span>
          </h1>
          <p className="hero-subtitle">
            Traditional Media is about to takeover Social Media
          </p>
        </div>

        <PhoneAnimation
          source="/assets/video/lp-network.mp4"
          threshold={-100}
          transforms={[
            "perspective(1200px) translateY(0) scale(1.8) rotateX(25deg)",
            "perspective(1200px) translateY(60px) scale(1.3) rotateX(0deg)"
          ]}
        />

        <AppStore />
      </section>

      <section className="section-earnings">
        <MainSlider
          title={`You just discovered the <span class="text-gradient">CHEAT CODE</span> for getting customers attention`}
          labels={["Campaign Views"]}
          earnings={2150209000}
          clips={26450}
        />
      </section>

      <HowItWorks steps={HOW_IT_WORK_STEPS} />

      <StartRightNow
        link="https://postclips.com/login"
        subtitle="Turn Every Scroll Into Your Ad Space"
        button="GO to Network Dashboard"
      />

      <div className="card-image-list">
        {Array.from({ length: 4 }).map((_, index) =>
          <Image
            key={index}
            src={`/assets/images/(postclips)/landing/network/card-${index + 1}.png`}
            alt={"Image card " + (index + 1)}
            className="image-card"
            width={1800}
            height={800}
          />
        )}
      </div>

      <FAQs type="network" />

      <Footer />
    </div>
  );
}

const HOW_IT_WORK_STEPS: Step[] = [
  {
    id: "step-1",
    title: "DESIGN the Accounts",
    description: "Choose the username, bio, link in bio, and profile pictures for every account",
    highlight: "DESIGN",
    highlightColor1: "#00E7FF",
    videoSrc: "/assets/video/design.mp4"
  },
  {
    id: "step-2",
    title: "CUSTOMIZE your clips",
    description: "Control every detail— Pick the caption, add your logo, show name, and outro for every post",
    highlight: "CUSTOMIZE",
    highlightColor1: "#75A4FF",
    videoSrc: "/assets/video/customize.mp4"
  },
  {
    id: "step-3",
    title: "APPROVE or REJECT Every Clip Submitted",
    description: "Total control—nothing goes live without your sign-off",
    highlight: ["APPROVE", "REJECT"],
    highlightColor1: "#00E7FF",
    highlightColor2: "#75A4FF",
    videoSrc: "/assets/video/review.mp4"
  },
  {
    id: "step-4",
    title: "GET UP to Billions of Views",
    description: "Let our clippers push content across thousands of accounts",
    highlight: "GET UP",
    highlightColor1: "#00E7FF",
    videoSrc: "/assets/video/views.mp4"
  },
  {
    id: "step-5",
    title: "Up to 10,000 Accounts Analytics All in 1 Place",
    description: "[placeholder description]",
    highlight: "Up to 10,000",
    highlightColor1: "#00E7FF",
    videoSrc: "/assets/video/analytics.mp4"
  },
];