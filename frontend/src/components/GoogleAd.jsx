import React, { useEffect } from "react";

/**
 * Reusable Google AdSense Ad Unit Component for SheherSaathi
 * Pass client (Publisher ID) and slot (Ad Slot ID) from Google AdSense dashboard.
 */
export default function GoogleAd({
  client = "ca-pub-XXXXXXXXXXXXXXXX", // Replace with your Publisher ID
  slot = "1234567890",              // Replace with your Ad Slot ID
  format = "auto",
  responsive = "true",
  className = ""
}) {
  useEffect(() => {
    try {
      if (window.adsbygoogle) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (e) {
      console.error("AdSense Error: ", e);
    }
  }, []);

  return (
    <div className={`my-6 flex justify-center overflow-hidden rounded-2xl bg-white/50 p-3 border border-dashed border-[#E6D6C3] shadow-sm ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: "block", minWidth: "280px", width: "100%" }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive}
      />
    </div>
  );
}
