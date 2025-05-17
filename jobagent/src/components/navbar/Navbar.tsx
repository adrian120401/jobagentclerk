import { SignInButton, UserButton } from '@clerk/clerk-react';
import { ThemeToggle } from '../ThemeToggle';
import { Button } from '../ui/button';
import { useState } from 'react';
import { useUser } from '@/context/UserContext';
import { useJob } from '@/context/JobContext';
import { X } from 'lucide-react';
import InterviewMenu from '../InterviewMenu';
import { IInterviewResume } from '@/types/IInterview';
import InterviewResume from '../menu/InterviewResume';
import InterviewHistory from '../menu/InterviewHistory';

export const Navbar = () => {
    const [isInterviewMenuOpen, setIsInterviewMenuOpen] = useState(false);
    const [interviewResume, setInterviewResume] = useState<IInterviewResume | null>(null);
    const [interviewResumeOpen, setInterviewResumeOpen] = useState(false);
    const [isInterviewHistoryOpen, setIsInterviewHistoryOpen] = useState(false);

    const { isAuthenticated } = useUser();
    const { jobSelected, setJobSelected } = useJob();

    const interviewResumeShow = (interview: IInterviewResume, open: boolean) => {
        setInterviewResumeOpen(open);
        setInterviewResume(interview);
    };

    return (
        <header className="border-b border-border py-3 px-4 flex items-center justify-between h-14 bg-card">
            <div className="text-lg font-medium">JobAgent</div>

            {jobSelected && (
                <div className="flex gap-2">
                    <div className="flex items-center gap-2 border border-border rounded-lg p-2">
                        <span className="text-xs text-muted-foreground max-w-[200px] truncate">
                            {jobSelected.job.title}
                        </span>
                        <Button
                            className="h-4 w-4"
                            variant="ghost"
                            size="icon"
                            onClick={() => setJobSelected(null)}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                    <Button
                        variant="outline"
                        className=""
                        onClick={() => setIsInterviewMenuOpen(true)}
                    >
                        Start interview
                    </Button>
                </div>
            )}

            <div className="flex items-center gap-2">
                <ThemeToggle />
                <div className="relative">
                    {isAuthenticated ? (
                        <UserButton />
                    ) : (
                        <SignInButton mode="modal" />
                    )}
                </div>
            </div>
            <InterviewMenu
                isOpen={isInterviewMenuOpen}
                onClose={() => setIsInterviewMenuOpen(false)}
                jobId={jobSelected?.jobId}
                interviewResume={interviewResumeShow}
            />
            <InterviewResume
                isOpen={interviewResumeOpen}
                onClose={() => setInterviewResumeOpen(false)}
                interviewResume={interviewResume}
            />
            <InterviewHistory
                isOpen={isInterviewHistoryOpen}
                setIsOpen={setIsInterviewHistoryOpen}
            />
        </header>
    );
};
