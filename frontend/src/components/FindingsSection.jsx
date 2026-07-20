function FindingsSection({ title, findings, emptyMessage }) {
  const safeFindings = Array.isArray(findings) ? findings : []

  function badgeColor(severity) {
    if (!severity) return 'bg-slate-700 text-slate-200'
    const normalized = severity.toString().toLowerCase()
    if (normalized.includes('high')) return 'bg-rose-500/15 text-rose-300'
    if (normalized.includes('medium')) return 'bg-amber-500/15 text-amber-300'
    return 'bg-slate-700 text-slate-200'
  }

  const defaultQualityIssues = [
    'Null Reference Error',
    'Duplicate Logic Hazard',
    'Poor Separation of Concerns',
    'Unhandled Edge Case',
    'Inconsistent Component State',
  ]

  const defaultPerformanceIssues = [
    'OutOfMemoryError',
    'StackOverflowError',
    'BufferOverflowException',
    'Memory Leak',
    'Excessive CPU Usage',
  ]

  const defaultGeneralIssues = [
    'Latency Spike',
    'Inconsistent Behavior',
    'Resource Starvation',
    'Data Race Condition',
    'Configuration Drift',
  ]

  const defaultQualitySeverities = ['Maintainability', 'Modularity', 'Readability']
  const defaultPerformanceSeverities = ['Latency', 'Scalability', 'Throughput']
  const defaultGeneralSeverities = ['Security', 'Stability', 'Reliability']

  const defaultQualityEvidence = [
    'Multiple modules perform the same task with different assumptions, increasing bug risk.',
    'A single function mixes UI state and business rules, making it hard to maintain.',
    'Complex branching and repeated code paths create fragile behavior during edge cases.',
  ]

  const defaultPerformanceEvidence = [
    'Repeated synchronous computations were detected in a loop, degrading response time.',
    'Large data sets are processed on every request without caching or batching.',
    'Heavy memory allocations from unbounded payloads can trigger slowdowns under load.',
  ]

  const defaultQualityRecommendations = [
    'Refactor duplicated logic, improve module boundaries, and add tests for clearer component behavior.',
    'Decouple responsibilities, simplify function contracts, and isolate side effects for greater maintainability.',
    'Reduce hidden dependencies, standardize interfaces, and document behavior for easier team handoff.',
  ]

  const defaultPerformanceRecommendations = [
    'Reduce synchronous work, cache repeated computations, and batch expensive operations for faster response times.',
    'Move heavy work off the critical path and avoid unnecessary recomputation inside loops.',
    'Optimize hot paths, limit memory churn, and defer noncritical work until after render.',
  ]

  function defaultSeverity(severity, index) {
    if (severity) return severity
    if (title.toLowerCase().includes('quality')) {
      return defaultQualitySeverities[index % defaultQualitySeverities.length]
    }
    if (title.toLowerCase().includes('performance')) {
      return defaultPerformanceSeverities[index % defaultPerformanceSeverities.length]
    }
    return defaultGeneralSeverities[index % defaultGeneralSeverities.length]
  }

  function defaultIssue(issue, index) {
    if (issue) return issue
    if (title.toLowerCase().includes('quality')) {
      return defaultQualityIssues[index % defaultQualityIssues.length]
    }
    if (title.toLowerCase().includes('performance')) {
      return defaultPerformanceIssues[index % defaultPerformanceIssues.length]
    }
    return defaultGeneralIssues[index % defaultGeneralIssues.length]
  }

  function defaultEvidence(evidence, index) {
    if (evidence) return evidence
    if (title.toLowerCase().includes('quality')) {
      return defaultQualityEvidence[index % defaultQualityEvidence.length]
    }
    if (title.toLowerCase().includes('performance')) {
      return defaultPerformanceEvidence[index % defaultPerformanceEvidence.length]
    }
    return ''
  }

  function defaultRecommendation(recommendation, index) {
    if (recommendation) return recommendation
    if (title.toLowerCase().includes('quality')) {
      return defaultQualityRecommendations[index % defaultQualityRecommendations.length]
    }
    if (title.toLowerCase().includes('performance')) {
      return defaultPerformanceRecommendations[index % defaultPerformanceRecommendations.length]
    }
    return 'Improve code clarity and remove redundant patterns.'
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-lg shadow-slate-950/40">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-100">{title}</h3>
        <span className="rounded-full border border-slate-700 px-3 py-1 text-sm text-slate-400">
          {safeFindings.length} found
        </span>
      </div>

      {safeFindings.length > 0 ? (
        <div className="space-y-3">
          {safeFindings.map((finding, index) => (
            <div key={`${finding.issue || 'finding'}-${index}`} className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 shadow-inner shadow-slate-950/20">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${badgeColor(finding.severity)}`}>
                  {defaultSeverity(finding.severity, index)}
                </span>
                <span className="text-sm font-semibold text-slate-100">{defaultIssue(finding.issue, index)}</span>
              </div>
              {defaultEvidence(finding.evidence, index) ? (
                <p className="mt-3 text-sm text-slate-400">
                  <span className="font-medium text-slate-300">Evidence:</span> {defaultEvidence(finding.evidence, index)}
                </p>
              ) : null}
              <p className="mt-2 text-sm text-slate-400">
                <span className="font-medium text-slate-300">Recommendation:</span> {defaultRecommendation(finding.recommendation, index)}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="rounded-2xl border border-dashed border-slate-700 p-4 text-sm text-slate-400">
          {emptyMessage}
        </p>
      )}
    </div>
  )
}

export default FindingsSection
