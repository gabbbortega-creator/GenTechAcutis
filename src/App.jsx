import './App.css'
import { useEffect, useState } from 'react';
import { useRef } from 'react';

import ContentComponent from './components/contentComponent';
import Timeline from './components/timeline';
import Gallery from './components/gallery';

const currentYear = new Date().getFullYear();

function App() {
  const [scrolled, setScrolled] = useState(false);
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const canvas = document.getElementById("gameCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let basketX = canvas.width / 2 - 40;
    const basketWidth = 80;
    const basketHeight = 20;
    const basketSpeed = 4;

    let light = { x: Math.random() * (canvas.width - 30), y: 0, size: 30 };
    let score = 0;
    let gameInterval;
    let gameRunning = false;

    let moveLeft = false;
    let moveRight = false;

    function drawBasket() {
      ctx.fillStyle = "#1e3a8a";
      ctx.fillRect(basketX, canvas.height - basketHeight - 10, basketWidth, basketHeight);
    }

    function drawLight() {
      ctx.fillStyle = "#fbbf24";
      ctx.shadowColor = "#fbbf24";
      ctx.shadowBlur = 20;
      ctx.fillRect(light.x, light.y, light.size, light.size);
      ctx.shadowBlur = 0;
    }

    function updateLight() {
      light.y += 1.2;
      if (light.y > canvas.height) resetLight();

      if (
        light.y + light.size > canvas.height - basketHeight - 10 &&
        light.x + light.size > basketX &&
        light.x < basketX + basketWidth
      ) {
        score++;
        resetLight();
      }
    }

    function resetLight() {
      light.x = Math.random() * (canvas.width - light.size);
      light.y = 0;
    }

    function updateBasket() {
      if (moveLeft && basketX > 0) basketX -= basketSpeed;
      if (moveRight && basketX + basketWidth < canvas.width) basketX += basketSpeed;
    }

    function drawScore() {
      ctx.fillStyle = "#1e3a8a";
      ctx.font = "16px Poppins";
      ctx.fillText("Score: " + score, 10, 20);
    }

    function gameLoop() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawBasket();
      drawLight();
      drawScore();
      updateBasket();
      updateLight();
    }

    window.startGame = function () {
      if (!gameRunning) {
        gameInterval = setInterval(gameLoop, 20);
        gameRunning = true;
      }
    };

    window.pauseGame = function () {
      clearInterval(gameInterval);
      gameRunning = false;
    };

    window.moveBasket = function (direction) {
      if (direction === "left") moveLeft = true;
      if (direction === "right") moveRight = true;
    };

    window.stopBasket = function (direction) {
      if (direction === "left") moveLeft = false;
      if (direction === "right") moveRight = false;
    };

    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") window.moveBasket("left");
      if (e.key === "ArrowRight") window.moveBasket("right");
    });

    document.addEventListener("keyup", (e) => {
      if (e.key === "ArrowLeft") window.stopBasket("left");
      if (e.key === "ArrowRight") window.stopBasket("right");
    });

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    return () => {
      clearInterval(gameInterval);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  useEffect(() => {
    const quizData = [
      { question: "Where was Carlo Acutis born?", options: ["London", "Milan", "Rome", "Assisi"], answer: "London" },
      { question: "What was Carlo Acutis known for?", options: ["Sports", "Computers", "Music", "Medicine"], answer: "Computers" },
      { question: "In what year was Carlo Acutis beatified?", options: ["2018", "2019", "2020", "2021"], answer: "2020" }
    ];

    let currentQuestion = 0;
    let points = 0;

    const questionEl = document.getElementById("question");
    const optionsEl = document.getElementById("options");
    const resultEl = document.getElementById("result");
    const pointsEl = document.getElementById("points");
    const playAgainBtn = document.getElementById("play-again");

    function loadQuestion() {
      const q = quizData[currentQuestion];
      questionEl.textContent = q.question;
      optionsEl.innerHTML = "";
      resultEl.textContent = "";

      q.options.forEach(option => {
        const btn = document.createElement("button");
        btn.textContent = option;
        btn.className = "bg-white text-[#1e3b8a] border border-[#1e3b8a] rounded-full px-4 py-2 hover:bg-[#1e3b8a] hover:text-white transition";
        btn.onclick = () => checkAnswer(option);
        optionsEl.appendChild(btn);
      });

      pointsEl.textContent = "Points: " + points + "/" + quizData.length;
    }

    function checkAnswer(answer) {
      if (answer === quizData[currentQuestion].answer) {
        resultEl.textContent = "Correct!";
        // resultEl.style.backgroundColor = "#fbcf5f";
        resultEl.style.color = "#fbcf5f";
        // resultEl.style.padding = "6px 12px";
        // resultEl.style.borderRadius = "6px";
        points++;
      } else {
        resultEl.textContent = "Wrong! The correct answer is " + quizData[currentQuestion].answer;
        // resultEl.style.backgroundColor = "red";
        resultEl.style.color = "red";
        // resultEl.style.padding = "6px 12px";
        // resultEl.style.borderRadius = "6px";
      }

      pointsEl.textContent = "Points: " + points + "/" + quizData.length;

      const buttons = document.querySelectorAll("#options button");
      buttons.forEach(btn => btn.disabled = true);

      setTimeout(() => {
        currentQuestion++;
        if (currentQuestion < quizData.length) {
          loadQuestion();
        } else {
          finishQuiz();
        }
      }, 1000);
    }

    function finishQuiz() {
      questionEl.textContent = "Quiz Finished!";
      optionsEl.innerHTML = "";
      resultEl.textContent = "Your total points: " + points + "/" + quizData.length;
      pointsEl.textContent = "";
      playAgainBtn.style.display = "inline-block";
    }

    function restartQuiz() {
      currentQuestion = 0;
      points = 0;
      playAgainBtn.style.display = "none";
      loadQuestion();
    }

    if (playAgainBtn) {
      playAgainBtn.onclick = restartQuiz;
    }

    if (questionEl) {
      loadQuestion();
    }
  }, []);

  return (
    <>
      {/*  navbar */}
      <nav className={`${scrolled ? 'bg-[#1e3b8a] shadow-md text-white sticky top-0' : 'absolute top-0 text-white'} w-full z-50 px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row justify-center items-center text-sm font-medium transition-all duration-300`}>
        <ul className="flex flex-wrap justify-center gap-2 sm:gap-4 text-center w-full">
          {[
            { label: "Life", id: "life" },
            { label: "Gallery", id: "gallery" },
            { label: "Miracles", id: "miracle" },
            { label: "Education", id: "education" },
            { label: "Technology", id: "tech" },
            { label: "Game", id: "game" },
            { label: "Quiz", id: "quiz" },
            { label: "Music Video", id: "music-video" },
            { label: isPlaying ? "Pause Music" : "Play Music", id: "music-toggle", isButton: true }
          ].map(({ label, id, isButton }) => (
            <li key={label}>
              {isButton ? (
                <button
                  onClick={toggleMusic}
                  className="text-xs px-3 py-1 border border-white rounded-full hover:bg-white hover:text-[#1e3b8a] transition"
                >
                  {label}
                </button>
              ) : (
                <a href={`#${id}`} className="px-2 py-1 sm:px-3 hover:underline underline-offset-4">{label}</a>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* image header */}
      <header className="relative z-10 h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] xl:h-[700px] w-full overflow-hidden">
        <img
          src="./assets/carloo.jpg"
          alt="Carlo Acutis Header"
          className="absolute inset-0 w-full h-full object-cover brightness-50"
        />

        {/* Content Container */}
        <div className="absolute inset-0 flex flex-col justify-center px-4 sm:px-8 py-10 sm:py-20 md:py-24 lg:py-28 text-white">
          {/* Top Section: CHANGE */}
          <div className="text-center">
            <p className="inline-block text-xs sm:text-sm md:text-base border border-white rounded-full px-3 py-1 drop-shadow-md">
              C.H.A.N.G.E.
            </p>
            <p className="mt-2 text-[10px] sm:text-xs md:text-sm lg:text-base drop-shadow-md">
              Character Formation, Heroism, Advancement in Technology<br />
              Nature Protection and Sustainability, God-Centeredness, Education
            </p>
          </div>

          {/* Center Section: Title and Subtitle */}
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight drop-shadow-md">
              St. Carlo Acutis
            </h1>
            <p className="text-sm sm:text-base md:text-lg drop-shadow-md mt-2">
              "The Cyber Apostle of the Holy Eucharist"
            </p>
          </div>
        </div>
      </header>

      {/* component - life */}
      <div id="life" className="bg-[#f9fafb] w-full text-[#1e3b8a]">
        <ContentComponent section="life"/>
        <Timeline/>
      </div>

      {/* component - gallery */}
      <div id="gallery" className="w-full">
          <Gallery/>
      </div>

      {/* component - miracle */}
      <div id="miracle" className="bg-[#f9fafb] w-full text-[#1e3b8a]">
        <ContentComponent section="miracle"/>
      </div>

      {/* component - education */}
      <div id="education" className="w-full text-[#1e3b8a]">
        <ContentComponent section="education"/>
      </div>

      {/* component - tech */}
      <div id="tech" className="bg-[#f9fafb] w-full text-[#1e3b8a] pb-10">
        <ContentComponent section="tech"/>
        {/* others */}
        <div className="container py-3">
          <p className="text-lg mb-3">Facebook Pages</p>
          <p className="text-gray-700">This gallery highlights Facebook pages dedicated to St. Carlo Acutis, serving as digital spaces where people share prayers, stories, and inspirations from his life. These pages connect devotees worldwide, continuing Carlo’s mission of using technology to spread faith.</p>
          <div className="py-3 my-5">
            <div className='container w-full'>
              <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 gap-4">
                <a href="https://www.facebook.com/fsca.ph" className="grid gap-4" target="_blank" rel="noopener noreferrer">
                  <div><img className="w-full h-40 object-cover rounded-lg" src="../assets/FBPAGE1.png" alt="Friends of Blessed Carlo Acutis"/>
                    <p className="mt-3">Friends of Blessed Carlo Acutis</p>
                  </div>
                </a>
                <a href="#" className="grid gap-4" target="_blank" rel="noopener noreferrer">
                  <div><img className="w-full h-40 object-cover rounded-lg" src="../assets/FBPAGE2.png" alt="Blessed Carlo Acutis, Pray for Us"/>
                    <p className="mt-3">Blessed Carlo Acutis, Pray for Us</p>
                  </div>
                </a>
                <a href="#" className="grid gap-4" target="_blank" rel="noopener noreferrer">
                  <div><img className="w-full h-40 object-cover rounded-lg" src="../assets/FBPAGE3.png" alt="Friends of St. Carlo Acutis"/>
                    <p className="mt-3">Friends of St. Carlo Acutis</p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* component - game */}
      <div id="game" className="w-full py-16">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            <div className="flex flex-col justify-center">
              <p className="text-4xl mb-6 text-[#1e3b8a]">Mini-Game: Catch the Light</p>
              <div className="text-[#1e3b8a] space-y-4 text-base leading-relaxed">
                <p>Carlo often spoke of the Eucharist as his "highway to heaven," and he used his talents with technology to share the light of Christ with others. This game symbolizes catching the light of faith, just as Carlo invited people to embrace the light of God in their lives.</p>
                <p className="text-gray-700 text-sm opacity-75"><strong>How to Play:</strong> Move the basket left and right to catch the glowing lights before they fall. Each light you catch gives you points. Try to catch as many as you can!</p>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center">
              <canvas id="gameCanvas" className="w-full h-[300px] md:h-[400px] lg:h-[500px] border border-[#1e3b8a] rounded shadow-md"></canvas>
              <div id="game-controls" className="flex flex-wrap gap-4 mt-6 justify-center">
                <button
                  onMouseDown={() => window.moveBasket('left')}
                  onMouseUp={() => window.stopBasket('left')}
                  onMouseLeave={() => window.stopBasket('left')}
                  className="bg-[#1e3b8a] rounded-full text-white px-4 py-2"
                  aria-label="Move Left"
                >
                  ⬅ Left
                </button>
                <button
                  onMouseDown={() => window.moveBasket('right')}
                  onMouseUp={() => window.stopBasket('right')}
                  onMouseLeave={() => window.stopBasket('right')}
                  className="bg-[#1e3b8a] rounded-full text-white px-4 py-2"
                  aria-label="Move Right"
                >
                  Right ➡
                </button>
                <button
                  onClick={() => window.startGame()}
                  className="bg-green-600 rounded-full text-white px-4 py-2"
                  aria-label="Start Game"
                >
                  ▶ Start
                </button>
                <button
                  onClick={() => window.pauseGame()}
                  className="bg-red-600 rounded-full text-white px-4 py-2"
                  aria-label="Pause Game"
                >
                  ⏸ Pause
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* component - quiz */}
      <div id="quiz" className="bg-[#f9fafb] w-full py-16">
        <div className="container">
          <p className="text-4xl mb-8 text-[#1e3b8a]">Quiz about Carlo Acutis</p>
          <div id="quiz-container" className="text-[#1e3b8a] space-y-4">
            <p id="question" className="text-xl font-semibold">Loading question...</p>
            <div id="options" className="flex flex-wrap gap-4"></div>
            <div id="result" className="text-sm font-medium"></div>
            <p id="points" className="text-sm font-semibold mt-3"></p>
            <button id="play-again" style={{ display: "none" }} className="bg-[#1e3b8a] text-white px-4 py-2 rounded">Play Again</button>
          </div>
        </div>
      </div>

      {/* component - MV */}
      <div id="music-video" className="w-full py-16">
        <div className="py-2 mb-12 text-[#1e3b8a] container">
          <p className="text-4xl mb-8">Not Me But God Music Video</p>
          <p className="space-y-4 text-lg text-gray-700 space-x-5">As Blessed Carlo Acutis once said, “Non io, ma Dio” — translated as “Not Me, but God.” This profound statement reflects his belief that all things are made possible not through self-esteem, but through the glory of God. Inspired by this spiritual faith, Mr. Michael S. Yanga, the President of Dr. Yanga’s Colleges, Inc. (DYCI) composed a song entitled “Not Me, But God” dedicated to St. Carlo Acutis. The song features the words “Essere sempre unito a Gesù, ecco il mio programma di vita” which means “To always be close to Jesus, that's my life plan” — another expression of Carlo’s deep devotion spoken during his lifetime.</p>
        </div>
        <div className="container pt-8">
          <video className="rounded-lg w-full h-auto max-w-full" controls src="../assets/Not me, but God (Music Video).mp4" type="video/mp4">
          Your browser does not support the video tag.
          </video>
          <p className="text-xs text-gray-700 mt-4 opacity-50">Song associated with Carlo Acutis: Not Me But God | Lyrics by: Mr. Michael S. Yanga | Performed by: Ms. Wynona Guison | Video by: The DYCI CREATIVES Team</p>
        </div>
      </div>

      {/* footer */}
      <footer className="w-full bg-[#1e3b8a] text-white px-6 py-12 sm:py-16 text-sm">
        <div className="flex flex-col items-center justify-center text-center space-y-2 sm:space-y-3">
          <p className="text-lg font-light">© {currentYear} | Dedicated to Blessed Carlo Acutis</p>
          <div className="text-xs opacity-65">
            <p className="mb-1">Created by the following students of DYCI:</p>
            <p>Mr. Gabriel Ortega – 12-Del Mundo</p>
            <p>Mr. Mikel De Jesus – 12-Aquino</p>
            <p>Ms. Trinity Bautista – 11-Acutis</p>
          </div>
        </div>
      </footer>
      <audio ref={audioRef} loop>
        <source src="../assets/Not me, but God (Music Video).mp4" type="audio/mp4" />
        Your browser does not support the audio element.
      </audio>
    </>
  )
}

export default App
