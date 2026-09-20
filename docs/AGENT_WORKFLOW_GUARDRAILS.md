# Agent Workflow Guardrails

Purpose: prevent future phase execution from drifting away from the user's intended design.

## Core Rule

The phase `.md` files provided by the user are the working contract.

Do not reinterpret, replace, or redesign that contract without explicit confirmation from the user.

## Before Executing A Phase

1. Read the requested phase document fully.
2. Read any linked/addendum phase document fully.
3. Compare the phase document with the latest user instruction.
4. Summarize the intended implementation in plain language before making risky or broad changes.
5. If there is any conflict, missing detail, or unclear wording, ask the user first.

## Do Not Guess

If a requirement can reasonably mean two different things, stop and ask.

Examples:

- Whether a vanilla entity should be fully replaced or migrated into a custom `warchief:*` entity.
- Whether a vanilla behavior should be preserved, blocked, or removed.
- Whether a phase document should be updated or only implemented.
- Whether a test requirement is runtime-only or should be enforced in JSON/script.

## Documentation Discipline

Do not use documentation edits to justify a guessed implementation.

Only update `.md` files when:

- the user asks for it;
- the implementation is already confirmed;
- the update records a completed result, limitation, or checkpoint;
- the update corrects an agreed design decision.

When updating docs, preserve the user's intent and wording direction.

## Scope Discipline

Prefer the smallest implementation that satisfies the current phase.

Avoid:

- creating parallel architecture paths;
- inventing new entity IDs or systems when the phase says to master existing ones;
- broad refactors that do not directly serve the phase;
- changing asset paths or naming conventions unless required;
- consuming time/tokens on speculative alternatives.

## Confirmation Trigger

Ask before continuing if any of these happen:

- the phase docs and latest user message disagree;
- the implementation would remove a behavior the user previously liked;
- the implementation would change spawn method, entity ID, or ownership model;
- the change would invalidate an earlier manual test result;
- a documentation link suggests a different path than the user's stated design.

## Reporting

Final reports must clearly separate:

- implemented and built locally;
- statically validated;
- packaged locally;
- pushed to GitHub;
- blocked by network/tooling;
- still requiring Minecraft runtime testing.

Never claim a runtime behavior is confirmed unless it was actually tested in Minecraft.
