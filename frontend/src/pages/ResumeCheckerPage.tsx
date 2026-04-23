import { ChangeEvent, useMemo, useState } from 'react';
import { jsPDF } from 'jspdf';
import { checkerApi } from '../services/api';
import type { ResumeReviewResult } from '../types';
import styles from './ResumeCheckerPage.module.css';

type Confidence = 'high' | 'medium' | 'low';

function getConfidence(value: string): Confidence {
  const normalized = value.trim().toLowerCase();
  if (!normalized || normalized.includes('not clearly present')) {
    return 'low';
  }
  if (normalized.length < 8) {
    return 'medium';
  }
  return 'high';
}

function getScoreBand(score: number): 'excellent' | 'good' | 'needsWork' {
  if (score >= 85) {
    return 'excellent';
  }
  if (score >= 65) {
    return 'good';
  }
  return 'needsWork';
}

function downloadReport(result: ResumeReviewResult): void {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  let y = 14;

  const writeHeading = (text: string) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text(text, 14, y);
    y += 7;
  };

  const writeParagraph = (text: string) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    const lines = doc.splitTextToSize(text, 182);
    doc.text(lines, 14, y);
    y += lines.length * 4.8 + 3;
  };

  const writeList = (items: string[]) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    for (const item of items) {
      const lines = doc.splitTextToSize(`- ${item}`, 180);
      doc.text(lines, 16, y);
      y += lines.length * 4.8 + 1;
      if (y > 275) {
        doc.addPage();
        y = 14;
      }
    }
    y += 2;
  };

  writeHeading('ATS Resume Review Report');
  writeParagraph(`File: ${result.fileName}`);
  writeParagraph(`Review Context: ${result.roleContext}`);
  writeParagraph(`Score: ${result.score}/100`);
  writeParagraph(`Summary: ${result.overallAssessment}`);
  writeHeading('Detected Details');
  writeParagraph(`Name: ${result.detectedData.candidateName}`);
  writeParagraph(`Email: ${result.detectedData.email}`);
  writeParagraph(`Phone: ${result.detectedData.phone}`);
  writeParagraph(`Target Role: ${result.detectedData.targetRole}`);
  writeParagraph(`Top Skills: ${result.detectedData.topSkills.join(', ')}`);
  writeHeading('Strengths');
  writeList(result.strengths);
  writeHeading('Issues Found');
  writeList(result.issuesFound);
  writeHeading('Tips to Improve Score');
  writeList(result.tips);

  doc.save(`${result.fileName.replace(/\.[^.]+$/, '')}_ATS_Report.pdf`);
}

function ConfidenceTag({ value }: { value: string }) {
  const confidence = getConfidence(value);
  const label = `${confidence} confidence`;
  return <span className={`${styles.confidenceTag} ${styles[confidence]}`}>{label}</span>;
}

