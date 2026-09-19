// Dev-only: a piece that always throws while rendering. Lets
// tools/test-journal-blocks.mjs prove a crashing game falls back to its
// description instead of taking the article down. Shown only at
// /journal-sandbox?crash (see src/pages/JournalSandbox.tsx).
export default function SandboxCrash(): never {
  throw new Error('sandbox: this piece always crashes');
}
