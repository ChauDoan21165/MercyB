import React from "react";

import TOEICOverview from "@/components/exam-prep/toeic/TOEICOverview";
import TOEICPaywallGate from "@/components/exam-prep/toeic/TOEICPaywallGate";

export default function TOEICIndexPage() {
  return (
    <TOEICPaywallGate>
      <TOEICOverview />
    </TOEICPaywallGate>
  );
}