export default function ResumeCheckerPage() {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [analyzeResult, setAnalyzeResult] = useState<ResumeReviewResult | null>(null);
  const [history, setHistory] = useState<ResumeReviewResult[]>([]);
  const [compareRunId, setCompareRunId] = useState<number | ''>('');
  const [checking, setChecking] = useState(false);
  const [message, setMessage] = useState('');

  const compareTarget = useMemo(
    () => history.find((run) => run.runId === compareRunId) ?? null,
    [compareRunId, history]
  );

  const scoreBand = analyzeResult ? getScoreBand(analyzeResult.score) : 'needsWork';
  const scoreDelta = analyzeResult && compareTarget ? analyzeResult.score - compareTarget.score : null;

  function onResumeChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    setResumeFile(file);
    setAnalyzeResult(null);
    setMessage(file ? `Selected ${file.name}.` : '');
  }

  async function onCheckResume() {
    if (!resumeFile) {
      setMessage('Upload a resume file before running the ATS check.');
      return;
    }

    setChecking(true);
    setMessage('');

    try {
      const result = await checkerApi.analyze({
        resume: resumeFile,
        jobDescription,
      });
      setAnalyzeResult(result);
      setHistory((prev) => [result, ...prev.filter((item) => item.runId !== result.runId)].slice(0, 6));
      setMessage(`ATS analysis complete for ${result.fileName}. Score ${result.score}%.`);
    } catch {
      setMessage('Failed to run ATS check. Verify the backend and upload a text-based PDF, DOCX, or TXT resume.');
    } finally {
      setChecking(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.grid} aria-hidden="true" />
      <div className={styles.orbA} aria-hidden="true" />
      <div className={styles.orbB} aria-hidden="true" />
      <section className={styles.hero}>
        <div className={styles.kicker}>ATS Checker</div>
        <h1>Analyze Your Resume</h1>
        <p>Check how your resume performs with ATS systems. Upload a file and get your score instantly.</p>
      </section>

      <section className={styles.panel}>
        <div className={styles.panelHeader}>
          <div>
            <h2>Resume Analysis</h2>
            <p>PDF, DOCX, DOC, and TXT formats supported.</p>
          </div>
          <div className={styles.actions}>
            <button className={styles.primaryButton} onClick={onCheckResume} disabled={checking}>
              {checking ? 'Analyzing...' : 'Analyze'}
            </button>
            {analyzeResult && (
              <button className={styles.secondaryButton} onClick={() => downloadReport(analyzeResult)}>
                Download Report
              </button>
            )}
          </div>
        </div>

        <div className={styles.formGrid}>
          <label className={styles.field}>
            <span>Resume File</span>
            <input type="file" accept=".pdf,.doc,.docx,.txt" onChange={onResumeChange} />
          </label>
          <label className={`${styles.field} ${styles.fieldWide}`}>
            <span>Job Description or Role</span>
            <textarea
              rows={6}
              placeholder="Optional: add job description or target role (e.g., Backend Developer)"
              value={jobDescription}
              onChange={(event) => setJobDescription(event.target.value)}
            />
          </label>
        </div>

        {message && <p className={styles.message}>{message}</p>}

        {analyzeResult && (
          <div className={styles.results}>
            <div className={styles.scoreCard}>
              <div className={styles.scoreTop}>
                <div>
                  <span className={styles.scoreLabel}>ATS Score</span>
                  <div className={styles.scoreValue}>
                    {analyzeResult.score}
                    <span>/100</span>
                  </div>
                </div>
                <span className={`${styles.scorePill} ${styles[scoreBand]}`}>
                  {scoreBand === 'needsWork' ? 'needs work' : scoreBand}
                </span>
              </div>
              <div className={styles.meterTrack}>
                <div className={`${styles.meterFill} ${styles[scoreBand]}`} style={{ width: `${analyzeResult.score}%` }} />
              </div>
              <p className={styles.summary}>{analyzeResult.overallAssessment}</p>
              <div className={styles.metaGrid}>
                <div>
                  <span>File</span>
                  <strong>{analyzeResult.fileName}</strong>
                </div>
                <div>
                  <span>Context</span>
                  <strong>{analyzeResult.roleContext}</strong>
                </div>
              </div>
            </div>

            <div className={styles.cardsGrid}>
              <article className={styles.detailCard}>
                <h3>Detected Details</h3>
                <p>
                  <strong>Name:</strong> {analyzeResult.detectedData.candidateName}{' '}
                  <ConfidenceTag value={analyzeResult.detectedData.candidateName} />
                </p>
                <p>
                  <strong>Email:</strong> {analyzeResult.detectedData.email}{' '}
                  <ConfidenceTag value={analyzeResult.detectedData.email} />
                </p>
                <p>
                  <strong>Phone:</strong> {analyzeResult.detectedData.phone}{' '}
                  <ConfidenceTag value={analyzeResult.detectedData.phone} />
                </p>
                <p>
                  <strong>Target Role:</strong> {analyzeResult.detectedData.targetRole}{' '}
                  <ConfidenceTag value={analyzeResult.detectedData.targetRole} />
                </p>
                <p>
                  <strong>Top Skills:</strong> {analyzeResult.detectedData.topSkills.join(', ')}
                </p>
              </article>

              <article className={styles.detailCard}>
                <h3>Strengths</h3>
                <ul>
                  {analyzeResult.strengths.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>

              <article className={styles.detailCard}>
                <h3>Issues Found</h3>
                <ul>
                  {analyzeResult.issuesFound.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            </div>

            <article className={styles.tipsCard}>
              <h3>Tips to Improve</h3>
              <ul>
                {analyzeResult.tips.map((tip) => (
                  <li key={tip}>{tip}</li>
                ))}
              </ul>
            </article>

            {history.length > 1 && (
              <article className={styles.compareCard}>
                <div className={styles.compareHead}>
                  <h3>Compare Results</h3>
                  <select
                    value={compareRunId}
                    onChange={(event) => setCompareRunId(event.target.value ? Number(event.target.value) : '')}
                  >
                    <option value="">Select a run</option>
                    {history
                      .filter((run) => run.runId !== analyzeResult.runId)
                      .map((run) => (
                        <option key={run.runId} value={run.runId}>
                          {run.fileName} ({run.score}%)
                        </option>
                      ))}
                  </select>
                </div>
                {compareTarget && scoreDelta !== null && (
                  <p className={`${styles.delta} ${scoreDelta >= 0 ? styles.deltaUp : styles.deltaDown}`}>
                    Score change: {scoreDelta >= 0 ? '+' : ''}
                    {scoreDelta}% compared to previous run
                  </p>
                )}
              </article>
            )}
          </div>
        )}
      </section>
    </div>
  );
}