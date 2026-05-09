import React, { useState, useEffect } from "react";
import { useParams, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/src/lib/auth-context";
import { getProject } from "@/src/lib/db/projects";
import { Project, ProjectStage } from "@/src/types";
import { StageBadge } from "./StageBadge";
import { IdeaEngine } from "./IdeaEngine";
import { ResearchHub } from "./ResearchHub";
import { ScriptStudio } from "./ScriptStudio";
import { ScenePlanner } from "./ScenePlanner";
import { VoiceoverModule } from "./VoiceoverModule";
import { MetadataGeneration } from "./MetadataGeneration";
import { RoughCutGenerator } from "./RoughCutGenerator";
import { PublishCenter } from "./PublishCenter";
import { AnalyticsDashboard } from "./AnalyticsDashboard";
import { ShortsRepurposing } from "./ShortsRepurposing";
import { AutomationPanel } from "./AutomationPanel";
import { ProjectEvents } from "./ProjectEvents";
import { STAGE_ORDER, STAGE_LABELS, canAccessStage, getBlockingReason } from "@/src/lib/workflow/stages";
import { ArrowLeft, Lock, Calendar, Settings, Scissors, Layers, AlertTriangle, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PostmortemPanel } from "./PostmortemPanel";
import { AssignmentPanel } from "./AssignmentPanel";
import { DollarSign } from "lucide-react";
import { ProjectMonetizationPanel } from "./ProjectMonetizationPanel";

type DashboardTab = ProjectStage | "SHORTS" | "AUTOMATION" | "EVENTS" | "POSTMORTEM" | "MONETIZATION";

export const ProjectDashboard = () => {
    const { projectId } = useParams<{ projectId: string }>();
    const navigate = useNavigate();
    const { activeWorkspace, activeChannel } = useAuth();
    
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<DashboardTab>(ProjectStage.IDEA);

    const load = async () => {
        if (activeWorkspace && activeChannel && projectId) {
            setLoading(true);
            const data = await getProject(activeWorkspace.id, activeChannel.id, projectId);
            setProject(data);
            if (data) {
                // Default tab logic: jump to their current stage
                setActiveTab(data.currentStage);
            }
            setLoading(false);
        } else {
            setProject(null);
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, [projectId, activeWorkspace, activeChannel]);

    if (loading) {
        return <div className="p-8 text-center text-zinc-500">Loading project...</div>;
    }

    if (!project) {
        return <Navigate to="/projects" />;
    }

    const availableStages = [
        ProjectStage.IDEA,
        ProjectStage.RESEARCH,
        ProjectStage.SCRIPT,
        ProjectStage.FACT_CHECK,
        ProjectStage.VISUAL_PLAN,
        ProjectStage.VOICE,
        ProjectStage.EDIT_QA,
        ProjectStage.METADATA,
        ProjectStage.READY_TO_PUBLISH,
        ProjectStage.ANALYZED
    ];

    const isBlocked = typeof activeTab === "string" && !['SHORTS', 'AUTOMATION', 'EVENTS', 'POSTMORTEM'].includes(activeTab)
        ? !canAccessStage(project, activeTab as ProjectStage)
        : false;
    const blockReason = isBlocked ? getBlockingReason(project, activeTab as ProjectStage) : null;

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
            <Button variant="ghost" onClick={() => navigate("/projects")} className="text-zinc-500 hover:text-white px-0 -ml-2 mb-2">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Projects
            </Button>
            
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-2">{project.title}</h1>
                    <div className="flex gap-4">
                        <StageBadge stage={project.currentStage} />
                        <span className="text-xs text-zinc-500 font-mono flex items-center">
                            ID: {project.id.slice(0, 8)}
                        </span>
                    </div>
                </div>
            </div>

            <div className="border-b border-white/10 flex gap-6 overflow-x-auto scrollbar-hide pb-2">
                {availableStages.map(stage => {
                    const accessible = canAccessStage(project, stage);
                    const isActive = activeTab === stage;
                    return (
                        <button
                            key={stage}
                            onClick={() => setActiveTab(stage)}
                            className={`flex items-center gap-2 pb-2 border-b-2 text-sm font-medium transition-colors whitespace-nowrap px-1 ${isActive ? 'border-brand-teal text-white' : 'border-transparent text-zinc-500 hover:text-zinc-300'} ${!accessible && 'opacity-50'}`}
                        >
                            {!accessible && <Lock className="w-3 h-3 block" />}
                            {STAGE_LABELS[stage]}
                        </button>
                    )
                })}
                 <div className="w-px h-6 bg-white/10 ml-2"></div>
                 <button onClick={() => setActiveTab("SHORTS")} className={`flex items-center gap-2 pb-2 border-b-2 text-sm font-medium transition-colors whitespace-nowrap px-1 ${activeTab === "SHORTS" ? 'border-indigo-500 text-white' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}>
                     <Scissors className="w-4 h-4" /> Shorts
                 </button>
                 <button onClick={() => setActiveTab("AUTOMATION")} className={`flex items-center gap-2 pb-2 border-b-2 text-sm font-medium transition-colors whitespace-nowrap px-1 ${activeTab === "AUTOMATION" ? 'border-blue-500 text-white' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}>
                     <Layers className="w-4 h-4" /> Automation
                 </button>
                 <button onClick={() => setActiveTab("EVENTS")} className={`flex items-center gap-2 pb-2 border-b-2 text-sm font-medium transition-colors whitespace-nowrap px-1 ${activeTab === "EVENTS" ? 'border-zinc-400 text-white' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}>
                     <Calendar className="w-4 h-4" /> Events
                 </button>
                 <button onClick={() => setActiveTab("POSTMORTEM")} className={`flex items-center gap-2 pb-2 border-b-2 text-sm font-medium transition-colors whitespace-nowrap px-1 ${activeTab === "POSTMORTEM" ? 'border-red-500 text-white' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}>
                     <AlertTriangle className="w-4 h-4" /> Postmortem
                 </button>
                 <button onClick={() => setActiveTab("MONETIZATION")} className={`flex items-center gap-2 pb-2 border-b-2 text-sm font-medium transition-colors whitespace-nowrap px-1 ${activeTab === "MONETIZATION" ? 'border-brand-teal text-brand-teal' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}>
                     <DollarSign className="w-4 h-4" /> Monetization
                 </button>
            </div>

            <div className="pt-4">
                {isBlocked ? (
                    <div className="py-20 text-center border border-dashed border-white/5 rounded-xl bg-charcoal/30 flex flex-col items-center">
                        <Lock className="w-8 h-8 text-zinc-600 mb-3" />
                        <p className="text-zinc-300 font-medium mb-1">Stage Locked</p>
                        <p className="text-sm text-zinc-500">{blockReason}</p>
                    </div>
                ) : (
                    <>
                        {activeTab === ProjectStage.IDEA && <IdeaEngine project={project} onUpdate={load} />}
                        {activeTab === ProjectStage.RESEARCH && <ResearchHub project={project} onUpdate={load} />}
                        {activeTab === ProjectStage.SCRIPT && <ScriptStudio project={project} onUpdate={load} />}
                        {activeTab === ProjectStage.FACT_CHECK && <div className="text-center py-20 text-zinc-500">Use the Script Studio to approve Fact Check.</div>}
                        {activeTab === ProjectStage.VISUAL_PLAN && <ScenePlanner project={project} onUpdate={load} />}
                        {activeTab === ProjectStage.VOICE && <VoiceoverModule project={project} onUpdate={load} />}
                        {activeTab === ProjectStage.EDIT_QA && <RoughCutGenerator project={project} onUpdate={load} />}
                        {activeTab === ProjectStage.METADATA && <MetadataGeneration project={project} onUpdate={load} />}
                        {activeTab === ProjectStage.READY_TO_PUBLISH && <PublishCenter project={project} onUpdate={load} />}
                        {activeTab === ProjectStage.ANALYZED && <AnalyticsDashboard project={project} onUpdate={load} />}
                        
                        {(typeof activeTab === "string" && !['SHORTS', 'AUTOMATION', 'EVENTS', 'POSTMORTEM', 'MONETIZATION'].includes(activeTab)) && (
                            <div className="mt-8">
                                <AssignmentPanel projectId={project.id} currentStage={activeTab as ProjectStage} />
                            </div>
                        )}

                        {activeTab === "SHORTS" && <ShortsRepurposing project={project} onUpdate={load} />}
                        {activeTab === "AUTOMATION" && <AutomationPanel project={project} />}
                        {activeTab === "EVENTS" && <ProjectEvents project={project} />}
                        {activeTab === "POSTMORTEM" && <PostmortemPanel projectId={project.id} />}
                        {activeTab === "MONETIZATION" && <ProjectMonetizationPanel project={project} />}
                    </>
                )}
            </div>
        </div>
    );
};
