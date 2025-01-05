// استرجاع الإجابات من LocalStorage
const storedAnswers = JSON.parse(localStorage.getItem("surveyResults")) || [];

// حساب نسب الإجابات لكل سؤال
const questionCount = 5; // عدد الأسئلة
const results = Array(questionCount).fill(null).map(() => ({
    ممتاز: 0,
    متوسط: 0,
    جيد: 0,
}));

storedAnswers.forEach((answers) => {
    Object.keys(answers).forEach((key, index) => {
        const answer = answers[key];
        results[index][answer]++;
    });
});

// تحويل النتائج إلى نسب مئوية
const percentages = results.map((question) => {
    const total = question.ممتاز + question.متوسط + question.جيد;
    return {
        ممتاز: ((question.ممتاز / total) * 100).toFixed(1),
        متوسط: ((question.متوسط / total) * 100).toFixed(1),
        جيد: ((question.جيد / total) * 100).toFixed(1),
    };
});

// رسم النتائج باستخدام Chart.js
const ctx = document.getElementById("resultsChart").getContext("2d");
const chartData = {
    labels: ["ممتاز", "متوسط", "جيد"],
    datasets: percentages.map((question, index) => ({
        label: `السؤال ${index + 1}`,
        data: [question.ممتاز, question.متوسط, question.جيد],
        backgroundColor: ["#4CAF50", "#FFC107", "#F44336"],
    })),
};

new Chart(ctx, {
    type: "doughnut", // مخطط دائري
    data: {
        labels: chartData.labels,
        datasets: chartData.datasets,
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: "top",
            },
        },
    },
});
