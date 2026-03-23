import Image from "next/image";

const badges = [
  { src: "/Credibility proof - Trustpilot.png", alt: "Trustpilot credibility proof" },
  { src: "/Credibility proof - Udemy.png", alt: "Udemy credibility proof" },
  { src: "/Credibility proof - YouTube.png", alt: "YouTube credibility proof" },
  { src: "/Credibility proof - LinkedIn.png", alt: "LinkedIn credibility proof" },
];

export default function CredibilityBadges() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 justify-items-center max-w-[820px] mx-auto">
      {badges.map((badge) => (
        <Image
          key={badge.src}
          src={badge.src}
          alt={badge.alt}
          width={555}
          height={65}
          className="w-full h-auto"
        />
      ))}
    </div>
  );
}
