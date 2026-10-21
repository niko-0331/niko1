"use strict";

/* =========================================================
   夜道のあしおと  -  ストーカー被害ホラーADV
   分岐: 「誰かに話す」→ ハッピーエンド / 「誰にも言えない」→ バッドエンド
   ========================================================= */

/* ---------- 状態 ---------- */
const state = { hide: 0, evidence: 0, told: false, fear: 0 };
let soundOn = true;

/* ---------- シナリオ ---------- */
// bg: 背景 / fear: 恐怖(0-5) / fig: 人影 / eyes: 目 / fx: shake,flash / sfx: 効果音
// t: ページ配列(または関数) / c: 選択肢 / next: 次シーン / end: エンディング
const scenes = {
  intro: {
    bg: "street", fear: 1,
    t: [
      "十月の終わり。\n大学の図書館を出たのは、夜の九時を過ぎていた。",
      "私の名前は、水瀬 美咲。大学二年生。\n一人暮らしを始めて、もうすぐ二年になる。",
      "――ここ二週間、誰かに見られている気がする。",
      "気のせい。\nそう思いたかった。"
    ],
    next: "w1"
  },
  w1: {
    bg: "street", fear: 2, sfx: "steps",
    t: [
      "住宅街の細い道。\n街灯が、じりじりと小さな音を立てている。",
      "……コツ、コツ。",
      "私の足音に、ほんの少し遅れて、もうひとつの足音が重なる。",
      "立ち止まると、止まる。\n歩き出すと、また、歩き出す。"
    ],
    c: [
      { t: "思い切って振り返る", to: "w1a" },
      { t: "振り返らず、足早に歩く", to: "w1b" }
    ]
  },
  w1a: {
    bg: "street", fear: 3, fig: true, fx: "flash", sfx: "sting",
    t: [
      "勇気を出して、振り返る。",
      "……誰もいない。",
      "けれど、電柱の影が、さっきまで『人の形』をしていた気がした。",
      "喉が、からからに乾いている。"
    ],
    next: "h1"
  },
  w1b: {
    bg: "street", fear: 3, sfx: "steps",
    t: [
      "前だけを見て、ほとんど走るように歩いた。",
      "背中に、視線がぴったりと貼りついている。",
      "アパートのオートロックを抜けて、やっと息を吐いた。"
    ],
    next: "h1"
  },
  h1: {
    bg: "room", fear: 3, sfx: "sting",
    t: [
      "郵便受けに、切手のない白い封筒が入っていた。",
      "中身は、一枚の写真。\n――今日、図書館を出る私。",
      "裏には、ボールペンの細い字。",
      "『今日の服、似合ってたよ。\n　ずっと見てるからね』"
    ],
    c: [
      { t: "証拠として写真を撮り、保存しておく", to: "h1b", ev: 1 },
      { t: "気味が悪い。見なかったことにして捨てる", to: "h1b", hide: 1 }
    ]
  },
  h1b: {
    bg: "room", fear: 2,
    t: [
      "震える手でドアに鍵をかけ、チェーンもかけた。",
      "そのとき、スマホが鳴った。\n画面には『蓮』の文字。",
      "――彼氏の、高槻 蓮。"
    ],
    next: "r1"
  },
  r1: {
    bg: "room", fear: 2,
    t: [
      "「もしもし、美咲？ 声、元気ないな。何かあった？」",
      "蓮の声は、いつもどおり優しい。",
      "話せば、きっと楽になる。でも――",
      "『ストーカーされてるなんて、重いって思われたら？』\n『心配かけて、嫌われたら？』"
    ],
    c: [
      { t: "「実は……ずっと、誰かに見られてるの」", to: "k1", told: true },
      { t: "「ううん、ちょっと疲れただけ」", to: "d2", hide: 1 }
    ]
  },

  /* ---------- 二日目 ---------- */
  d2: {
    bg: "campus", fear: 3, sfx: "sting",
    t: [
      "翌日。大学のカフェテリア。",
      "スマホに、知らない番号からのメッセージが届いた。",
      "『昨日はちゃんと眠れた？\n　電気、消えるの遅かったね』",
      "……私の部屋の電気を、外から見ている。",
      "指先が、すうっと冷たくなった。"
    ],
    next: "d2b"
  },
  d2b: {
    bg: "campus", fear: 3,
    t: [
      "「美咲、顔色悪いよ？ 大丈夫？」",
      "親友の結衣が、心配そうに顔をのぞき込んでくる。"
    ],
    c: [
      { t: "結衣に、すべて打ち明ける", to: "d2y" },
      { t: "「寝不足なだけだよ」と笑ってごまかす", to: "n2", hide: 1 }
    ]
  },
  d2y: {
    bg: "campus", fear: 3,
    t: [
      "結衣は話を聞くなり、真剣な顔になった。",
      "「それ、完全にストーカーだよ。蓮くんに言わなきゃ。警察にも相談しよう」",
      "「ひとりで抱えちゃだめ。ね？」"
    ],
    c: [
      { t: "「……うん。蓮に話してみる」", to: "k1", told: true },
      { t: "「心配かけたくない。大丈夫だから」", to: "n2", hide: 1 }
    ]
  },
  n2: {
    bg: "room", fear: 4, sfx: "knock",
    t: [
      "その夜。",
      "ベッドの中で、スマホの画面だけが小さく光っている。",
      "ピンポン。",
      "……インターホンが鳴った。時刻は、午前一時。",
      "モニターには、誰も映っていない。",
      "ドアの向こうで、かすかに、息づかいが聞こえた気がした。"
    ],
    c: [
      { t: "ドアスコープを覗く", to: "n2a" },
      { t: "布団をかぶって、耐える", to: "n2b" }
    ]
  },
  n2a: {
    bg: "room", fear: 5, fig: true, eyes: true, fx: "flash", sfx: "sting",
    t: [
      "ドアスコープに、そっと目を近づける。",
      "――レンズの向こうに、誰かの『目』があった。",
      "悲鳴を必死にこらえて、後ずさる。",
      "足音が、ゆっくりと階段を降りていった。"
    ],
    next: "n2c"
  },
  n2b: {
    bg: "room", fear: 4, sfx: "knock",
    t: [
      "耳をふさいで、目を閉じる。",
      "ドアノブが、がちゃり、と一度だけ回った。",
      "……長い、長い時間のあと、足音は遠ざかっていった。"
    ],
    next: "n2c"
  },
  n2c: {
    bg: "dawn", fear: 3,
    t: [
      "朝まで、一睡もできなかった。",
      "蓮からメッセージが届いている。",
      "『今夜、バイト終わったら会えない？\n　美咲の顔が見たい』"
    ],
    c: [
      { t: "「会いたい。聞いてほしいことがあるの」", to: "k1", told: true },
      { t: "「ごめん、今日は忙しいの」", to: "d3", hide: 1 }
    ]
  },

  /* ---------- 三日目 (バッドルート) ---------- */
  d3: {
    bg: "street", fear: 4,
    t: [
      "三日目の夜。",
      "図書館の閉館は二十二時。\n私は、わざと最後まで残っていた。",
      "家に帰るのが怖い。でも、帰らなきゃいけない。",
      "スマホには、蓮からの通知がひとつ。\n『終わったら電話して。迎えに行くよ』",
      "……画面を見つめる。\nまだ、間に合う。"
    ],
    c: [
      { t: "蓮に電話して、すべて話す", to: "k1", told: true },
      { t: "「大丈夫」とだけ返信して、ひとりで帰る", to: "b1", hide: 1 }
    ]
  },
  b1: {
    bg: "street", fear: 4, sfx: "steps",
    t: [
      "『大丈夫！ 一人で帰れるよ』",
      "送信ボタンを押した指が、震えていた。",
      "外は、もう真っ暗だ。\n街灯の数が、やけに少ない。",
      "――コツ、コツ。",
      "来た。"
    ],
    next: "b2"
  },
  b2: {
    bg: "alley", fear: 5, fig: true, sfx: "steps",
    t: [
      "いつもの大通りを避けて、近道の路地に入ってしまった。",
      "自販機の青白い光だけが、ぽつんと灯っている。",
      "背後の足音が、少しずつ、近づく。",
      "コツ、コツ、コツ。",
      "もう、走れなかった。足が、動かない。"
    ],
    c: [
      { t: "震える手で、スマホを取り出す", to: "b3" },
      { t: "「誰にも言えない」と、息を殺して歩き続ける", to: "b4", hide: 1 }
    ]
  },
  b3: {
    bg: "alley", fear: 5, fig: true,
    t: [
      "画面に『蓮』の名前。\n通話ボタンに、指をのばす。",
      "けれど、頭の中で声がする。",
      "『迷惑をかけるだけだよ』\n『どうせ信じてもらえない』\n『今さら言えない』",
      "――押すか、押さないか。"
    ],
    c: [
      { t: "通話ボタンを押す", to: "k_late", told: true },
      { t: "画面を消して、ポケットにしまう", to: "b4", hide: 1 }
    ]
  },
  b4: {
    bg: "dark", fear: 5, fig: true, eyes: true, fx: "shake", sfx: "sting",
    t: [
      "『誰にも、言えない』",
      "足音が、すぐ後ろまで来ている。",
      "ゆっくり振り返ると、街灯の下に、男が立っていた。",
      "見覚えのある顔。\n毎日のように、すれ違っていた――",
      "「やっと、ふたりきりになれたね」",
      "銀色のものが、街灯の光を、鈍く跳ね返した。"
    ],
    next: "b5"
  },
  b5: {
    bg: "blood", fear: 5, fx: "shake", sfx: "heart",
    t: [
      "熱い。",
      "お腹の奥に、焼けた鉄を押し当てられたみたいに、熱い。",
      "声が、出ない。\n膝から、アスファルトの冷たさが這い上がってくる。",
      "男が、何かをつぶやきながら、闇の中へ消えていく。",
      "ポケットの中で、スマホが震えている。",
      "『蓮：今どこ？ 返事して』\n『蓮：美咲？ 美咲！』",
      "……ごめんね、蓮。",
      "ちゃんと、話せばよかった。",
      "視界が、ゆっくりと、暗くなっていく。"
    ],
    next: "e_bad"
  },
  e_bad: {
    bg: "dark", fear: 0,
    t: [
      "翌朝。住宅街の路地で、若い女性が倒れているのが発見された。",
      "女性のスマホには、恋人からの着信が、四十七件。",
      "彼女が助けを求められる瞬間は、何度もあった。\nけれど、その声は、最後まで誰にも届かなかった。"
    ],
    end: { type: "bad", title: "BAD END", sub: "誰にも言えなかった夜" }
  },

  /* ---------- 相談ルート (ハッピー) ---------- */
  k1: {
    bg: "warm", fear: 1,
    t: [
      "「……そっか。話してくれて、ありがとう」",
      "電話の向こうで、蓮は一度も私を責めなかった。",
      "「今から行く。ひとりにしないから」",
      "――その声を聞いた瞬間、張りつめていたものがほどけて、涙があふれた。"
    ],
    next: "k2"
  },
  k2: {
    bg: "warm", fear: 1,
    t: () => [
      "蓮は、すぐに駆けつけてくれた。",
      "届いた手紙のこと、不審なメッセージのこと、深夜のインターホンのこと。\n私は、すべてを話した。",
      state.evidence > 0
        ? "保存しておいた写真を見せると、蓮は力強くうなずいた。\n「これは大きな証拠になる。よく残してくれた」"
        : "「手紙、捨てちゃったのか……。でも大丈夫。これから、証拠を集めていこう」",
      "「ひとりで怖かったよな。もう、大丈夫だから」"
    ],
    next: "k3"
  },
  k3: {
    bg: "campus", fear: 1,
    t: [
      "翌日、蓮と結衣に付き添われて、警察署の相談窓口へ向かった。",
      "担当の警察官は、真剣にメモを取ってくれた。",
      "「ストーカー規制法の対象になり得ます。警告も出せますし、防犯ブザーの貸与、パトロールの強化もしましょう」",
      "『相談して、よかった』",
      "初めて、そう思えた。"
    ],
    next: "k4"
  },
  k4: {
    bg: "street", fear: 4, fig: true, sfx: "steps",
    t: [
      "その夜。\n蓮は、私と並んで夜道を歩いてくれた。",
      "「大丈夫。今日は、俺がいる」",
      "――コツ、コツ。",
      "来た。あの足音。",
      "でも今日は、ひとりじゃない。",
      "街灯の影から、男が姿を現した。",
      "「……なんで、そいつと一緒なんだよ。美咲ちゃんは、僕のものなのに」"
    ],
    c: [
      { t: "防犯ブザーを、思い切り鳴らす", to: "k5a" },
      { t: "蓮の後ろで、一一〇番に通報する", to: "k5b" }
    ]
  },
  k5a: {
    bg: "street", fear: 3, fx: "shake", sfx: "alarm",
    t: [
      "ピィィィィィィ――ッ！！",
      "夜の住宅街に、甲高い警報音が響き渡る。",
      "男がひるんだ隙に、蓮が私の前に立ちはだかった。",
      "「二度と、近づくな」"
    ],
    next: "k6"
  },
  k5b: {
    bg: "street", fear: 3,
    t: [
      "震える指で、一一〇番を押す。",
      "「ストーカーです。今、目の前にいます！」",
      "蓮が私の肩を抱き、男から一歩も引かない。",
      "男が逃げ出そうと背を向けた、そのとき――"
    ],
    next: "k6"
  },
  k6: {
    bg: "street", fear: 1,
    t: [
      "近所の窓に明かりが灯り、サイレンの音が近づいてくる。",
      "パトカーから降りた警察官が、あっという間に男を取り押さえた。",
      "男は、同じ講義を取っている学生だった。",
      "「ごめん……ただ、見ていたかっただけで……」",
      "その言葉を、もう、怖いとは思わなかった。"
    ],
    next: "e_happy"
  },
  e_happy: {
    bg: "dawn", fear: 0,
    t: () => [
      state.evidence > 0
        ? "男は、保存していた証拠が決め手となり、ストーカー規制法違反で逮捕された。"
        : "男は警察から厳重な警告を受け、接近禁止の対象になった。以来、足音が追ってくることは二度となかった。",
      "「もう、ひとりで抱えなくていいんだよ」",
      "蓮が、私の手をぎゅっと握る。",
      "夜空には、小さな星がいくつも瞬いていた。",
      "――誰かに話すことは、弱さじゃなかった。"
    ],
    end: { type: "happy", title: "HAPPY END", sub: "ひとりじゃない夜" }
  },
  k_late: {
    bg: "alley", fear: 5, fig: true, sfx: "alarm",
    t: [
      "通話ボタンを押した。\nワンコールで、蓮が出た。",
      "「美咲！？ どうした！」",
      "「たすけて……後ろに……」",
      "蓮は、すべてを察して叫んだ。\n「位置情報を送れ！ 警察に連絡する、電話は切るな！」",
      "背後から、男が走り寄る足音。",
      "それでも、電話の向こうの声が、私を支えていた。",
      "「助けてください！！ 誰か！！」",
      "近くの家の窓が開き、人が顔を出す。\n男は舌打ちをして、闇へ逃げていった。"
    ],
    next: "e_late"
  },
  e_late: {
    bg: "dawn", fear: 0,
    t: [
      "数分後、蓮とパトカーが駆けつけた。",
      "蓮は息を切らしながら、私を強く抱きしめた。\n「間に合って、よかった……」",
      "男は翌日、防犯カメラの映像から特定され、逮捕された。",
      "もっと早く話していれば、こんなに怖い思いをしなくて済んだのかもしれない。",
      "でも、最後の最後で、私は『助けて』と言えた。"
    ],
    end: { type: "good", title: "HAPPY END (ギリギリ)", sub: "最後に伸ばした手" }
  }
};

