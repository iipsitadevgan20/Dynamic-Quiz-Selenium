/***********************
 * QUIZ DATA
 ***********************/
const quizData = {
	easy: [
	  {
		question: "What is JavaScript?",
		options: ["Database", "Programming Language", "Browser", "Server"],
		answer: "Programming Language"
	  },
	  {
		question: "Which symbol is used for comments?",
		options: ["##", "**", "//", "<!-- -->"],
		answer: "//"
	  },
	  {
		question: "JavaScript runs primarily on?",
		options: ["Server", "Browser", "Database", "Compiler"],
		answer: "Browser"
	  }
	],
	medium: [
	  {
		question: "Which keyword declares a variable?",
		options: ["loop", "int", "var", "define"],
		answer: "var"
	  },
	  {
		question: "Which method converts JSON to object?",
		options: ["parse()", "stringify()", "convert()", "map()"],
		answer: "parse()"
	  },
	  {
		question: "Which keyword stops a loop?",
		options: ["stop", "exit", "break", "end"],
		answer: "break"
	  }
	],
	hard: [
	  {
		question: "Which scope is created by let?",
		options: ["Global", "Block", "Function", "Script"],
		answer: "Block"
	  },
	  {
		question: "What does NaN stand for?",
		options: ["Not a Node", "Not a Number", "New and Null", "No assigned Name"],
		answer: "Not a Number"
	  },
	  {
		question: "Which operator checks value and type?",
		options: ["==", "!=", "=", "==="],
		answer: "==="
	  }
	]
  };
  
  let quiz = [];
  let currentIndex = 0;
  let score = 0;
  let timer = 10;
  let interval = null;
  let timeSpent = [];
  
  /***********************
   * START QUIZ
   ***********************/
  function startQuiz() {
	const difficulty = document.querySelector(
	  'input[name="difficulty"]:checked'
	).value;
  
	quiz = quizData[difficulty];
	currentIndex = 0;
	score = 0;
	timeSpent = [];
  
	document.getElementById("start-screen").classList.add("hidden");
	document.getElementById("quiz-container").classList.remove("hidden");
  
	loadQuestion();
  }
  
  /***********************
   * LOAD QUESTION
   ***********************/
  function loadQuestion() {
	clearInterval(interval);
  
	timer = 10;
	document.getElementById("timer").innerText = `Time Left: ${timer}s`;
	document.getElementById("nextBtn").disabled = true;
  
	interval = setInterval(() => {
	  timer--;
	  document.getElementById("timer").innerText = `Time Left: ${timer}s`;
	  if (timer === 0) {
		clearInterval(interval);
	  }
	}, 1000);
  
	const q = quiz[currentIndex];
	document.getElementById("question").innerText = q.question;
  
	const optionsDiv = document.getElementById("options");
	optionsDiv.innerHTML = "";
  
	q.options.forEach(opt => {
	  optionsDiv.innerHTML += `
		<label>
		  <input type="radio" name="option" value="${opt}">
		  ${opt}
		</label>
	  `;
	});
  
	document.querySelectorAll('input[name="option"]').forEach(radio => {
	  radio.addEventListener("change", () => {
		document.getElementById("nextBtn").disabled = false;
	  });
	});
  }
  
  /***********************
   * NEXT QUESTION
   ***********************/
  function nextQuestion() {
	clearInterval(interval);
  
	timeSpent.push(10 - timer);
  
	const selected = document.querySelector('input[name="option"]:checked');
	if (selected && selected.value === quiz[currentIndex].answer) {
	  score++;
	}
  
	currentIndex++;
  
	if (currentIndex < quiz.length) {
	  loadQuestion();
	} else {
	  showResult();
	}
  }
  
  /***********************
   * RESULT + CHARTS
   ***********************/
  function showResult() {
	document.getElementById("quiz-container").classList.add("hidden");
  
	const percentage = Math.round((score / quiz.length) * 100);
  
	document.getElementById("result").innerHTML = `
	  <h3>Quiz Completed</h3>
	  <p>Total Score: ${score}/${quiz.length}</p>
	  <p>Correct Answers: ${score}</p>
	  <p>Incorrect Answers: ${quiz.length - score}</p>
	  <p><b>Overall Performance:</b> ${percentage}%</p>
  
	  <div class="chart-row">
		<div class="chart-box">
		  <canvas id="resultChart"></canvas>
		</div>
		<div class="chart-box">
		  <canvas id="timeChart"></canvas>
		</div>
	  </div>
	`;
  
	document.getElementById("result").classList.remove("hidden");
  
	drawCharts(score, quiz.length - score, timeSpent);
  }
  
  /***********************
   * DRAW CHARTS (FIXED)
   ***********************/
  function drawCharts(correct, incorrect, timeSpent) {
  
	new Chart(document.getElementById("resultChart"), {
	  type: "pie",
	  data: {
		labels: ["Correct", "Incorrect"],
		datasets: [{
		  data: [correct, incorrect],
		  backgroundColor: ["#00b894", "#d63031"]
		}]
	  },
	  options: {
		responsive: true,
		maintainAspectRatio: false
	  }
	});
  
	new Chart(document.getElementById("timeChart"), {
	  type: "bar",
	  data: {
		labels: timeSpent.map((_, i) => `Q${i + 1}`),
		datasets: [{
		  label: "Time Spent (seconds)",
		  data: timeSpent,
		  backgroundColor: "#6c5ce7"
		}]
	  },
	  options: {
		responsive: true,
		maintainAspectRatio: false,
		scales: {
		  y: {
			beginAtZero: true
		  }
		}
	  }
	});
  }
  