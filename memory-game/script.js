window.onload = () => {
  const bestScore = localStorage.getItem("bestScore");
  if (bestScore) {
    document.getElementById("bestScore").textContent = `ベストタイム: ${bestScore}秒`;
  } else {
    document.getElementById("bestScore").textContent = "ベストタイム: -- 秒";
  }
};

const cardData = [
  { name: "A", file: "ace_of_spades.png" },
  { name: "K", file: "king_of_hearts.png" },
  { name: "Q", file: "queen_of_clubs.png" },
  { name: "J", file: "jack_of_diamonds.png" },
  { name: "10", file: "10_of_hearts.png" },
  { name: "9", file: "9_of_spades.png" },
  { name: "8", file: "8_of_clubs.png" },
  { name: "7", file: "7_of_diamonds.png" },
];

let cards = [];
let revealed = [];
let matched = 0;
let startTime, timerInterval;

const gameEl = document.getElementById("game");
const timerEl = document.getElementById("timer");

// ゲームの開始
function startGame() {
  gameEl.innerHTML = "";
  timerEl.textContent = "0.0";
  clearInterval(timerInterval);
  matched = 0;
  revealed = [];

  const deck = shuffle([...cardData, ...cardData]);
  cards = deck.map((card, index) => ({
    ...card,
    id: index,
    matched: false,
  }));

  cards.forEach((card, i) => {
    const cardDiv = document.createElement("div");
    cardDiv.className = "card";
    cardDiv.dataset.index = i;

    const img = document.createElement("img");
    img.src = "cards/back.png";
    cardDiv.appendChild(img);

    cardDiv.addEventListener("click", () => revealCard(i));
    gameEl.appendChild(cardDiv);
  });

  startTime = Date.now();
  timerInterval = setInterval(() => {
    timerEl.textContent = ((Date.now() - startTime) / 1000).toFixed(1);
  }, 100);
}

// カードを裏返す
function revealCard(index) {
  if (revealed.length === 2 || cards[index].matched) return;

  const cardEl = gameEl.children[index];
  const img = cardEl.querySelector("img");
  img.src = "cards/" + cards[index].file;

  revealed.push(index);

  if (revealed.length === 2) {
    const [i1, i2] = revealed;
    if (cards[i1].name === cards[i2].name) {
      cards[i1].matched = cards[i2].matched = true;
      matched++;
      revealed = [];
      if (matched === cardData.length) {
        clearInterval(timerInterval);
        const finalTime = (Date.now() - startTime) / 1000;
        setTimeout(() => {
          alert(`クリア！タイム：${finalTime.toFixed(1)}秒`);
          checkBestScore(finalTime);  // ベストスコアチェック
        }, 300);
      }
    } else {
      setTimeout(() => {
        gameEl.children[i1].querySelector("img").src = "cards/back.png";
        gameEl.children[i2].querySelector("img").src = "cards/back.png";
        revealed = [];
      }, 800);
    }
  }
}

// ベストスコアを記録
function checkBestScore(finalTime) {
  const bestScore = localStorage.getItem("bestScore");
  if (!bestScore || finalTime < bestScore) {
    localStorage.setItem("bestScore", finalTime.toFixed(1));
    document.getElementById("bestScore").textContent = `ベストタイム: ${finalTime.toFixed(1)}秒`;
  }
}

// シャッフル関数
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
