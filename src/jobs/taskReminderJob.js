const cron = require("node-cron");
const nodemailer = require("nodemailer");
const { Op } = require("sequelize");
const {UserEntity,TaskEntity} = require("../model")

// ✅ Configure Email Transporter
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST, // e.g., smtp.gmail.com
    port: process.env.SMTP_PORT, // Usually 587 for TLS or 465 for SSL
    secure: false, // Use TLS or not
    auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASS, // Your password or app password
    },
});

// ✅ Schedule the cron job to run daily at 11:43 AM
cron.schedule("05 12 * * *", async () => {
    console.log("🕒 Running task reminder job at 11:43 AM...");

    try {
        const today = new Date().toISOString().split("T")[0]; // Get current date (YYYY-MM-DD)

        // ✅ Fetch expired and incomplete tasks
        const expiredTasks = await TaskEntity.findAll({
            where: {
                completion_date: { [Op.lt]: today }, // Tasks that are past due
                is_completed: false, // Task is still pending
            },
            include: {
                model: UserEntity, // Fetch associated user details
                attributes: ["email_id", "user_name"], // Select only necessary fields
            },
        });

        if (expiredTasks.length === 0) {
            console.log("✅ No overdue tasks found.");
            return;
        }

        // ✅ Loop through each expired task and send a reminder email
        for (const task of expiredTasks) {
            const user = task.UserEntity;

            if (user && user.email_id) {
                // ✅ Define email content
                const mailOptions = {
                    from: process.env.EMAIL_USER,
                    to: user.email_id,
                    subject: "⚠️ Task Overdue Reminder",
                    text: `Hello ${user.user_name},\n\nYour task "${task.task_description}" was due on ${task.completion_date.toDateString()} but is still incomplete.\n\nPlease take necessary action.\n\nThanks!`,
                };

                console.log(`📨 Sending reminder to: ${user.email_id}...`);
                
                // ✅ Send email
                await transporter.sendMail(mailOptions);
                console.log(`✅ Reminder sent successfully to: ${user.email_id}`);
            } else {
                console.warn(`⚠️ Skipping task ID ${task.id}, user email not found.`);
            }
        }
    } catch (error) {
        console.error("❌ Error in task reminder job:", error);
    }
});

module.exports = cron;