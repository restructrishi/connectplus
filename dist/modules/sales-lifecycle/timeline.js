"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addTimelineEvent = addTimelineEvent;
const prisma_js_1 = require("../../lib/prisma.js");
async function addTimelineEvent(params) {
    await prisma_js_1.prisma.opportunityTimeline.create({
        data: {
            opportunityId: params.opportunityId,
            action: params.action,
            stageFrom: params.stageFrom,
            stageTo: params.stageTo,
            userId: params.userId,
            comment: params.comment ?? undefined,
            metadata: (params.metadata ?? undefined),
        },
    });
}
//# sourceMappingURL=timeline.js.map