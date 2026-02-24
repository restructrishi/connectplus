export type DeploymentEmailTemplate = {
  subject: string;
  body: string;
};

type TemplateMap = {
  deployment_initiated: DeploymentEmailTemplate;
  kickoff_scheduled: DeploymentEmailTemplate;
  engineer_assigned: DeploymentEmailTemplate;
  material_dispatched: DeploymentEmailTemplate;
  golive: DeploymentEmailTemplate;
};

export const deploymentEmailTemplates: TemplateMap = {
  deployment_initiated: {
    subject: "Deployment initiated for [clientName] | [projectRef]",
    body: [
      "Dear [clientName],",
      "",
      "Your deployment project [projectRef] has been initiated.",
      "",
      "Our deployment team will review the scope, align resources, and share the detailed plan with you shortly.",
      "",
      "If you have any questions in the meantime, please reply to this email.",
      "",
      "Regards,",
      "[senderName]",
    ].join("\n"),
  },
  kickoff_scheduled: {
    subject: "Deployment kickoff scheduled for [clientName] | [projectRef]",
    body: [
      "Dear [clientName],",
      "",
      "The deployment kickoff meeting for project [projectRef] has been scheduled.",
      "",
      "Meeting details:",
      "Date: [kickoffDate]",
      "Mode: [kickoffMode]",
      "",
      "We will walk you through the deployment plan, timelines, and prerequisites during this session.",
      "",
      "Regards,",
      "[senderName]",
    ].join("\n"),
  },
  engineer_assigned: {
    subject: "Deployment engineer assigned for [clientName] | [projectRef]",
    body: [
      "Dear [clientName],",
      "",
      "A deployment engineer has been assigned to your project [projectRef].",
      "",
      "Engineer details:",
      "Name: [engineerName]",
      "Role: [engineerRole]",
      "",
      "They will be your primary technical point of contact for deployment activities.",
      "",
      "Regards,",
      "[senderName]",
    ].join("\n"),
  },
  material_dispatched: {
    subject: "Material dispatched for deployment at [clientName]",
    body: [
      "Dear [clientName],",
      "",
      "This is to inform you that the required material for your deployment has been dispatched towards your site.",
      "",
      "Site address:",
      "[clientAddress]",
      "",
      "Our team will coordinate with you for receiving the material and scheduling the deployment activities.",
      "",
      "Regards,",
      "[senderName]",
    ].join("\n"),
  },
  golive: {
    subject: "Deployment Go-Live completed for [clientName] | [projectRef]",
    body: [
      "Dear [clientName],",
      "",
      "We are glad to inform you that the deployment for project [projectRef] has been successfully taken live.",
      "",
      "Site address:",
      "[clientAddress]",
      "",
      "Our team will continue to monitor the environment during the stabilization period and support you as needed.",
      "",
      "Thank you for choosing us as your technology partner.",
      "",
      "Regards,",
      "[senderName]",
    ].join("\n"),
  },
};

