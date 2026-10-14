// HTML에서 입력칸, 폼, 인사말을 찾아 변수에 담습니다.
const greetingForm = document.querySelector("#greeting-form");
const nameInput = document.querySelector("#name-input");
const greetingMessage = document.querySelector("#greeting-message");
const inputHint = document.querySelector("#input-hint");

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
    nameInput.focus();
    return;
  }

  // 입력한 이름으로 인사말을 만들고 화면에 표시합니다.
  greetingMessage.textContent = `${name}님, 반가워요! 오늘도 좋은 하루 보내세요.`;
  inputHint.textContent = "다른 이름을 입력해도 좋아요.";
});
