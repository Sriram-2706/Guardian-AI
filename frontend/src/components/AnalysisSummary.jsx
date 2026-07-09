function AnalysisSummary({ result }) {
  const statCards = [
    { label: 'Repository', value: result.repository || 'Unknown' },
    { label: 'Total files', value: result.total_files ?? 0 },
    { label: 'Candidate files', value: result.candidate_files ?? 0 },
    { label: 'Risk findings', value: result.security_findings?.length ?? 0 },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {statCards.map((card) => (
        <div key={card.label} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg shadow-slate-950/40">
          <p className="text-sm text-slate-400">{card.label}</p>
          <p className="mt-2 text-xl font-semibold text-slate-100">{card.value}</p>
        </div>
      ))}
    </div>
  )
}

export default AnalysisSummary
