// إعدادات المستخدم الخاصة بـ GitHub
const username = "spacenll";  // اسم المستخدم الخاص بك
const repo = "survey-data";   // اسم المستودع
const token = "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"; // الـ Token الخاص بك
const filePath = "results.json"; // مسار الملف الذي يحتوي على البيانات في المستودع

// طلب البيانات من GitHub API
fetch(`https://api.github.com/repos/${username}/${repo}/contents/${filePath}`, {
    headers: {
        Authorization: `token ${token}`,
    },
})
.then((response) => {
    if (!response.ok) {
        throw new Error(`GitHub API Error: ${response.status} ${response.statusText}`);
    }
    return response.json();  // تحويل البيانات المسترجعة إلى JSON
})
.then((data) => {
    const fileContent = atob(data.content); // فك تشفير البيانات المشفرة (Base64)
    const jsonData = JSON.parse(fileContent); // تحويل النص إلى JSON
    console.log("File content:", jsonData);  // طباعة محتوى البيانات في الكونسول
})
.catch((error) => {
    console.error("Error:", error); // التعامل مع الأخطاء
});

// جمع الإجابات عند إرسال الاستبيان
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
    window.location.href = "results.html"; // يمكنك تعديل الرابط بناءً على مكان صفحة النتائج لديك
});

// وظيفة لجلب محتوى الملف من GitHub
async function fetchGitHubFile() {
    try {
        const response = await fetch(
            `https://api.github.com/repos/${username}/${repo}/contents/${filePath}`,
            {
                headers: {
                    Authorization: `token ${token}`,
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
    try {
        // جلب معلومات الملف الحالي من GitHub
        const fileResponse = await fetch(
            `https://api.github.com/repos/${username}/${repo}/contents/${filePath}`,
            {
                headers: {
                    Authorization: `token ${token}`,
                },
            }
        );

        const fileData = await fileResponse.json();

        // تحويل البيانات الجديدة إلى Base64
        const updatedContent = btoa(JSON.stringify(newContent, null, 2)); 

        // رفع البيانات المحدثة إلى GitHub
        const response = await fetch(
            `https://api.github.com/repos/${username}/${repo}/contents/${filePath}`,
            {
                method: "PUT",
                headers: {
                    Authorization: `token ${token}`,
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
            throw new Error(`Failed to update file on GitHub: ${response.status} ${response.statusText}`);
        }

        alert("تم حفظ البيانات بنجاح.");
        window.location.href = "https://spacenll.github.io/home/"; // الانتقال إلى صفحة النتائج
    } catch (error) {
        console.error("Error updating GitHub file:", error);
        alert("حدث خطأ أثناء حفظ البيانات.");
    }
}
