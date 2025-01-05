document.getElementById("survey-form").addEventListener("submit", function (e) {
    e.preventDefault();

    const answers = {};
    const questions = document.querySelectorAll(".question");
    questions.forEach((question, index) => {
        const answer = question.querySelector("input[type='radio']:checked");
        if (answer) {
            answers[`q${index + 1}`] = answer.value;
        }
    });

    // حفظ الإجابات في LocalStorage
    let storedAnswers = JSON.parse(localStorage.getItem("surveyResults")) || [];
    storedAnswers.push(answers);
    localStorage.setItem("surveyResults", JSON.stringify(storedAnswers));

    alert("شكرًا على تقييمك! يمكنك الآن رؤية النتائج.");
    window.location.href = "https://spacenll.github.io/home/"; // الانتقال إلى صفحة النتائج
});
