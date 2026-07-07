CREATE TRIGGER IF NOT EXISTS int_registry_verified_requires_evidence_insert
BEFORE INSERT ON int_registry
WHEN NEW.status = 'verified' AND NEW.verified_evidence_ref IS NULL
BEGIN
  SELECT RAISE(ABORT, 'int_registry: status=verified requires verified_evidence_ref (evidence-gated only)');
END;

CREATE TRIGGER IF NOT EXISTS int_registry_verified_requires_evidence_update
BEFORE UPDATE OF status ON int_registry
WHEN NEW.status = 'verified' AND NEW.verified_evidence_ref IS NULL
BEGIN
  SELECT RAISE(ABORT, 'int_registry: status=verified requires verified_evidence_ref (evidence-gated only)');
END;
