"use client";

import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import HowItWorks from '@/Components/(postclips)/landing/HowItWorks';
import FAQs from '@/Components/(postclips)/landing/FAQs';
import Footer from '@/Components/(postclips)/landing/Footer';
import ResponsiveImage from '@/Components/(postclips)/landing/ResponsiveImage';
// Phone images for carousel
const phoneImages: string[] = [
  "/assets/images/(postclips)/landing/far-left.svg",
  "/assets/images/(postclips)/landing/second-left.svg",
  "/assets/images/(postclips)/landing/third-left.svg",
  "/assets/images/(postclips)/landing/center.svg",
  "/assets/images/(postclips)/landing/third-right.svg",
  "/assets/images/(postclips)/landing/second-right.svg",
  "/assets/images/(postclips)/landing/far-right.svg",
];

export default function Home() {
  const phonesRowRef = useRef<HTMLDivElement | null>(null);
  const [animating, setAnimating] = useState<boolean>(false);
  const [earnings, setEarnings] = useState<number>(0);
  const [campaignsViews, setCampaignsViews] = useState<number>(0);
  const [clips, setClips] = useState<number>(0);
  const [statsVisible, setStatsVisible] = useState<boolean>(false);
  const statsRef = useRef<HTMLDivElement | null>(null);
  const [direction, setDirection] = useState<'left' | 'right'>('right'); // Track animation direction
  const [userType, setUserType] = useState<'clipper' | 'network'>('clipper');

  // For animation stats
  const earningsTarget = 12547;
  const clipsTarget = 26450;
  const campaignsViewsTarget = 2150209000;
  const duration = 1800; // ms

  // Setup intersection observers for scroll animations
  useEffect(() => {
    // Observer for stats section
    if (statsRef.current) {
      const statsObserver = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setStatsVisible(true);
            statsObserver.disconnect();
          }
        },
        { threshold: 0.4 }
      );

      statsObserver.observe(statsRef.current);
      return () => statsObserver.disconnect();
    }
  }, []);

  // Animate counting stats
  useEffect(() => {
    if (!statsVisible) return;

    let start: number | null = null;

    function animate(ts: number): void {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const ease = (t: number): number => 1 - Math.pow(1 - t, 3);

      setEarnings(Math.floor(ease(progress) * earningsTarget));
      setClips(Math.floor(ease(progress) * clipsTarget));
      setCampaignsViews(Math.floor(ease(progress) * campaignsViewsTarget));
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setEarnings(earningsTarget);
        setClips(clipsTarget);
        setCampaignsViews(campaignsViewsTarget);
      }
    }

    requestAnimationFrame(animate);
  }, [statsVisible, earningsTarget, clipsTarget, duration]);

  // Function to reset phone classes to their initial state
  function resetPhoneClasses(): void {
    if (!phonesRowRef.current) return;

    const phones = Array.from(phonesRowRef.current.children) as HTMLElement[];

    phones.forEach((phone, index) => {
      phone.classList.remove('size-1', 'size-2', 'size-3', 'size-4');

      // Reset styles
      phone.style.transition = '';
      phone.style.transform = '';
      phone.style.opacity = '1';

      // Apply initial classes
      if (index === 3) {
        phone.classList.add('size-4'); // Center phone
      } else if (index === 2 || index === 4) {
        phone.classList.add('size-3'); // Phones adjacent to center
      } else if (index === 1 || index === 5) {
        phone.classList.add('size-2'); // 2nd from center
      } else {
        phone.classList.add('size-1'); // Outer phones
      }
    });
  }

  // Updated animation interval for alternating left/right animation
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    // First, ensure phones are initialized correctly
    resetPhoneClasses();

    // Start the animation after a delay
    const timer = setTimeout(() => {
      intervalId = setInterval(() => {
        if (!animating) {
          // Check if we have a center phone before animating
          const hasCenter = phonesRowRef.current?.querySelector('.size-4');
          if (!hasCenter) {
            // Reset phone classes if center is missing
            resetPhoneClasses();
            return;
          }

          // We have a center, animate in the current direction
          animatePhones(direction === 'right');

          // Toggle direction for next animation
          setDirection(prev => prev === 'right' ? 'left' : 'right');
        }
      }, 3000); // 5 seconds interval for stability
    }, 2000);

    return () => {
      clearTimeout(timer);
      clearInterval(intervalId);
    };
  }, [animating, direction]);

  // Simple function to format numbers with commas
  function formatNumber(n: number): string {
    return n.toLocaleString();
  }

  // Fixed animation function that doesn't make phones disappear
  function animatePhones(rightToLeft: boolean): void {
    if (animating || !phonesRowRef.current) return;
    setAnimating(true);

    const row = phonesRowRef.current;
    const phones = Array.from(row.children) as HTMLElement[];

    // Find the center phone by looking for the size-4 class
    const centerPhoneIndex = phones.findIndex(phone => phone.classList.contains('size-4'));

    if (centerPhoneIndex === -1) {
      console.error("No center phone found with size-4 class");
      resetPhoneClasses();
      setAnimating(false);
      return;
    }

    const centerPhone = phones[centerPhoneIndex];

    // Find the adjacent phones (one on each side of center)
    const leftAdjacentIndex = centerPhoneIndex > 0 ? centerPhoneIndex - 1 : phones.length - 1;
    const rightAdjacentIndex = (centerPhoneIndex + 1) % phones.length;

    // Determine which phone will become the new center based on direction
    const nextCenterIndex = rightToLeft ? leftAdjacentIndex : rightAdjacentIndex;
    const nextCenterPhone = phones[nextCenterIndex];

    if (!nextCenterPhone) {
      console.error("Next center phone not found");
      resetPhoneClasses();
      setAnimating(false);
      return;
    }

    // Step 1: Fade out ONLY the center phone
    centerPhone.style.transition = 'all 0.5s ease-out';
    centerPhone.style.opacity = '0';
    centerPhone.style.transform = 'translateY(-100px)';

    // Step 2: After center fades out, we'll rearrange and resize
    setTimeout(() => {
      try {
        // 1. Prepare all phones by temporarily disabling transitions
        phones.forEach(phone => {
          // Store original transition value
          phone.dataset.originalTransition = phone.style.transition;
          // Disable transitions
          phone.style.transition = 'none';
        });

        // 2. Remove the center phone from its current position
        centerPhone.remove();

        // 3. Apply new styles to center phone
        centerPhone.style.opacity = '0';
        centerPhone.style.transform = '';

        // 4. Insert the center phone at its new position
        if (rightToLeft) {
          row.appendChild(centerPhone);
        } else {
          row.insertBefore(centerPhone, row.firstChild);
        }

        // 5. Pre-compute which elements will be at which positions
        // Get the updated order of phones
        const updatedPhones = Array.from(row.children) as HTMLElement[];

        // Find where the next center phone is now
        const newCenterPosition = updatedPhones.indexOf(nextCenterPhone);

        // 6. Update all classes IMMEDIATELY for size adjustment
        updatedPhones.forEach((phone, index) => {
          // First remove all size classes
          phone.classList.remove('size-1', 'size-2', 'size-3', 'size-4');

          // Calculate distance from the new center
          const distance = Math.abs(index - newCenterPosition);

          // Apply appropriate size class based on distance
          if (distance === 0) {
            phone.classList.add('size-4'); // New center
          } else if (distance === 1) {
            phone.classList.add('size-3'); // Adjacent to center
          } else if (distance === 2) {
            phone.classList.add('size-2'); // 2nd from center
          } else {
            phone.classList.add('size-1'); // Outer phones
          }
        });

        // 7. Force a reflow to ensure all style changes are applied together
        void row.offsetWidth;

        // 8. Re-enable transitions for all phones except center phone
        updatedPhones.forEach(phone => {
          if (phone !== centerPhone) {
            // Restore original transition or use default
            phone.style.transition = phone.dataset.originalTransition || '';
          }
        });

        // 9. Fade in the old center phone at its new position
        setTimeout(() => {
          centerPhone.style.transition = 'all 0.5s ease-out';
          centerPhone.style.opacity = '1';

          // 10. Allow next animation after this completes
          setTimeout(() => {
            setAnimating(false);
          }, 600);
        }, 50);
      } catch (error) {
        console.error("Error during DOM manipulation:", error);
        resetPhoneClasses();
        setAnimating(false);
      }
    }, 600);
  }

  return (
    <div className="landing-hero-section">
      <header className="landing-header">
        <div className="logo-container">
          <Image src="/assets/images/(postclips)/logos/logo.svg" alt="PostClips Logo" width={120} height={32} priority />
        </div>
        <div className="landing_user-type-toggle">
          <div className="landing_toggle-container">
            <button
              className={`landing_toggle-btn ${userType === "clipper" ? "landing_active" : ""}`}
              onClick={() => setUserType("clipper")}
            >
              I'm a Clipper
            </button>
            <button
              className={`landing_toggle-btn ${userType === "network" ? "landing_active" : ""}`}
              onClick={() => setUserType("network")}
            >
              I'm a Network
            </button>
          </div>
        </div>
        <div className="header-btn-wrapper">
          <a href="https://apps.apple.com/mx/app/post-clips/id6742848231?l=en-GB" target="_blank" className="btn-chipped">GET THE APP</a>
        </div>
      </header>
      <main className="landing-hero-main">
        <div className="phone-mockup-container">
          <Image src="/assets/images/(postclips)/landing/section1-phone.svg" alt="Phone Mockup" width={320} height={640} priority />
        </div>
        <div className="hero-content">
          <h1 className="hero-title">Get Paid to<br />Post Clips</h1>
          <p className="hero-subtitle">
            <span className="subtitle-top">Earn up to</span>
            <span className="subtitle-bottom">
              <span className="hero-highlight">$10,000+ </span>Per Month
            </span>
          </p>
          <div className="app-store-buttons">
            <a href="https://apps.apple.com/mx/app/post-clips/id6742848231?l=en-GB" target="_blank" className="app-store-btn app-store-ios">
              <Image src="/assets/images/(postclips)/landing/appstore.svg" alt="App Store" width={140} height={44} />
            </a>
            <a href="https://apps.apple.com/mx/app/post-clips/id6742848231?l=en-GB" target="_blank" className="app-store-btn app-store-android">
              <Image src="/assets/images/(postclips)/landing/googleplay.svg" alt="Google Play" width={140} height={44} />
            </a>
          </div>
        </div>
      </main>

      {/* Earnings and Clips Section */}
      <section className="section-earnings">
        {userType === "clipper" ? (
          <h2 className="earnings-title">We pay you for every<br />1,000 views you generate</h2>
        ) : (
          <h2 className="earnings-title">You just discovered the <br /><span style={{ color: '#00E7FF' }}>CHEAT CODE</span> for getting <br />customers attention</h2>
        )}
        <div className="earnings-stats-row" ref={statsRef}>
          <div className="earnings-stat-box chipped-top-right">
            {userType === "clipper" ? (
              <>
                <span className="stat-label">Total earnings</span>
                <span className="stat-value">${formatNumber(earnings)}</span>
              </>
            ) : (
              <>
                <span className="stat-label">Campaigns Views</span>
                <span className="stat-value">${formatNumber(campaignsViews)}</span>
              </>
            )}
          </div>
          <div className="earnings-stat-box chipped-top-right">
            <span className="stat-label">Clips Posted</span>
            <span className="stat-value">{formatNumber(clips)}</span>
          </div>
        </div>

        {/* Glowline and Fadelogos */}
        <div className="glowline-row">
          <Image src="/assets/images/(postclips)/landing/glowline.svg" alt="Glowline" width={1400} height={4} style={{ width: '100%', height: 'auto' }} />
        </div>
        <div className="fadelogos-row">
          <Image src="/assets/images/(postclips)/landing/fadelogos.svg" alt="Faded Logos" width={1400} height={256} style={{ width: '100%', height: 'auto' }} />
        </div>

        {/* Phone Carousel - Using CSS classes to maintain proper sizes */}
        <div className="phones-carousel">
          <div className="phones-row" ref={phonesRowRef}>
            {/* Fixed structure with proper CSS classes */}
            <div className="phone size-1">
              <Image src={phoneImages[0]} alt="Phone 1" width={270} height={540} style={{ objectFit: 'cover' }} />
            </div>
            <div className="phone size-2">
              <Image src={phoneImages[1]} alt="Phone 2" width={270} height={540} style={{ objectFit: 'cover' }} />
            </div>
            <div className="phone size-3">
              <Image src={phoneImages[2]} alt="Phone 3" width={270} height={540} style={{ objectFit: 'cover' }} />
            </div>
            <div className="phone size-4">
              <Image src={phoneImages[3]} alt="Phone 4" width={270} height={540} style={{ objectFit: 'cover' }} />
            </div>
            <div className="phone size-3">
              <Image src={phoneImages[4]} alt="Phone 5" width={270} height={540} style={{ objectFit: 'cover' }} />
            </div>
            <div className="phone size-2">
              <Image src={phoneImages[5]} alt="Phone 6" width={270} height={540} style={{ objectFit: 'cover' }} />
            </div>
            <div className="phone size-1">
              <Image src={phoneImages[6]} alt="Phone 7" width={270} height={540} style={{ objectFit: 'cover' }} />
            </div>
          </div>
        </div>

        <HowItWorks type={userType} />

        <ResponsiveImage
          containerClassName="mb-5"
          desktopSrc="/assets/images/(postclips)/landing/banner.svg"
          mobileSrc="/assets/images/(postclips)/landing/banner.svg"
          alt=""
        />
        <ResponsiveImage
          containerClassName="mb-5"
          desktopSrc="/assets/images/(postclips)/landing/section1.svg"
          mobileSrc="/assets/images/(postclips)/landing/section1-mobile.svg"
          alt=""
        />
        <ResponsiveImage
          containerClassName="mb-5"
          desktopSrc="/assets/images/(postclips)/landing/section2.svg"
          mobileSrc="/assets/images/(postclips)/landing/section2-mobile.svg"
          alt=""
        />
        <ResponsiveImage
          containerClassName="mb-5"
          desktopSrc="/assets/images/(postclips)/landing/section3.svg"
          mobileSrc="/assets/images/(postclips)/landing/section3-mobile.svg"
          alt=""
        />
        <ResponsiveImage
          containerClassName="mb-5"
          desktopSrc="/assets/images/(postclips)/landing/section4.svg"
          mobileSrc="/assets/images/(postclips)/landing/section4-mobile.svg"
          alt=""
        />
        <FAQs type={userType} />
        <Footer />
      </section>
    </div>
  );
}