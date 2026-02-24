import cron from "node-cron";
import { differenceInDays } from "date-fns";
import { prisma } from "../prisma";
import { notificationService } from "../modules/notifications/service";
import { mailer } from "./mailer";

export const registerPresalesCron = () => {
  cron.schedule("0 9 * * *", async () => {
    const projects = await prisma.presalesProject.findMany({
      where: {
        status: "active",
      },
      include: {
        stages: {
          orderBy: { completedAt: "desc" },
          take: 1,
        },
      },
    });

    const managementRoles = await prisma.role.findMany({
      where: {
        name: {
          in: ["MANAGEMENT", "ADMIN", "SUPER_ADMIN"],
        },
      },
    });

    const managementUsers = await prisma.user.findMany({
      where: {
        roleId: {
          in: managementRoles.map(role => role.id),
        },
      },
    });

    for (const project of projects) {
      const lastStage = project.stages[0];

      if (!lastStage) {
        continue;
      }

      const days = differenceInDays(new Date(), lastStage.completedAt);

      if (days <= 7) {
        continue;
      }

      const engineer = await prisma.user.findFirst({
        where: {
          name: {
            equals: project.assignedTo,
            mode: "insensitive",
          },
        },
      });

      const message = `Project ${project.title} has been stuck in ${project.currentStage} for ${days} days.`;

      if (engineer) {
        await notificationService.createNotification({
          userId: engineer.id,
          type: "presales_project_stagnant",
          title: "Presales project stagnant",
          message,
          priority: "high",
          channels: ["in_app"],
        });
      }

      for (const user of managementUsers) {
        await notificationService.createNotification({
          userId: user.id,
          type: "presales_project_stagnant",
          title: "Presales project stagnant",
          message,
          priority: "high",
          channels: ["in_app"],
        });
      }
    }
  });
};

export const registerDeploymentCron = () => {
  cron.schedule("30 7 * * *", async () => {
    const smtpConfigured = Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);

    if (!smtpConfigured) {
      return;
    }

    const engineers = await prisma.user.findMany({
      where: {
        isActive: true,
        role: {
          name: "DEPLOYMENT",
        },
        email: {
          not: null,
        },
      },
    });

    if (!engineers.length) {
      return;
    }

    const today = new Date();
    const todayDateString = today.toISOString().slice(0, 10);

    const baseUrl = process.env.APP_BASE_URL || "http://localhost:3000";

    for (const engineer of engineers) {
      const tasks = await prisma.deploymentTask.findMany({
        where: {
          assignedTo: String(engineer.id),
          status: {
            not: "completed",
          },
          dueDate: {
            lte: today,
          },
        },
        include: {
          project: true,
        },
        orderBy: {
          dueDate: "asc",
        },
      });

      if (!tasks.length || !engineer.email) {
        continue;
      }

      const subject = `Your Tasks for Today — ${todayDateString}`;

      const rows = tasks
        .map(task => {
          const due = task.dueDate ? task.dueDate.toISOString().slice(0, 10) : "No due date";
          return `<tr>
  <td style="padding: 4px 8px; border: 1px solid #e5e7eb; font-size: 12px;">${task.title}</td>
  <td style="padding: 4px 8px; border: 1px solid #e5e7eb; font-size: 12px;">${task.project.clientName}</td>
  <td style="padding: 4px 8px; border: 1px solid #e5e7eb; font-size: 12px;">${task.stage}</td>
  <td style="padding: 4px 8px; border: 1px solid #e5e7eb; font-size: 12px;">${due}</td>
  <td style="padding: 4px 8px; border: 1px solid #e5e7eb; font-size: 12px;">${task.priority}</td>
</tr>`;
        })
        .join("");

      const tasksLink = `${baseUrl}/deployment/tasks`;

      const html = `<div style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 13px; color: #111827;">
  <p>Hi ${engineer.name || "there"},</p>
  <p>Here are your pending deployment tasks that are due today or overdue:</p>
  <table style="border-collapse: collapse; margin-top: 12px; margin-bottom: 12px;">
    <thead>
      <tr>
        <th style="padding: 6px 8px; border: 1px solid #e5e7eb; font-size: 12px; text-align: left;">Task</th>
        <th style="padding: 6px 8px; border: 1px solid #e5e7eb; font-size: 12px; text-align: left;">Project</th>
        <th style="padding: 6px 8px; border: 1px solid #e5e7eb; font-size: 12px; text-align: left;">Stage</th>
        <th style="padding: 6px 8px; border: 1px solid #e5e7eb; font-size: 12px; text-align: left;">Due date</th>
        <th style="padding: 6px 8px; border: 1px solid #e5e7eb; font-size: 12px; text-align: left;">Priority</th>
      </tr>
    </thead>
    <tbody>
      ${rows}
    </tbody>
  </table>
  <p>You can view and update these tasks from the deployment tasks view:</p>
  <p><a href="${tasksLink}">${tasksLink}</a></p>
  <p style="margin-top: 16px;">Thanks,<br/>Deployment coordination</p>
</div>`;

      const from = process.env.SMTP_FROM || process.env.SMTP_USER || "no-reply@example.com";

      await mailer.sendMail({
        to: engineer.email,
        from,
        subject,
        html,
      });
    }
  });
};
