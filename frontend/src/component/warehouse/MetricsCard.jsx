import { useEffect, useRef } from "react";
import gsap from "gsap";

const colorMap = {
  blue: {
    bg: "bg-[#3f89f9]/10",
    icon: "text-[#3f89f9]",
    value: "text-[#3f89f9]"
  },
  green: {
    bg: "bg-green-100",
    icon: "text-green-600",
    value: "text-green-600"
  },
  amber: {
    bg: "bg-amber-100",
    icon: "text-amber-600",
    value: "text-amber-600"
  },
  emerald: {
    bg: "bg-emerald-100",
    icon: "text-emerald-600",
    value: "text-emerald-600"
  }
};

const MetricsCard = ({ title, value, icon: Icon, color = "blue", delay = 0 }) => {
  const cardRef = useRef(null);
  const c = colorMap[color];

  useEffect(() => {
    gsap.fromTo(
      cardRef.current,
      { y: 20, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        delay,
        ease: "power3.out"
      }
    );
  }, [delay]);

  return (
    <div
      ref={cardRef}
      className="bg-white rounded-2xl border border-gray-200 p-6
                 flex items-center justify-between cursor-pointer
                 transition-all duration-300
                 hover:-translate-y-1 hover:shadow-xl"
      onMouseEnter={() =>
        gsap.to(cardRef.current, { scale: 1.03, duration: 0.25 })
      }
      onMouseLeave={() =>
        gsap.to(cardRef.current, { scale: 1, duration: 0.25 })
      }
    >
      <div>
        <p className="text-sm text-gray-600">{title}</p>
        <h2 className={`text-2xl font-bold mt-1 ${c.value}`}>
          {value}
        </h2>
      </div>

      <div
        className={`w-11 h-11 rounded-xl flex items-center justify-center ${c.bg}`}
      >
        {Icon && <Icon className={`w-5 h-5 ${c.icon}`} />}
      </div>
    </div>
  );
};

export default MetricsCard;
