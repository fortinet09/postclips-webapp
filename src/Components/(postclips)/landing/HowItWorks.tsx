import { useEffect, useMemo, useRef, useState } from "react";

export interface Step {
    id: string;
    title: string;
    description?: string;
    highlight: string | string[];
    highlightColor1: string;
    highlightColor2?: string;
    videoSrc?: string;
}

export const HowItWorks = ({ steps }: { steps: Step[] }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const initialRender = useRef(true);

    useEffect(() => {
        if (initialRender.current) {
            initialRender.current = false;
            return;
        }

        const stepElements = containerRef.current?.querySelectorAll(".howitworks_step[data-step-index]");

        if (!stepElements || !stepElements[activeIndex]) return;

        stepElements[activeIndex].scrollIntoView({
            behavior: "smooth",
            block: "center",
        });
    }, [activeIndex]);

    const onScroll = () => containerRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
    })

    useEffect(() => {
        const scrollContainer = containerRef.current;
        if (!scrollContainer) return;

        const stepElements = Array.from(
            scrollContainer.querySelectorAll(".howitworks_step[data-step-index]")
        );

        if (stepElements.length === 0) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const visibleEntries = entries
                    .filter(entry => entry.isIntersecting)
                    .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

                if (visibleEntries.length > 0) {
                    const mostVisible = visibleEntries[0];
                    const newIndex = parseInt(mostVisible.target.getAttribute("data-step-index") || "-1", 10);
                    if (!isNaN(newIndex) && newIndex !== activeIndex) {
                        setActiveIndex(newIndex);
                    }
                }
            },
            {
                root: null,
                threshold: 0.6,
            }
        );

        stepElements.forEach(el => observer.observe(el));
        return () => observer.disconnect();
    }, [steps.length]);

    function highlightTitle(
        text: string,
        highlight: string | string[],
        color1: string,
        color2?: string
    ): React.ReactNode {
        const highlights = Array.isArray(highlight) ? highlight : [highlight];
        const baseStyle = { marginRight: "0.25ch" };
        if (highlights?.length === 0) return text;

        const escaped = highlights?.map(h =>
            h.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
        );
        const regex = new RegExp(`(${escaped.join("|")})`, "gi");

        const parts: React.ReactNode[] = [];
        let lastIndex = 0;

        text.replace(regex, (match, _, offset) => {
            if (lastIndex < offset) {
                parts.push(<span key={lastIndex} style={baseStyle}>{text.slice(lastIndex, offset)}</span>);
            }

            const key = `highlight-${offset}`;
            if (color2) {
                parts.push(
                    <span key={key} style={{
                        position: "relative",
                        display: "inline-block",
                        fontWeight: 700,
                        ...baseStyle
                    }}>
                        <span style={{ opacity: 0 }}>{match}</span>
                        <span style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            background: `linear-gradient(to right, ${color1}, ${color2})`,
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            whiteSpace: "nowrap",
                        }}>{match}</span>
                    </span>
                );
            } else {
                parts.push(
                    <span key={key} style={{ color: color1, fontWeight: 700, ...baseStyle }}>
                        {match}
                    </span>
                );
            }

            lastIndex = offset + match.length;
            return match;
        });

        if (lastIndex < text.length) {
            parts.push(<span key={lastIndex} style={baseStyle}>{text.slice(lastIndex)}</span>);
        }

        return parts;
    }

    return (
        <>
            <section className="howitworks_section">
                <div className="howitworks_scrollWrapper" ref={containerRef}>
                    {/* Desktop Video */}
                    <div className="howitworks_videoColumn desktop-only">
                        <VideoStack steps={steps} activeIndex={activeIndex} />
                    </div>

                    <div className="howitworks_textColumn">
                        <div className="howitworks_content" onScroll={onScroll}>
                            <div className="howitworks_step">
                                <div className="howitworks_title">How it works</div>
                            </div>

                            {steps.map((step, index) => (
                                <div
                                    key={step.id}
                                    className={`howitworks_step ${index === activeIndex ? "active" : ""}`}
                                    data-step-index={index}
                                >
                                    <h2>
                                        {highlightTitle(
                                            step.title,
                                            step.highlight,
                                            step.highlightColor1,
                                            step.highlightColor2
                                        )}
                                    </h2>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Mobile Video */}
            <div className="howitworks_videoMobile mobile-only">
                <VideoStack steps={steps} activeIndex={activeIndex} />
            </div>
        </>
    );
};


export const VideoStack = ({ activeIndex, steps }: { steps: Step[], activeIndex: number }) => {
    return (
        <div className="howitworks_videoStack">
            {steps.map((step, index) => {
                const src = step.videoSrc || "/assets/images/(postclips)/landing/how-it-works.mp4";
                return (
                    <video
                        key={src + "-desktop-" + index}
                        src={src}
                        autoPlay
                        muted
                        loop
                        playsInline
                        className={`howitworks_video ${index === activeIndex ? "visible" : ""}`}
                    />
                );
            })}
        </div>
    )
}