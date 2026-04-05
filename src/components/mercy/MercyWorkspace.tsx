// PATH: src/components/mercy/MercyWorkspace.tsx

import React, { useState } from "react";
import GuideTab from "../guide/GuideTab";

export default function MercyWorkspace() {
  const [showGuide, setShowGuide] = useState(true);
  const [guideZ, setGuideZ] = useState(30);

  const focusGuide = () => {
    setGuideZ(40);
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
          onOpenHost={() => {
            console.warn("MercyHostPanel is not available in this build.");
          }}
          onOpenSpeak={() => {
            console.log("Open Speak");
          }}
        />
      )}
    </>
  );
}