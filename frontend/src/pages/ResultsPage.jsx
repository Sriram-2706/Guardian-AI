import AnalysisSummary from '../components/AnalysisSummary'
import SecurityFindings from '../components/SecurityFindings'
import TopFilesTable from '../components/TopFilesTable'

function ResultsPage({ result, onReset }) {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.2),_transparent_45%),linear-gradient(135deg,_#020617,_#0f172a_45%,_#111827)] px-4 py-10 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <div className="flex flex-col gap-4 rounded-[28px] border border-slate-800 bg-slate-900/70 p-6 shadow-2xl shadow-slate-950/50 backdrop-blur sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-400">Analysis complete</p>
            <h2 className="mt-2 text-3xl font-semibold text-white">{result.repository || 'Repository analysis'}</h2>
            <p className="mt-3 text-slate-400">Review the repository snapshot, top-risk files, and security findings below.</p>
          </div>
          <button
            type="button"
            onClick={onReset}
            className="rounded-2xl border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-sky-500 hover:text-sky-400"
          >
            Analyze another repository
          </button>
        </div>

        <AnalysisSummary result={result} />

        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <TopFilesTable files={result.top_files} />
          <SecurityFindings findings={result.security_findings} />
        </div>
      </div>
    </main>
  )
}

export default ResultsPage
