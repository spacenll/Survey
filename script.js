// ملف script.js
document.getElementById("survey-form").addEventListener("submit", function (e) {
    e.preventDefault(); // منع إعادة تحميل الصفحة

    // استخراج الإجابات
    const answers = {};
    const questions = document.querySelectorAll(".question");
    questions.forEach((question, index) => {
        const answer = question.querySelector("input[type='radio']:checked");
        if (answer) {
            answers[`q${index + 1}`] = answer.value;
        }
    });

    // حفظ البيانات إلى قاعدة بيانات أو عرضها
    console.log("الإجابات:", answers);
    alert("شكرًا على تقييمك! سنعمل على تحسين خدماتنا بناءً على ملاحظاتك.");
    // يمكنك إرسال البيانات إلى Firebase أو أي نظام تخزين آخر هنا.
});
