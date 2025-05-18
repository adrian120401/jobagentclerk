import { SignInButton } from '@clerk/clerk-react';
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
import UserDropdown from './UserDropdown';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import UserMenu from '../menu/UserMenu';

export const Navbar = () => {
    const [isInterviewMenuOpen, setIsInterviewMenuOpen] = useState(false);
    const [interviewResume, setInterviewResume] = useState<IInterviewResume | null>(null);
    const [interviewResumeOpen, setInterviewResumeOpen] = useState(false);
    const [isInterviewHistoryOpen, setIsInterviewHistoryOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const { isAuthenticated, user, logout, clerkUser } = useUser();
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
                <div className="relative flex items-center">
                    {isAuthenticated ? (
                        <>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-full"
                                onClick={() => setIsMenuOpen((open) => !open)}
                            >
                                <Avatar>
                                    <AvatarImage
                                        src={clerkUser?.imageUrl || ''}
                                        alt={user?.name || user?.email || 'User'}
                                    />
                                    <AvatarFallback className="bg-primary text-primary-foreground">
                                        {user?.name?.charAt(0) || user?.email?.charAt(0) || '?'}
                                    </AvatarFallback>
                                </Avatar>
                            </Button>
                            {isMenuOpen && (
                                <UserDropdown
                                    setIsMenuOpen={setIsMenuOpen}
                                    setIsUserMenuOpen={setIsUserMenuOpen}
                                    setIsInterviewHistoryOpen={setIsInterviewHistoryOpen}
                                    logout={logout}
                                />
                            )}
                        </>
                    ) : (
                        <SignInButton mode="modal">
                            <Button variant="outline" className="border border-primary px-4 py-2">
                                Login
                            </Button>
                        </SignInButton>
                    )}
                </div>
            </div>
            <UserMenu isOpen={isUserMenuOpen} setIsOpen={setIsUserMenuOpen} />
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
