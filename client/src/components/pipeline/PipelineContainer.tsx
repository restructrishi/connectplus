import { StageNode } from "./StageNode";
import { StageConnector } from "./StageConnector";
import type { PipelineStageView } from "../../types/pipeline";

interface PipelineContainerProps {
  stages: PipelineStageView[];
  onStageClick?: (stage: PipelineStageView) => void;
}

export function PipelineContainer({ stages, onStageClick }: PipelineContainerProps) {
  const visualStages = stages.filter((s) => s.stageName !== "LOST_DEAL");

  return (
    <div className="flex items-center overflow-x-auto pb-2 gap-0">
      {visualStages.map((stage, i) => (
        <div key={stage.stageName} className="flex items-center flex-shrink-0">
          <StageNode
            stageName={stage.stageName}
            status={stage.status}
            isLocked={stage.isLocked}
            canExecute={stage.canExecute}
            approvedBy={stage.approvedBy}
            approvedAt={stage.approvedAt}
            slaHoursPending={stage.slaHoursPending}
            durationSeconds={stage.durationSeconds}
            onClick={onStageClick ? () => onStageClick(stage) : undefined}
          />
          {i < visualStages.length - 1 && (
            <StageConnector fromStatus={stage.status as any} toStatus={visualStages[i + 1].status as any} />
          )}
        </div>
      ))}
    </div>
  );
}
