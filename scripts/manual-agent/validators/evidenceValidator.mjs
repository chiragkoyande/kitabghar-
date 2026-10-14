export function validateEvidence({ experiment, snippets, figures, testReport, evidence }) {
  const errors = [];
  if (!evidence.files_used.length) errors.push("No implementation files were recorded.");
  if (!snippets.length) errors.push("No source snippets were extracted.");
  if (!figures.length) errors.push("No screenshots were collected.");
  if (!testReport.tests.length) errors.push("No browser tests were recorded.");
  if (testReport.tests.some((test) => test.status === "FAIL")) errors.push(`One or more Experiment ${experiment.id} browser tests failed.`);
  const blocked = testReport.tests.filter((test) => test.status === "BLOCKED").map((test) => test.id);
  return { status: errors.length ? "FAIL" : "PASS", errors, warnings: [...evidence.missing, ...(blocked.length ? [`Blocked tests recorded truthfully: ${blocked.join(", ")}`] : [])], experiment: experiment.id };
}
