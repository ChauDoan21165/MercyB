import React from "react";
import { useParams } from "react-router-dom";

import TOEICTimedPractice from "@/components/exam-prep/toeic/TOEICTimedPractice";
import TOEICPaywallGate from "@/components/exam-prep/toeic/TOEICPaywallGate";

export default function TOEICPracticePage() {
  const { sectionId = "" } = useParams<{ sectionId: string }>();
  return (
    <TOEICPaywallGate>
      <TOEICTimedPractice sectionId={sectionId} />
    </TOEICPaywallGate>
  );
}
