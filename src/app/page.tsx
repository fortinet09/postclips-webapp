"use client";

import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import { HowItWorks } from '@/Components/(postclips)/landing/HowItWorks';
import FAQs from '@/Components/(postclips)/landing/FAQs';
import Footer from '@/Components/(postclips)/landing/Footer';
import ResponsiveImage from '@/Components/(postclips)/landing/ResponsiveImage';
import PhoneAnimation from '@/Components/(postclips)/landing/PhoneAnimation';
import { MainSlider } from '@/Components/(postclips)/landing/MainSlider';
import { StartRightNow } from '@/Components/(postclips)/landing/StartRightNow';

export default function Home() {
  return (
    <div className="landing-hero-section">
      <header className="landing-header">
        <div className="logo-container">
          <Image src="/assets/images/(postclips)/logos/logo.svg" alt="PostClips Logo" width={120} height={32} priority />
        </div>
        <div className="header-btn-wrapper">
          <a href="https://apps.apple.com/mx/app/post-clips/id6742848231?l=en-GB" target="_blank" className="btn-chipped">GET THE APP</a>
        </div>
      </header>


      <div className="landing-hero-main">
        {/* TEXT BLOCK (Title, Subtitle, Buttons) */}
        <PhoneAnimation />
        <div className="hero-text-block">
          <h1 className="hero-title">Get Paid to<br />Post Clips</h1>

          {/* This appears below the phone on mobile */}
          <div className="hero-subcontent">
            <p className="hero-subtitle">
              <span className="subtitle-top">Earn up to</span>
              <span className="subtitle-bottom">
                <span className="hero-highlight">$10,000+ </span>Per Month
              </span>
            </p>
            <div className="app-store-buttons">
              <a
                href="https://apps.apple.com/mx/app/post-clips/id6742848231?l=en-GB"
                target="_blank"
                className="app-store-btn app-store-ios"
              >
                <Image
                  src="/assets/images/(postclips)/landing/appstore.svg"
                  alt="App Store"
                  width={140}
                  height={44}
                />
              </a>
              {/* <a
                href="https://apps.apple.com/mx/app/post-clips/id6742848231?l=en-GB"
                target="_blank"
                className="app-store-btn app-store-android"
              >
                <Image
                  src="/assets/images/(postclips)/landing/googleplay.svg"
                  alt="Google Play"
                  width={140}
                  height={44}
                />
              </a> */}
            </div>
          </div>
        </div>
      </div>




      {/* Earnings and Clips Section */}
      <section className="section-earnings">
        <MainSlider />
      </section>

      <HowItWorks />

      <StartRightNow />

      <div className="images-section">
        <ResponsiveImage
          containerClassName="mb-5"
          desktopSrc="/assets/images/(postclips)/landing/section1.png"
          mobileSrc="/assets/images/(postclips)/landing/section1-mobile.png"
          alt=""
        />
        <ResponsiveImage
          containerClassName="mb-5"
          desktopSrc="/assets/images/(postclips)/landing/section2.png"
          mobileSrc="/assets/images/(postclips)/landing/section2-mobile.png"
          alt=""
        />
        <ResponsiveImage
          containerClassName="mb-5"
          desktopSrc="/assets/images/(postclips)/landing/section3.png"
          mobileSrc="/assets/images/(postclips)/landing/section3-mobile.png"
          alt=""
        />
        <ResponsiveImage
          containerClassName="mb-5 cursor-pointer"
          desktopSrc="/assets/images/(postclips)/landing/section4.png"
          mobileSrc="/assets/images/(postclips)/landing/section4-mobile.png"
          alt=""
          imageSelected={() => {
            window.open("https://apps.apple.com/mx/app/post-clips/id6742848231?l=en-GB", "_blank");
          }}
        />
      </div>
      <FAQs type="clipper" />
      <Footer />
    </div>
  );
}