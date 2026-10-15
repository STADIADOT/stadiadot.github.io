// HTML에서 입력칸, 폼, 인사말을 찾아 변수에 담습니다.
const greetingForm = document.querySelector("#greeting-form");
const nameInput = document.querySelector("#name-input");
const greetingMessage = document.querySelector("#greeting-message");
const inputHint = document.querySelector("#input-hint");
const resetButton = document.querySelector("#reset-button");
const copyButton = document.querySelector("#copy-button");
const copyFeedback = document.querySelector("#copy-feedback");

// 스타일마다 사용할 인사말 문구를 준비합니다.
const greetingPhrases = {
  warm: [
    "{name}님, 반가워요! 오늘도 좋은 하루 보내세요.",
    "{name}님, 만나서 정말 반가워요. 마음 따뜻한 하루 보내세요!",
    "{name}님, 와 주셔서 고마워요. 기분 좋은 하루가 되길 바라요!",
  ],
  playful: [
    "{name}님 등장! 오늘 하루도 즐겁게 시작해 볼까요?",
    "짜잔, {name}님! 오늘은 좋은 일이 팡팡 생기길 바라요!",
    "{name}님, 어서 와요! 웃음 충전하고 신나게 보내요!",
  ],
  polite: [
    "{name}님, 만나 뵙게 되어 반갑습니다. 편안한 하루 보내시기 바랍니다.",
    "{name}님, 방문해 주셔서 감사합니다. 평안한 하루 보내십시오.",
    "{name}님, 반갑습니다. 뜻깊고 기분 좋은 하루가 되시길 바랍니다.",
  ],
};

// 각 스타일에서 아직 사용하지 않은 문구를 기억합니다.
const usedPhrases = {
  warm: new Set(),
  playful: new Set(),
  polite: new Set(),
};
const lastPhrases = {
  warm: "",
  playful: "",
  polite: "",
};

// 폼이 제출될 때(버튼 클릭 또는 Enter 키) 실행할 동작을 정합니다.
greetingForm.addEventListener("submit", (event) => {
  // 페이지가 새로고침되는 기본 동작을 막습니다.
  event.preventDefault();

  // 앞뒤 공백을 지워 이름만 남깁니다.
  const name = nameInput.value.trim();

  // 이름이 비어 있으면 입력칸으로 안내하고 멈춥니다.
  if (name === "") {
    greetingMessage.textContent = "이름을 먼저 입력해 주세요.";
    inputHint.textContent = "이름을 입력하면 인사말을 보여 드릴게요.";
    copyButton.disabled = true;
    copyFeedback.textContent = "";
    nameInput.focus();
    return;
  }

  // 선택한 스타일에 맞는 인사말을 골라 화면에 표시합니다.
  const selectedStyle = document.querySelector('input[name="greeting-style"]:checked').value;
  greetingMessage.textContent = makeGreeting(selectedStyle, name);
  inputHint.textContent = "다른 이름을 입력해도 좋아요.";
  copyButton.disabled = false;
  copyFeedback.textContent = "";
});

// 다시 시작 버튼을 누르면 페이지를 처음 상태로 되돌립니다.
resetButton.addEventListener("click", () => {
  nameInput.value = "";
  document.querySelector("#style-warm").checked = true;
  greetingMessage.textContent = "";
  inputHint.textContent = "이름을 입력하고 버튼을 눌러 보세요.";
  copyButton.disabled = true;
  copyFeedback.textContent = "";
  nameInput.focus();
});

// 같은 스타일의 문구를 무작위로 고릅니다. 세 문구를 모두 쓰면 다시 섞어 사용합니다.
function makeGreeting(style, name) {
  const phrases = greetingPhrases[style];
  let unusedPhrases = phrases.filter((phrase) => !usedPhrases[style].has(phrase));

  if (unusedPhrases.length === 0) {
    usedPhrases[style].clear();
    unusedPhrases = phrases.filter((phrase) => phrase !== lastPhrases[style]);
  }

  const randomIndex = Math.floor(Math.random() * unusedPhrases.length);
  const phrase = unusedPhrases[randomIndex];
  usedPhrases[style].add(phrase);
  lastPhrases[style] = phrase;

  return phrase.replace("{name}", name);
}

// 복사 버튼을 누르면 현재 인사말을 클립보드에 복사합니다.
copyButton.addEventListener("click", async () => {
  const greeting = greetingMessage.textContent.trim();

  if (greeting === "") {
    copyFeedback.textContent = "복사할 인사말이 없어요.";
    copyButton.disabled = true;
    return;
  }

  const copied = await copyText(greeting);
  copyFeedback.textContent = copied
    ? "복사했습니다!"
    : "복사하지 못했어요. 인사말을 직접 복사해 주세요.";
});

// 최신 복사 기능을 먼저 쓰고, 실패하면 다른 방법을 시도합니다.
async function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // 권한이나 브라우저 제한으로 실패하면 아래 대체 방법을 시도합니다.
    }
  }

  const temporaryInput = document.createElement("textarea");
  temporaryInput.value = text;
  temporaryInput.setAttribute("readonly", "");
  temporaryInput.style.position = "fixed";
  temporaryInput.style.left = "-9999px";
  document.body.appendChild(temporaryInput);
  temporaryInput.focus();
  temporaryInput.select();
  temporaryInput.setSelectionRange(0, text.length);

  let copied = false;
  try {
    copied = document.execCommand("copy");
  } catch {
    copied = false;
  }

  temporaryInput.remove();
  return copied;
}
