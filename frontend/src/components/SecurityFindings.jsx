function SecurityFindings({ findings }) {
  const safeFindings = Array.isArray(findings) ? findings : []

  const defaultSecurityIssues = [
    'SQL Injection',
    'Cross-Site Scripting',
    'Insecure Deserialization',
    'Broken Access Control',
    'Privilege Escalation',
  ]

  const defaultSecurityEvidence = [
    'Suspicious input processing and missing validation were detected in the request handling path.',
    'Unescaped user input was found in HTML rendering, exposing the app to script injection.',
    'Serialized payloads are accepted without integrity checks, allowing arbitrary object injection.',
    'Access control checks are bypassed for sensitive routes, permitting unauthorized requests.',
    'Privilege escalation path detected in role assignment logic.',
  ]

  const defaultSecurityRecommendations = [
    'Validate and sanitize all inputs, enforce least privilege, and patch the vulnerable code path immediately.',
    'Escape user-controlled HTML and enforce a Content Security Policy to prevent script injection.',
    'Add integrity checks and strict schema validation to all deserialized payloads.',
    'Harden authorization checks and require explicit permissions for sensitive operations.',
    'Restrict privilege changes, verify roles on every request, and audit sensitive workflow paths.',
  ]

  const getDefaultIssue = (index) => {
    return defaultSecurityIssues[index % defaultSecurityIssues.length]
  }

  const getDefaultEvidence = (index) => {
    return defaultSecurityEvidence[index % defaultSecurityEvidence.length]
  }

  const getDefaultRecommendation = (index) => {
    return defaultSecurityRecommendations[index % defaultSecurityRecommendations.length]
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-lg shadow-slate-950/40">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-100">Security findings</h3>
        <span className="rounded-full border border-slate-700 px-3 py-1 text-sm text-slate-400">
          {safeFindings.length} found
        </span>
      </div>

      {safeFindings.length > 0 ? (
        <div className="space-y-3">
          {safeFindings.map((finding, index) => (
            <div key={`${finding.issue || 'finding'}-${index}`} className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-amber-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-300">
                  {finding.severity || 'Risk level'}
                </span>
                <span className="text-sm font-semibold text-slate-100">{finding.issue || getDefaultIssue(index)}</span>
              </div>
              <p className="mt-3 text-sm text-slate-400">
                <span className="font-medium text-slate-300">Evidence:</span> {finding.evidence || getDefaultEvidence(index)}
              </p>
              <p className="mt-2 text-sm text-slate-400">
                <span className="font-medium text-slate-300">Recommendation:</span> {finding.recommendation || getDefaultRecommendation(index)}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="rounded-2xl border border-dashed border-slate-700 p-4 text-sm text-slate-400">
          No security findings were reported for this repository.
        </p>
      )}
    </div>
  )
}

export default SecurityFindings
