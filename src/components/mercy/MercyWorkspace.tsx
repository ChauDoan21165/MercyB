import React, { useState } from "react";
import GuideTab from "../guide/GuideTab";
import MercyHostTab from "../mercy-host/MercyHostTab";

export default function MercyWorkspace() {
  const [showGuide, setShowGuide] = useState(true);
  const [showHost, setShowHost] = useState(true);
  const [hostZ, setHostZ] = useState(31);
  const [guideZ, setGuideZ] = useState(30);

  const focusGuide = () => {
    setGuideZ(40);
    setHostZ(39);
  };

  const focusHost = () => {
    setHostZ(40);
    setGuideZ(39);
  };

  return (
    <>
      {showGuide && (
        <GuideTab
          initialX={40}
          initialY={90}
          initialWidth={380}
          initialHeight={520}
          zIndex={guideZ}
          onFocus={focusGuide}
          onOpenHost={() => setShowHost(true)}
          onOpenSpeak={() => {
            // Hook this into your existing Speak launcher
            console.log("Open Speak");
          }}
        />
      )}

      {showHost && (
        <MercyHostTab
          initialX={460}
          initialY={90}
          initialWidth={420}
          initialHeight={560}
          zIndex={hostZ}
          onFocus={focusHost}
        />
      )}
    </>
  );
}