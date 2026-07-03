import type {
  TmRiFinding,
  TmRiKnowledgeEdge,
  TmRiKnowledgeNode,
  TmRiObservationKnowledgeGraphSnapshot,
  TmRiRepairPlan,
} from "../types";

export class ObservationKnowledgeGraph {
  build(findings: readonly TmRiFinding[], repairPlan: TmRiRepairPlan): TmRiObservationKnowledgeGraphSnapshot {
    const nodes: TmRiKnowledgeNode[] = [];
    const edges: TmRiKnowledgeEdge[] = [];

    for (const finding of findings) {
      const observationId = `observation:${finding.code}`;
      nodes.push({ id: observationId, kind: "observation", label: finding.title });

      if (finding.educationalSeverity === "serious" || finding.educationalSeverity === "critical") {
        const pedagogyId = `pedagogy:${finding.code}`;
        nodes.push({ id: pedagogyId, kind: "pedagogy", label: finding.impact });
        edges.push({ from: observationId, to: pedagogyId, relation: "informs" });
      }

      if (finding.code === "guessing_to_escape" || finding.code === "loss_of_trust" || finding.code === "frustration") {
        const emotionId = `emotion:${finding.code}`;
        nodes.push({ id: emotionId, kind: "emotion", label: finding.title });
        edges.push({ from: observationId, to: emotionId, relation: "causes" });
      }

      if (finding.code === "product_trust_risk" || finding.code === "loss_of_trust") {
        const trustId = `trust:${finding.code}`;
        nodes.push({ id: trustId, kind: "trust", label: "Trust degradation" });
        edges.push({ from: observationId, to: trustId, relation: "causes" });
      }
    }

    for (const item of repairPlan.items) {
      const repairId = `repair:${item.priority}:${item.title}`;
      nodes.push({ id: repairId, kind: "repair", label: item.title });

      for (const finding of findings) {
        if (item.title.toLowerCase().includes(this.repairKeyFor(finding.code))) {
          edges.push({ from: `observation:${finding.code}`, to: repairId, relation: "requires" });
        }
      }
    }

    return {
      nodes: this.uniqueNodes(nodes),
      edges: this.uniqueEdges(edges),
    };
  }

  private repairKeyFor(code: TmRiFinding["code"]): string {
    if (code.includes("audio") || code === "unplayable_media") {
      return "listening";
    }
    if (code.includes("mic") || code.includes("speaking")) {
      return "spoken";
    }
    if (code.includes("confidence") || code.includes("scoring")) {
      return "placement";
    }
    if (code.includes("trust") || code.includes("internal")) {
      return "wording";
    }
    return code;
  }

  private uniqueNodes(nodes: readonly TmRiKnowledgeNode[]): readonly TmRiKnowledgeNode[] {
    return nodes.filter((node, index, all) => all.findIndex((candidate) => candidate.id === node.id) === index);
  }

  private uniqueEdges(edges: readonly TmRiKnowledgeEdge[]): readonly TmRiKnowledgeEdge[] {
    return edges.filter(
      (edge, index, all) =>
        all.findIndex(
          (candidate) =>
            candidate.from === edge.from && candidate.to === edge.to && candidate.relation === edge.relation,
        ) === index,
    );
  }
}
