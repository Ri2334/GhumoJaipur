import React, { useEffect } from "react";

/**
 * Reusable Google AdSense Ad Unit Component for SheherSaathi
 * Collapses completely when unfilled so zero empty white boxes appear.
 */
export default function GoogleAd({
  client = "ca-pub-4209575023821354",
  slot = "1234567890",
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
    <div className={`w-full overflow-hidden transition-all ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: "block", width: "100%" }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive}
      />
    </div>
  );
}
