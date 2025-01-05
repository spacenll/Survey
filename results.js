// جلب البيانات من GitHub
async function fetchSurveyData() {
    const response = await fetch(
        `https://api.github.com/repos/${GITHUB_API.username}/${GITHUB_API.repo}/contents/${GITHUB_API.filePath}`,
        {
            headers: {
                Authorization: `token ${GITHUB_API.token}`,
            },
        }
    );

    if (!response.ok) {
        alert("حدث خطأ أثناء جلب البيانات.");
        return [];
    }

    const fileData = await response.json();
    const content = atob(fileData.content); // فك تشفير المحتوى
    return JSON.parse(content);
}

// عرض عدد المشاركين والنتائج
async function displayResults() {
    const data = await fetchSurveyData();

    // حساب عدد المشاركين
    const participantCount = data.length;
    document.getElementById("participant-count").textContent = `عدد المشاركين: ${participantCount}`;

    // عرض النسب المئوية
    const results = calculatePercentages(data);
    drawChart(results);
}

// حساب النسب المئوية لكل خيار
function calculatePercentages(data) {
    const questionCount = 5;
    const results = Array(questionCount).fill(null).map(() => ({
        ممتاز: 0,
        متوسط: 0,
        جيد: 0,
    }));

    data.forEach((answers) => {
        Object.keys(answers).forEach((key, index) => {
            const answer = answers[key];
            results[index][answer]++;
        });
    });

    return results.map((question) => {
        const total = question.ممتاز + question.متوسط + question.جيد;
        return {
            ممتاز: ((question.ممتاز / total) * 100).toFixed(1),
            متوسط: ((question.متوسط / total) * 100).toFixed(1),
            جيد: ((question.جيد / total) * 100).toFixed(1),
        };
    });
}

// رسم المخطط الدائري (Chart.js)
function drawChart(percentages) {
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
        type: "doughnut",
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
}

// استدعاء الوظائف
displayResults();