const ENDING_IDS = ["bad", "happy", "good"];

/* ---------- 要素 ---------- */
const $ = (id) => document.getElementById(id);
const stage = $("stage"), figure = $("figure"), textbox = $("textbox");
const textEl = $("text"), nextMark = $("nextMark"), choicesEl = $("choices");
const fearFill = $("fearFill");

let current = null;   // 現在のシーン
let pages = [];       // 現在のページ
let pageIdx = 0;
let typing = false;
let typeTimer = null;
let fullText = "";

/* ---------- エンディング記録 ---------- */
function getSeen() {
  try { return JSON.parse(localStorage.getItem("hitianavi_endings") || "[]"); } catch (e) { return []; }
}
function saveSeen(type) {
  const s = getSeen();
  if (!s.includes(type)) { s.push(type); try { localStorage.setItem("hitianavi_endings", JSON.stringify(s)); } catch (e) {} }
}
function updateCounts() {
  const n = getSeen().length;
  const label = `エンディング回収 ${n} / ${ENDING_IDS.length}`;
  $("endingCount").textContent = label;
  $("endingCount2").textContent = label;
}

/* ---------- 音 (WebAudio) ---------- */
let AC = null, master = null, heartTimer = null;

function initAudio() {
  if (AC) return;
  try {
    AC = new (window.AudioContext || window.webkitAudioContext)();
    master = AC.createGain();
    master.gain.value = soundOn ? 0.6 : 0;
    master.connect(AC.destination);

    // 環境音(低いドローン)
    const lp = AC.createBiquadFilter();
    lp.type = "lowpass"; lp.frequency.value = 220;
    const g = AC.createGain(); g.gain.value = 0.07;
    [48, 48.7, 72].forEach((f, i) => {
      const o = AC.createOscillator();
      o.type = i === 2 ? "sine" : "sawtooth";
      o.frequency.value = f;
      o.connect(lp); o.start();
    });
    lp.connect(g); g.connect(master);
    const lfo = AC.createOscillator(), lg = AC.createGain();
    lfo.frequency.value = 0.15; lg.gain.value = 60;
    lfo.connect(lg); lg.connect(lp.frequency); lfo.start();
  } catch (e) { AC = null; }
}

