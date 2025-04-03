"use client";

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';
import { ImagePath } from '@/Constant';

const testimonials = [
  "Honest Review: It Takes a Couple Weeks but After That it's Easy Money",
  "By Far the Best Way to Make Money on the Internet",
  "Dude if You're Reading This, Stop Wasting Time & Just Start. Trust me",
  "Being Able to Post to Every Platform Instantly is Actually Really Helpful",
  "For Anyone Wondering, Yes it's legit lol"
];

export default function Home() {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    offset: ["start start", "end start"]
  });

  const rotateX = useTransform(scrollYProgress, [0, 0.2], [15, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [0.95, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [1, 1, 1, 0]);

  return (
    <main className="main-container">
      {/* Hero Section */}
      <section ref={containerRef} className="hero-section">
        <motion.div className="title-container">
          <h1>Get Paid to Post Clips</h1>
          <p className="subtitle">Earn Up to $10,000+ Per Month</p>
          <p className="description">We pay you for every 1,000 views you generate.</p>
        </motion.div>

        {/* <motion.div
          className="phone-container"
          style={{ perspective: 1000, rotateX, scale, opacity }}
        >
          <video autoPlay muted loop playsInline className="phone-video">
            <source src="/clipper-preview.mp4" type="video/mp4" />
          </video>
        </motion.div> */}

        <motion.div className="cta-container">
          <motion.a
            href="https://apps.apple.com/us/app/post-clips/id6742848231"
            target="_blank"
            rel="noopener noreferrer"
            className="download-button"
            whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.15)" }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <span className="button-content">
              Download on the App Store
              <svg className="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </span>
          </motion.a>
        </motion.div>
      </section>

      {/* How it Works Section */}
      <section className="process-section">
        <h2>How it Works</h2>
        <div className="steps-container">
          <motion.div
            className="step"
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 50 }}
          >
            <div className="step-content">
              <h3>Watch YOUR Favorite Networks</h3>
              <div className="image-container">
                <Image 
                  src={`${ImagePath}/(postclips)/watch-content.png`} 
                  alt="Watch Content" 
                  width={300}
                  height={533}
                  priority
                />
              </div>
            </div>
            <div className="step-details">
              <p>Access premium content from top networks instantly</p>
              <ul>
                <li>Instant Access to Content</li>
                <li>Browse Popular Shows</li>
                <li>HD Quality Streaming</li>
              </ul>
            </div>
          </motion.div>

          <motion.div
            className="step reversed"
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 50 }}
          >
            <div className="step-content">
              <h3>Clip YOUR Favorite Moments</h3>
              <div className="image-container">
                <Image 
                  src={`${ImagePath}/(postclips)/formatting-tool.png`} 
                  alt="Formatting Tool" 
                  width={300}
                  height={533}
                  priority
                />
              </div>
            </div>
            <div className="step-details">
              <p>Our built-in editor makes clipping effortless</p>
              <ul>
                <li>Instant Editing Tools</li>
                <li>Pre-made Templates</li>
                <li>One-Click Clipping</li>
              </ul>
            </div>
          </motion.div>

          <motion.div
            className="step"
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 50 }}
          >
            <div className="step-content">
              <h3>Post YOUR Clips</h3>
              <div className="image-container">
                <Image 
                  src={`${ImagePath}/(postclips)/step-post-clip.png`} 
                  alt="Post Clips" 
                  width={300}
                  height={533}
                  priority
                />
              </div>
            </div>
            <div className="step-details">
              <p>Share to multiple platforms with one tap</p>
              <ul>
                <li>Multi-Platform Posting</li>
                <li>Scheduled Publishing</li>
                <li>Automatic Formatting</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Results & FAQ Section */}
      <section className="results-section">
        <div className="stats-container">
          <motion.div
            className="stat-card"
            whileInView={{ opacity: 1, scale: 1 }}
            initial={{ opacity: 0, scale: 0.9 }}
          >
            <h3>Hundreds of Thousands</h3>
            <p>of Dollars Paid Out to Clippers</p>
          </motion.div>

          {/* Testimonials Section */}
          <div className="testimonials-section">
            <h3>What Our Users Say</h3>
            <div className="testimonials">
              <div className="testimonial-track">
                {testimonials.map((text, index) => (
                  <div key={`testimonial-1-${index}`} className="testimonial-card">
                    <p>{text}</p>
                  </div>
                ))}
                {testimonials.map((text, index) => (
                  <div key={`testimonial-2-${index}`} className="testimonial-card">
                    <p>{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="faq-section">
            <h3>Common Questions</h3>
            <div className="faq-container">
              <div className="faq-item">
                <h4>Do I need followers to get views?</h4>
                <p>No, if you post high quality already popular network shows consistently, the algorithm does not care how many followers you have. You can get millions of views on literally your second post.</p>
              </div>
              <div className="faq-item">
                <h4>How long does it take to get paid?</h4>
                <p>We send out payments every other Friday.</p>
              </div>
            </div>
          </div>

          {/* Final CTA */}
          <motion.div
            className="final-cta"
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 30 }}
          >
            <h2>Start Earning Today</h2>
          </motion.div>
        </div>
      </section>
    </main>
  );
}