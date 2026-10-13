# MGI on-device voice assistant

The `/ai-voice/` page runs without server-side AI credentials or a paid inference API. Other website pages keep their existing assets and navigation.

## Experiences

- Published source guidance works immediately from `knowledge.json` and includes page links. It is retrieval, not generative AI.
- Three pre-generated Kokoro American-English samples can be previewed immediately.
- Optional Kokoro neural speech, Whisper tiny.en recording transcription, and Qwen3-0.6B conversational responses run in a bundled module worker using single-threaded WASM. Models download only after the visitor selects features and uses them. Model changes dispose the previous model to limit memory use.
- Recording is push-to-talk, limited to 25 seconds. The visitor reviews the transcription before sending. Microphone access is permitted on this route and disabled on other pages.
- Stop interrupts playback, terminates active inference, and releases microphone tracks. History is held in memory in the current tab and can be cleared.

Model files and runtime WASM download from Hugging Face and jsDelivr. Their requests expose normal download metadata to those hosts; questions and audio are processed locally. Browser storage, network speed and device memory determine model availability and speed. This is not a hosted unlimited inference service. Text remains usable if model downloads or execution fail.

## Maintaining knowledge and runtime

Run `python scripts/refresh-voice-knowledge.py` from the repository root to refresh the canonical live pages, or append `--local` to use repository HTML. Review the knowledge diff before publishing. The refresh fails without replacing the file if the crawl is incomplete.

Run `node ai-voice/tests/grounding.mjs` for retrieval and policy checks. These checks do not establish the accuracy of every generated answer. Unsupported generated numbers, claims or inadequate source overlap trigger published-source guidance.

To rebuild the bundled worker, install the exact dependencies declared in `src/package.json` in an isolated directory, then run `node ai-voice/src/build.mjs /absolute/path/to/node_modules`. Preserve `worker.js.LEGAL.txt` and `vendor/` notices. Model revisions and voice files are pinned in the source and build script.

Validation included 35 retrieval/policy cases, 46 browser flow checks, three real Kokoro voice generations, a synthetic speech Whisper round trip, and Qwen3 cases with source fallback. Browser tests ran on Chromium Linux at 320, 390, 412 and 1440px widths. Physical iPhone/Safari and Android performance have not been measured.