function tone(freq, dur, type = "sine", vol = 0.3, delay = 0) {
  if (!AC || !soundOn) return;
  const t0 = AC.currentTime + delay;
  const o = AC.createOscillator(), g = AC.createGain();
  o.type = type; o.frequency.value = freq;
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(vol, t0 + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  o.connect(g); g.connect(master);
  o.start(t0); o.stop(t0 + dur + 0.05);
}

function noise(dur, vol, freq, delay = 0) {
  if (!AC || !soundOn) return;
  const t0 = AC.currentTime + delay;
  const len = Math.floor(AC.sampleRate * dur);
  const buf = AC.createBuffer(1, len, AC.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
  const src = AC.createBufferSource(); src.buffer = buf;
  const f = AC.createBiquadFilter(); f.type = "lowpass"; f.frequency.value = freq;
  const g = AC.createGain(); g.gain.value = vol;
  src.connect(f); f.connect(g); g.connect(master);
  src.start(t0);
}

function sfx(name) {
  if (!AC) return;
  switch (name) {
    case "steps":
      for (let i = 0; i < 6; i++) noise(0.12, 0.5, 500, i * 0.5);
      break;
    case "knock":
      for (let i = 0; i < 3; i++) noise(0.15, 0.9, 300, i * 0.35);
      break;
    case "sting":
      tone(880, 1.2, "sawtooth", 0.18);
      tone(932, 1.2, "sawtooth", 0.18);
      tone(110, 1.4, "square", 0.12);
      break;
    case "alarm":
      for (let i = 0; i < 8; i++) tone(i % 2 ? 2400 : 3000, 0.12, "square", 0.12, i * 0.13);
      break;
    case "heart":
      thump(); setTimeout(thump, 700); setTimeout(thump, 1500);
      break;
  }
}
function thump() { tone(60, 0.18, "sine", 0.7); tone(48, 0.22, "sine", 0.6, 0.2); }

function setHeartbeat(fear) {
  clearInterval(heartTimer);
  if (fear >= 3) {
    const interval = 1500 - fear * 200;
    heartTimer = setInterval(thump, interval);
  }
}

/* ---------- 画面制御 ---------- */
function applyScene(sc) {
  stage.className = "bg-" + sc.bg + " fear" + (sc.fear || 0);
  figure.className = sc.fig ? "show" + (sc.eyes ? " eyes" : "") : "";
  fearFill.style.width = ((sc.fear || 0) * 20) + "%";
  setHeartbeat(sc.fear || 0);

  if (sc.fx === "shake") {
    stage.classList.add("shake");
    setTimeout(() => stage.classList.remove("shake"), 700);
  }
  if (sc.fx === "flash") {
    const f = $("flash");
    f.classList.remove("go"); void f.offsetWidth; f.classList.add("go");
  }
  if (sc.sfx) sfx(sc.sfx);
}

function goScene(id) {
  const sc = scenes[id];
  current = sc;
  choicesEl.innerHTML = "";
  applyScene(sc);
  pages = typeof sc.t === "function" ? sc.t() : sc.t;
  pageIdx = 0;
  textbox.classList.remove("hidden");
  showPage();
}

function showPage() {
  fullText = pages[pageIdx];
  textEl.textContent = "";
  nextMark.classList.add("off");
  typing = true;
  let i = 0;
  clearInterval(typeTimer);
  typeTimer = setInterval(() => {
    i++;
    textEl.textContent = fullText.slice(0, i);
    if (i >= fullText.length) finishTyping();
  }, 38);
}

function finishTyping() {
  clearInterval(typeTimer);
  typing = false;
  textEl.textContent = fullText;
  const last = pageIdx >= pages.length - 1;
  if (!last || current.next || current.end) {
    nextMark.classList.remove("off");
  }
  if (last && current.c) {
    nextMark.classList.add("off");
    showChoices(current.c);
  }
}

function advance() {
  if (!AC) initAudio();
  if (typing) { finishTyping(); return; }
  const last = pageIdx >= pages.length - 1;
  if (!last) { pageIdx++; showPage(); return; }
  if (current.c) return; // 選択肢待ち
  if (current.end) { showEnding(current.end); return; }
  if (current.next) goScene(current.next);
}

function showChoices(list) {
  choicesEl.innerHTML = "";
  list.forEach((ch, i) => {
    const b = document.createElement("button");
    b.textContent = ch.t;
    b.style.animationDelay = (i * 0.12) + "s";
    b.addEventListener("click", (e) => {
      e.stopPropagation();
      if (ch.hide) state.hide += ch.hide;
      if (ch.ev) state.evidence += ch.ev;
      if (ch.told) state.told = true;
      choicesEl.innerHTML = "";
      goScene(ch.to);
    });
    choicesEl.appendChild(b);
  });
}

function showEnding(end) {
  clearInterval(heartTimer);
  saveSeen(end.type);
  updateCounts();
  textbox.classList.add("hidden");
  choicesEl.innerHTML = "";
  const h = $("endTitle");
  h.textContent = end.title;
  h.className = end.type === "bad" ? "bad" : "happy";
  $("endSub").textContent = end.sub;
  $("endNote").innerHTML =
    "この物語はフィクションです。<br>" +
    "ストーカー被害に悩んだら、ひとりで抱え込まず相談してください。<br>" +
    "警察相談専用電話 <b>#9110</b> / 緊急時は <b>110</b>";
  $("ending").classList.remove("hidden");
  if (end.type === "bad") sfx("heart");
}

function startGame() {
  initAudio();
  state.hide = 0; state.evidence = 0; state.told = false;
  $("title").classList.add("hidden");
  $("ending").classList.add("hidden");
  goScene("intro");
}

/* ---------- イベント ---------- */
$("startBtn").addEventListener("click", startGame);
$("retryBtn").addEventListener("click", () => {
  $("ending").classList.add("hidden");
  $("title").classList.remove("hidden");
  stage.className = "bg-street";
  figure.className = "";
  fearFill.style.width = "0%";
  updateCounts();
});
textbox.addEventListener("click", advance);
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    if (!$("title").classList.contains("hidden") || !$("ending").classList.contains("hidden")) return;
    e.preventDefault();
    advance();
  }
});
$("soundBtn").addEventListener("click", (e) => {
  e.stopPropagation();
  soundOn = !soundOn;
  $("soundBtn").textContent = "音: " + (soundOn ? "ON" : "OFF");
  if (master) master.gain.value = soundOn ? 0.6 : 0;
  if (soundOn && !AC) initAudio();
});

updateCounts();
