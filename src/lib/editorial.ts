/**
 * William Joseph editorial rules for anything that appears on screen or in a post.
 * Headings use sentence case. Ampersands are refused. "Whilst" is refused.
 * The organisation name is written in full.
 */

const PROPER_WORDS = new Set([
  "William",
  "Joseph",
  "BookTrust",
  "Paul",
  "Hamlyn",
  "Foundation",
  "Ada",
  "Lovelace",
  "Institute",
  "Alan",
  "Turing",
  "Salesforce",
  "Nonprofit",
  "Britain",
  "London",
  "AI",
  "UK",
  "OKRs",
  "NCVO",
  "UN",
]);

export type CopyRole = "heading" | "kicker" | "body" | "caption" | "item" | "source";

export function sentenceCaseIssues(text: string): string[] {
  const issues: string[] = [];
  const wordRe = /[A-Za-z][A-Za-z'’-]*|[.!?]/g;
  let expectCapital = true;
  let match: RegExpExecArray | null;
  while ((match = wordRe.exec(text))) {
    const token = match[0];
    if (token === "." || token === "!" || token === "?") {
      expectCapital = true;
      continue;
    }
    const bare = token.replace(/['’]s$/i, "");
    const isAcronym = /^[A-Z]{2,6}$/.test(bare);
    const isProper = PROPER_WORDS.has(bare);
    const startsWithCapital = bare[0] === bare[0].toUpperCase();
    const hasInternalCapital = /[A-Z]/.test(bare.slice(1));
    if (expectCapital && !startsWithCapital) {
      issues.push(`Capitalise the start of the sentence near “${token}”.`);
    }
    if (!expectCapital && (startsWithCapital || hasInternalCapital) && !isProper && !isAcronym) {
      issues.push(`Use sentence case for “${token}”.`);
    }
    if ((isProper || isAcronym) && hasInternalCapital && !isProper) {
      issues.push(`“${token}” is not an allowed proper noun.`);
    }
    expectCapital = false;
  }
  return issues;
}

export function editorialIssues(text: string, role: CopyRole): string[] {
  const issues: string[] = [];
  if (/\bwhilst\b/i.test(text)) {
    issues.push("Use “while”, not “whilst”.");
  }
  if (/&/.test(text)) {
    issues.push("Do not use an ampersand. Write “and”.");
  }
  if (/\bWJ\b/.test(text)) {
    issues.push("Write “William Joseph” in full.");
  }
  if (role === "heading" || role === "kicker" || role === "item") {
    issues.push(...sentenceCaseIssues(text));
  }
  return issues;
}

export function assertEditorial(text: string, role: CopyRole, context: string): void {
  const issues = editorialIssues(text, role);
  if (issues.length > 0) {
    throw new Error(`${context}: ${issues.join(" ")}`);
  }
}
