// src/components/room/roomRendererStyles.ts
// MB-BLUE-99.11m → MB-BLUE-99.11m-kwtext-rainbow — 2026-01-18 (+0700)
//
// FIX (NO COLOR IN TEXT HIGHLIGHTS):
// - Root cause: a late CSS block forced `.mb-kw { background:#fff; color:black !important; }`
//   which nuked all highlight colors.
// - Keep keyword PILLS white (mb-keyBtn), BUT allow text highlights (.mb-entryText .mb-kw, .mb-welcomeLine .mb-kw)
//   to render with dark rainbow colors.
//
// NOTE:
// - Pills stay readable/white.
// - Text highlights become colorful (dark tone) and high-contrast on white background.
//
// PATCH (2026-01-28):
// - FIX: prevent BOX 4 entry text from hugging / “cutting” against card borders.
// - FIX: Community Chat must NOT overlay/cut off the essay. Box 5 must be normal-flow (flex) and collapsible.
//   We harden Box 5 container so it never “floats” over Box 4 even if a sticky/absolute style sneaks in.

export const ROOM_CSS = `
  /* Selector helpers (do NOT remove):
     A) scope + class on same node:   [data-mb-scope="room"].mb-room
     B) scope on parent wrapper:      [data-mb-scope="room"] .mb-room
     C) fallback by class only:       .mb-room
  */

  /* =============================
     ROOM SHELL (BASE TYPOGRAPHY)
     ============================= */
  [data-mb-scope="room"].mb-room,
  [data-mb-scope="room"] .mb-room,
  .mb-room{
    position: relative;
    padding: 18px 14px 16px; /* ✅ less cramped */
    border-radius: 24px;
    background:
      radial-gradient(900px 520px at 10% 8%, rgba(255, 105, 180, 0.085), transparent 60%),
      radial-gradient(900px 520px at 92% 18%, rgba(0, 200, 255, 0.085), transparent 62%),
      radial-gradient(900px 520px at 30% 92%, rgba(140, 255, 120, 0.070), transparent 62%),
      linear-gradient(180deg, rgba(255,255,255,0.92), rgba(248,250,252,0.86));
    box-shadow: 0 14px 46px rgba(0,0,0,0.08);
    backdrop-filter: blur(10px);
    display:flex;
    flex-direction: column;
    min-height: 72vh;
    min-width: 0;

    /* ✅ BASE readability (fixes “tiny text that ignores your classes”) */
    font-size: 17px;
    line-height: 1.6;
  }

  [data-mb-scope="room"][data-mb-theme="bw"].mb-room,
  [data-mb-scope="room"][data-mb-theme="bw"] .mb-room{
    background: linear-gradient(180deg, rgba(255,255,255,0.98), rgba(248,250,252,0.92));
  }

  /* Ensure form controls don’t inherit tiny defaults */
  [data-mb-scope="room"] .mb-room input,
  [data-mb-scope="room"] .mb-room button,
  [data-mb-scope="room"] .mb-room textarea,
  .mb-room input,
  .mb-room button,
  .mb-room textarea{
    font-size: 15px;
    line-height: 1.35;
  }

  /* =============================
     CARDS
     ============================= */
  [data-mb-scope="room"] .mb-card,
  .mb-room .mb-card{
    border: 1px solid rgba(15,23,42,0.08);
    background: rgba(255,255,255,0.74); /* ✅ slightly stronger */
    backdrop-filter: blur(12px);
    border-radius: 22px;
    box-shadow:
      0 10px 26px rgba(0,0,0,0.05),
      0 1px 0 rgba(255,255,255,0.60) inset;
    min-width: 0;
    position: relative;
    overflow: hidden;
  }

  [data-mb-scope="room"] .mb-card:before,
  .mb-room .mb-card:before{
    content:"";
    position:absolute;
    inset:0;
    pointer-events:none;
    background:
      linear-gradient(180deg, rgba(255,255,255,0.55), rgba(255,255,255,0) 42%),
      radial-gradient(520px 220px at 20% 0%, rgba(255,255,255,0.55), transparent 60%);
    opacity: 0.55;
  }

  [data-mb-scope="room"] .mb-card > *,
  .mb-room .mb-card > *{
    position: relative;
    z-index: 1;
  }

  /* =============================
     🔒 BOX 2 (ONE ROW, NEVER WRAP)
     ============================= */
  [data-mb-scope="room"] .mb-titleRow,
  .mb-room .mb-titleRow{
    display:flex;
    align-items:center;
    justify-content:space-between;
    gap: 8px;
    flex-wrap: nowrap;
    min-width:0;
    margin-bottom: 10px;
  }

  [data-mb-scope="room"] .mb-titleLeft,
  [data-mb-scope="room"] .mb-titleRight,
  .mb-room .mb-titleLeft,
  .mb-room .mb-titleRight{
    display:flex;
    align-items:center;
    gap: 8px;
    flex: 0 0 auto;
    min-width: 0;
  }

  [data-mb-scope="room"] .mb-titleCenter,
  .mb-room .mb-titleCenter{
    flex: 1 1 auto;
    min-width: 0;
    text-align:center;
  }

  [data-mb-scope="room"] .mb-tier,
  .mb-room .mb-tier{
    font-size: 12px; /* ✅ bump */
    font-weight: 850;
    padding: 4px 8px;
    border-radius: 999px;
    border: 1px solid rgba(15,23,42,0.12);
    background: rgba(255,255,255,0.78);
    text-transform: uppercase;
    max-width: 220px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    opacity: 0.76;
  }

  [data-mb-scope="room"] .mb-iconBtn,
  .mb-room .mb-iconBtn{
    width: 30px;
    height: 30px;
    border-radius: 10px;
    border: 1px solid rgba(15,23,42,0.12);
    background: rgba(255,255,255,0.86);
    display:flex;
    align-items:center;
    justify-content:center;
    font-size: 13px;
    flex: 0 0 auto;
    opacity: 0.70;
    transition: opacity 120ms ease, transform 120ms ease, box-shadow 120ms ease;
  }
  [data-mb-scope="room"] .mb-iconBtn:hover,
  .mb-room .mb-iconBtn:hover{
    opacity: 0.92;
    transform: translateY(-1px);
    box-shadow: 0 10px 18px rgba(0,0,0,0.06);
  }

  [data-mb-scope="room"] .mb-roomTitle,
  .mb-room .mb-roomTitle{
    font-family: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
    font-size: 36px; /* ✅ bump */
    line-height: 1.06;
    font-weight: 900;
    letter-spacing: -0.02em;
    text-transform: none;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  @media (max-width: 560px){
    [data-mb-scope="room"] .mb-roomTitle,
    .mb-room .mb-roomTitle{ font-size: 32px; }
  }

  /* =============================
     🔒 BOX 3 (WELCOME ONE ROW)
     ============================= */
  [data-mb-scope="room"] .mb-welcomeLine,
  .mb-room .mb-welcomeLine{
    padding: 10px 12px;
    font-size: 19px; /* ✅ bump */
    line-height: 1.55;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 1040px;
    margin: 0 auto;
  }

  [data-mb-scope="room"] .mb-keyRow,
  .mb-room .mb-keyRow{
    display:flex;
    flex-wrap: wrap;
    gap: 10px;
    justify-content:center;
    margin-top: 10px;
    padding: 2px 6px 0;
  }

  [data-mb-scope="room"] .mb-keyBtn,
  .mb-room .mb-keyBtn{
    border: 1px solid rgba(15,23,42,0.10);
    background: rgba(255,255,255,0.70);
    border-radius: 999px;
    padding: 9px 14px;
    font-weight: 800;
    font-size: 16px;
    line-height: 1.15;
    transition: transform 120ms ease, box-shadow 120ms ease, background 120ms ease, border-color 120ms ease;
  }
  [data-mb-scope="room"] .mb-keyBtn:hover,
  .mb-room .mb-keyBtn:hover{
    transform: translateY(-1px);
    box-shadow: 0 10px 18px rgba(0,0,0,0.05);
    background: rgba(255,255,255,0.86);
    border-color: rgba(15,23,42,0.16);
  }
  [data-mb-scope="room"] .mb-keyBtn[data-active="true"],
  .mb-room .mb-keyBtn[data-active="true"]{
    background: rgba(255,255,255,0.94);
    border-color: rgba(15,23,42,0.22);
    box-shadow: 0 10px 16px rgba(0,0,0,0.05);
  }

  [data-mb-scope="room"] .mb-keyBtn:disabled,
  .mb-room .mb-keyBtn:disabled{
    opacity: 0.28;
    filter: grayscale(1);
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none !important;
    background: rgba(255,255,255,0.55);
    border-color: rgba(15,23,42,0.06);
  }

  /* =============================
     TEXT HIGHLIGHTS (EN/VI)
     ============================= */

  [data-mb-scope="room"] .mb-entryText .mb-kw,
  [data-mb-scope="room"] .mb-welcomeLine .mb-kw,
  .mb-room .mb-entryText .mb-kw,
  .mb-room .mb-welcomeLine .mb-kw{
    font-weight: 850;
    padding: 0.03rem 0.18rem;
    border-radius: 0.45rem;
    background: transparent;
    text-shadow: none;
  }

  [data-mb-scope="room"] .mb-entryText .mb-kw-0,
  [data-mb-scope="room"] .mb-welcomeLine .mb-kw-0,
  .mb-room .mb-entryText .mb-kw-0,
  .mb-room .mb-welcomeLine .mb-kw-0{ color: #B91C1C; }

  [data-mb-scope="room"] .mb-entryText .mb-kw-1,
  [data-mb-scope="room"] .mb-welcomeLine .mb-kw-1,
  .mb-room .mb-entryText .mb-kw-1,
  .mb-room .mb-welcomeLine .mb-kw-1{ color: #C2410C; }

  [data-mb-scope="room"] .mb-entryText .mb-kw-2,
  [data-mb-scope="room"] .mb-welcomeLine .mb-kw-2,
  .mb-room .mb-entryText .mb-kw-2,
  .mb-room .mb-welcomeLine .mb-kw-2{ color: #A16207; }

  [data-mb-scope="room"] .mb-entryText .mb-kw-3,
  [data-mb-scope="room"] .mb-welcomeLine .mb-kw-3,
  .mb-room .mb-entryText .mb-kw-3,
  .mb-room .mb-welcomeLine .mb-kw-3{ color: #047857; }

  [data-mb-scope="room"] .mb-entryText .mb-kw-4,
  [data-mb-scope="room"] .mb-welcomeLine .mb-kw-4,
  .mb-room .mb-entryText .mb-kw-4,
  .mb-room .mb-welcomeLine .mb-kw-4{ color: #0F766E; }

  [data-mb-scope="room"] .mb-entryText .mb-kw-5,
  [data-mb-scope="room"] .mb-welcomeLine .mb-kw-5,
  .mb-room .mb-entryText .mb-kw-5,
  .mb-room .mb-welcomeLine .mb-kw-5{ color: #1D4ED8; }

  [data-mb-scope="room"] .mb-entryText .mb-kw-6,
  [data-mb-scope="room"] .mb-welcomeLine .mb-kw-6,
  .mb-room .mb-entryText .mb-kw-6,
  .mb-room .mb-welcomeLine .mb-kw-6{ color: #6D28D9; }

  [data-mb-scope="room"] .mb-entryText .mb-kw-7,
  [data-mb-scope="room"] .mb-welcomeLine .mb-kw-7,
  .mb-room .mb-entryText .mb-kw-7,
  .mb-room .mb-welcomeLine .mb-kw-7{ color: #BE185D; }

  /* =============================
     PATCH: Essay safety spacing + prevent chat overlay
     (Use !important here because later CSS may introduce sticky/fixed by accident)
     ============================= */
  [data-mb-scope="room"] .mb-box4 .mb-zoomWrap,
  .mb-room .mb-box4 .mb-zoomWrap{
    padding-bottom: 320px !important; /* room for chat+composer so VI text never gets covered */
    scroll-padding-bottom: 320px !important;
  }

  [data-mb-scope="room"] .mb-chatWrap,
  .mb-room .mb-chatWrap,
  [data-mb-scope="room"] .mb-chatComposer,
  .mb-room .mb-chatComposer{
    position: static !important;
  }
  /* =============================
     Audio clamp
     ============================= */
  [data-mb-scope="room"] .mb-audioClamp,
  .mb-room .mb-audioClamp{
    width: 100%;
    max-width: 100%;
    min-width: 0;
    overflow: hidden;
    border-radius: 18px;
    clip-path: inset(0 round 18px);
  }
  [data-mb-scope="room"] .mb-audioClamp *,
  .mb-room .mb-audioClamp *{
    max-width: 100%;
    box-sizing: border-box;
    min-width: 0;
  }

  /* =============================
     BOX 4: ONLY grow/scroll area
     ============================= */
  [data-mb-scope="room"] .mb-box4,
  .mb-room .mb-box4{
    flex: 1 1 auto;
    min-height: 0;
    overflow: hidden;
    position: relative;
    z-index: 0;
  }

  [data-mb-scope="room"] .mb-zoomWrap,
  .mb-room .mb-zoomWrap{
    height: 100%;
    min-height: 0;
    overflow: auto;

    /* ✅ SAFETY GAP: keep text off borders */
    padding: 14px 16px;
    box-sizing: border-box;

    --mbz: calc(var(--mb-essay-zoom, 100) / 100);
    transform: scale(var(--mbz));
    transform-origin: top left;
    width: calc(100% / var(--mbz));
  }

  [data-mb-scope="room"] .mb-box4 .mb-entryText,
  .mb-room .mb-box4 .mb-entryText{
    padding: 12px 14px;
    box-sizing: border-box;
  }
  [data-mb-scope="room"] .mb-box4 p,
  .mb-room .mb-box4 p{
    overflow-wrap: anywhere;
  }

  /* =============================
     🔒 BOX 5: must be normal-flow (NO OVERLAY)
     ============================= */
  [data-mb-scope="room"] .mb-box5,
  .mb-room .mb-box5{
    flex: 0 0 auto;
    min-height: 0;
    margin-top: 10px;

    /* ✅ kill any accidental overlay behavior */
    position: relative !important;
    bottom: auto !important;
    top: auto !important;
    left: auto !important;
    right: auto !important;
    transform: none !important;
    z-index: 1;
  }

  /* If the chat wrapper itself got made sticky/absolute somewhere, hard-reset it */
  [data-mb-scope="room"] .mb-chatWrap,
  .mb-room .mb-chatWrap{
    position: relative !important;
  }

  /* =============================
     BOX 5 (Community Chat)
     ============================= */
  [data-mb-scope="room"] .mb-chatWrap,
  .mb-room .mb-chatWrap{
    border: 1px solid rgba(15,23,42,0.06);
    background: rgba(255,255,255,0.64);
    border-radius: 18px;
    padding: 10px 10px;
    min-width: 0;
  }
  [data-mb-scope="room"] .mb-chatHeader,
  .mb-room .mb-chatHeader{
    display:flex;
    align-items:center;
    justify-content: space-between;
    gap: 10px;
    margin-bottom: 8px;
    font-weight: 950;
    font-size: 14px;
    opacity: 0.92;
  }
  [data-mb-scope="room"] .mb-chatList,
  .mb-room .mb-chatList{
    height: 220px;
    overflow: auto;
    border: 1px solid rgba(15,23,42,0.08);
    background: rgba(255,255,255,0.52);
    border-radius: 14px;
    padding: 8px 8px;
  }
  [data-mb-scope="room"] .mb-chatMsg,
  .mb-room .mb-chatMsg{
    padding: 6px 8px;
    border-radius: 12px;
    background: rgba(255,255,255,0.72);
    border: 1px solid rgba(15,23,42,0.06);
    margin-bottom: 8px;
    font-size: 15px;
    line-height: 1.45;
    overflow-wrap: anywhere;
    word-break: break-word;
  }
  [data-mb-scope="room"] .mb-chatMeta,
  .mb-room .mb-chatMeta{
    font-size: 12px;
    opacity: 0.70;
    margin-bottom: 2px;
    font-weight: 850;
  }
  [data-mb-scope="room"] .mb-chatComposer,
  .mb-room .mb-chatComposer{
    display:flex;
    gap: 10px;
    align-items:center;
    margin-top: 8px;
  }
  [data-mb-scope="room"] .mb-chatComposer input,
  .mb-room .mb-chatComposer input{
    flex: 1 1 auto;
    min-width: 0;
    border: 1px solid rgba(15,23,42,0.10);
    background: rgba(255,255,255,0.82);
    border-radius: 14px;
    padding: 10px 12px;
    font-size: 15px;
    outline: none;
  }
  [data-mb-scope="room"] .mb-chatComposer button,
  .mb-room .mb-chatComposer button{
    width: 42px;
    height: 42px;
    border-radius: 16px;
    border: 1px solid rgba(15,23,42,0.12);
    background: rgba(255,255,255,0.86);
    font-weight: 950;
    flex: 0 0 auto;
    opacity: 0.92;
  }

  /* =============================
     Feedback bar
     ============================= */
  [data-mb-scope="room"] .mb-feedback,
  .mb-room .mb-feedback{
    border: 1px solid rgba(15,23,42,0.10);
    background: rgba(255,255,255,0.50);
    border-radius: 18px;
    padding: 8px 10px;
    display: flex;
    gap: 10px;
    align-items: center;
    min-width: 0;
  }
  [data-mb-scope="room"] .mb-feedback input,
  .mb-room .mb-feedback input{
    flex: 1 1 auto;
    min-width: 0;
    background: transparent;
    outline: none;
    font-size: 15px;
  }
  [data-mb-scope="room"] .mb-feedback button,
  .mb-room .mb-feedback button{
    flex: 0 0 auto;
    width: 38px;
    height: 38px;
    border-radius: 14px;
    border: 1px solid rgba(15,23,42,0.14);
    background: rgba(255,255,255,0.84);
    display:flex;
    align-items:center;
    justify-content:center;
  }

  /* =============================
     Guide corner
     ============================= */
  [data-mb-scope="room"] .mb-guideCorner,
  .mb-room .mb-guideCorner{
    position:absolute;
    top: 14px;
    right: 14px;
    z-index: 5;
    display:flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 10px;
    pointer-events: auto;
  }
  [data-mb-scope="room"] .mb-guideBtn,
  .mb-room .mb-guideBtn{
    height: 34px;
    padding: 0 12px;
    border-radius: 999px;
    border: 1px solid rgba(15,23,42,0.12);
    background: rgba(255,255,255,0.92);
    font-size: 14px;
    font-weight: 900;
    box-shadow: 0 10px 22px rgba(0,0,0,0.06);
    opacity: 0.95;
  }
  [data-mb-scope="room"] .mb-guidePanel,
  .mb-room .mb-guidePanel{
    width: min(360px, calc(100vw - 48px));
    border-radius: 16px;
    border: 1px solid rgba(15,23,42,0.14);
    background: rgba(255,255,255,0.96);
    box-shadow: 0 18px 55px rgba(0,0,0,0.12);
    overflow: hidden;
  }

  /* =============================
     KEYWORD PILL UX (PILLS ONLY)
     ============================= */
  .mb-room .mb-keyBtn,
  [data-mb-scope="room"] .mb-keyBtn{
    background: #ffffff !important;
    color: rgba(0, 0, 0, 0.88) !important;
    border: 1px solid rgba(0, 0, 0, 0.14) !important;
    box-shadow: none !important;
    text-shadow: none !important;
  }

  .mb-room .mb-keyBtn:hover,
  [data-mb-scope="room"] .mb-keyBtn:hover{
    border-color: rgba(0, 0, 0, 0.28) !important;
  }

  .mb-room .mb-keyBtn[data-active="true"],
  [data-mb-scope="room"] .mb-keyBtn[data-active="true"]{
    border-color: rgba(0, 0, 0, 0.40) !important;
  }

  .mb-room .mb-keyBtn:disabled,
  [data-mb-scope="room"] .mb-keyBtn:disabled{
    opacity: 0.55 !important;
  }
`;
