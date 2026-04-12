"use client";

import AboutMichalGallery from "@/components/AboutMichalGallery";

export default function AboutSection() {
  return (
    <AboutMichalGallery title="Your Instructor" heading="Hi, I'm Michal">
      <p>
        I&apos;ve spent years in the trenches of technical recruiting, helping
        companies find engineers, data scientists, and product talent. Along the
        way, I became obsessed with one question:{" "}
        <span className="text-slate-800 font-medium italic">
          how can recruiters work smarter, not harder?
        </span>
      </p>
      <p>
        This workshop is my answer to that question. It pulls together the
        practical AI workflows I teach recruiters and talent teams, from
        building talent pools to pre-screening candidates faster, and packs them
        into 90 focused minutes so you can start using them right away.
      </p>
    </AboutMichalGallery>
  );
}
