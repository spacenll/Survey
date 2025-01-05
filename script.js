// إعدادات GitHub API
const GITHUB_API = {
    username: "spacenll", // ضع اسم المستخدم الخاص بك هنا
    repo: "survey-data", // اسم المستودع الذي تريد تخزين البيانات فيه
    token: "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", // ضع الـ Token الخاص بك هنا
    filePath: "results.json", // مسار ملف النتائج داخل المستودع
};

// جمع الإجابات
document.getElementById("survey-form").addEventListener("submit", async function (e) {
    e.preventDefault();

    // جمع الإجابات
    const answers = {};
    const questions = document.querySelectorAll(".question");
    questions.forEach((question, index) => {
        const answer = question.querySelector("input[type='radio']:checked");
        if (answer) {
            answers[`q${index + 1}`] = answer.value;
        }
    });

    // جلب البيانات الحالية من ملف JSON على GitHub
    let storedAnswers = await fetchGitHubFile();
    storedAnswers.push(answers);

    // رفع البيانات المحدثة إلى GitHub
    await updateGitHubFile(storedAnswers);

    // عرض رسالة تأكيد
    alert("شكرًا على تقييمك! تم تسجيل إجابتك.");
    window.location.href = "results.html";
});

// وظيفة لجلب محتوى الملف من GitHub
async function fetchGitHubFile() {
    try {
        const response = await fetch(
            `https://api.github.com/repos/${GITHUB_API.username}/${GITHUB_API.repo}/contents/${GITHUB_API.filePath}`,
            {
                headers: {
                    Authorization: `token ${GITHUB_API.token}`,
                },
            }
        );

        if (!response.ok) {
            throw new Error(`GitHub API returned an error: ${response.status} ${response.statusText}`);
        }

        const fileData = await response.json();
        const content = atob(fileData.content); // فك تشفير المحتوى (Base64)
        return JSON.parse(content); // تحويل النص إلى JSON
    } catch (error) {
        console.error("Error fetching GitHub file:", error);
        alert("حدث خطأ أثناء جلب البيانات. تفقد الكونسول لمزيد من التفاصيل.");
        return [];
    }
}


// وظيفة لتحديث الملف على GitHub
async function updateGitHubFile(newContent) {
    const fileResponse = await fetch(
        `https://api.github.com/repos/${GITHUB_API.username}/${GITHUB_API.repo}/contents/${GITHUB_API.filePath}`,
        {
            headers: {
                Authorization: `token ${GITHUB_API.token}`,
            },
        }
    );

    const fileData = await fileResponse.json();
    const updatedContent = btoa(JSON.stringify(newContent, null, 2)); // تحويل البيانات إلى Base64
    const response = await fetch(
        `https://api.github.com/repos/${GITHUB_API.username}/${GITHUB_API.repo}/contents/${GITHUB_API.filePath}`,
        {
            method: "PUT",
            headers: {
                Authorization: `token ${GITHUB_API.token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                message: "تحديث بيانات الاستبيان",
                content: updatedContent,
                sha: fileData.sha, // SHA الخاص بالملف الحالي
            }),
        }
    );

    if (!response.ok) {
        alert("حدث خطأ أثناء حفظ البيانات.");
        return;
    }

    alert("تم حفظ البيانات بنجاح.");
  window.location.href = "https://spacenll.github.io/home/"; // الانتقال إلى صفحة النتائج
}
