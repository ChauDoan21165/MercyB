import React from "react";

import TOEICScoreEstimator from "@/components/exam-prep/toeic/TOEICScoreEstimator";
import TOEICPaywallGate from "@/components/exam-prep/toeic/TOEICPaywallGate";

export default function TOEICEstimatorPage() {
  return (
    <TOEICPaywallGate>
      <TOEICScoreEstimator />
    </TOEICPaywallGate>
  );
}
