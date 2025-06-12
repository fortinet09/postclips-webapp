import { ChevronLeft, ChevronRight } from "react-feather";
import { useEffect, useState } from "react";
import RotatingGlowButton from "@/Components/Buttons/Common/RotatingGlowButton";
import { useMobile } from "@/Hooks/useMobile";

export const ITEMS = [
  {
    text: "Design your Accounts",
    image: "card-5-step-1",
  },
  {
    text: "Customize your Clips",
    image: "card-5-step-2",
  },
  {
    text: "View analytics from thousands of accounts—all in one dashboard",
    image: "card-5-step-3",
  }
];

export const CardSlider = ({ items }: { items: typeof ITEMS }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const { mobile } = useMobile();

  const limits = {
    min: 0,
    max: items.length - 1,
  };

  // Avança para o próximo index (loop)
  const next = () => {
    setActiveIndex((prev) => (prev + 1) % items.length);
  };

  // Volta para o index anterior (loop)
  const prev = () => {
    setActiveIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  // Timer de 5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      next();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const goTo = (index: number) => () => setActiveIndex(index);

  return (
    <div
      className="card-item"
      style={{
        backgroundImage: `url("/assets/images/(postclips)/landing/network/card-5-bg.png")`,
      }}
    >
      <h3>Control thousands of accounts from one place</h3>

      <div className="card-item-indicator-container">
        {items.map((item, index) => (
          <button
            key={item.image}
            onClick={goTo(index)}
            className={
              "card-item-indicator " + (activeIndex === index ? "active" : "")
            }
          />
        ))}
      </div>

      <p>{items[activeIndex].text}</p>

      <div className="card-item-images-container">
        <button onClick={prev} className="card-item-indicator-control prev">
          <ChevronLeft />
        </button>

        <div className="card-item-images">
          {items.map((item, index) => (
            <img
              key={item.image}
              alt={item.text}
              src={`/assets/images/(postclips)/landing/network/${item.image}${mobile ? "-mobile" : ""
                }.png?v=1`}
              className={activeIndex === index ? "active" : ""}
            />
          ))}
        </div>

        <button onClick={next} className="card-item-indicator-control next">
          <ChevronRight />
        </button>
      </div>

      <div className="card-item-button">
        <RotatingGlowButton>
          <a href="/login" className="btn-chipped">
            Go To Network Dashboard
          </a>
        </RotatingGlowButton>
      </div>
    </div>
  );
};
