import { useState, useRef, useEffect } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { IJob } from '@/types/IJob';
import { JobCard } from '@/components/JobCard';
import InputForm from './InputForm';
import { BotMessageSquare } from 'lucide-react';
import { Navbar } from '../navbar/Navbar';
import { useUser } from '@/context/UserContext';
import DocumentCard from '@/components/DocumentCard';
import { Button } from '@/components/ui/button';
export type MessageContent = string | IJob[];

export interface Message {
    id: string;
    content: MessageContent;
    isUser: boolean;
}

interface ChatInterfaceProps {
    messages: Message[];
    onSendMessage: (message: string) => void;
    isLoadingMessage: boolean;
}

const recommendations = [
    'Whats jobs do you have for me?',
    'How can I improve my resume?',
    'Edit my resume for me improving my skills',
];

const ChatInterface = ({ messages, onSendMessage, isLoadingMessage }: ChatInterfaceProps) => {
    const [inputValue, setInputValue] = useState('');
    const { user, isAuthenticated } = useUser();
    const [openUserMenu, setOpenUserMenu] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        sendMessage(inputValue);
    };

    const sendMessage = (message: string) => {
        onSendMessage(message);
        setInputValue('');
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const renderMessageContent = (content: MessageContent) => {
        if (typeof content === 'string') {
            const trimmed = content.trim();
            const isFileLink =
                (trimmed.startsWith('http://') || trimmed.startsWith('https://')) &&
                (trimmed.toLowerCase().endsWith('.pdf') || trimmed.toLowerCase().endsWith('.docx'));
            if (isFileLink) {
                return <DocumentCard fileUrl={trimmed} />;
            }
            return (
                <div
                    className="chat-content flex flex-col gap-2"
                    dangerouslySetInnerHTML={{ __html: content }}
                />
            );
        } else if (Array.isArray(content)) {
            return (
                <div className="space-y-4">
                    {content.map((job) => (
                        <JobCard key={job.jobId} job={job} />
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="flex flex-col h-full">
            <Navbar openUserMenu={openUserMenu} setOpenUserMenu={setOpenUserMenu} />

            {isAuthenticated && !user?.docx_path && (
                <div className="fixed bottom-0 left-0 right-0 bg-black/70 p-4 text-center h-screen z-40 flex flex-col items-center justify-center gap-4">
                    <p className="text-white">You need to upload your CV to continue</p>
                    <Button onClick={() => setOpenUserMenu(true)}>Upload CV</Button>
                </div>
            )}

            <div className="flex flex-col justify-between flex-1 w-full max-w-4xl mx-auto overflow-y-auto">
                <ScrollArea className="flex-1 overflow-y-auto">
                    <div className="p-4 space-y-4">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${
                                    message.isUser ? 'justify-end' : 'justify-start'
                                }`}
                            >
                                {!message.isUser && (
                                    <Avatar className="mr-2 flex-shrink-0 mt-1">
                                        <AvatarFallback className="bg-primary text-primary-foreground">
                                            <BotMessageSquare className="w-4 h-4" />
                                        </AvatarFallback>
                                    </Avatar>
                                )}
                                <div
                                    className={`max-w-[80%] p-3 rounded-lg ${
                                        message.isUser
                                            ? 'bg-primary text-primary-foreground rounded-br-none'
                                            : 'bg-muted rounded-bl-none'
                                    }`}
                                >
                                    {renderMessageContent(message.content)}
                                </div>
                                {message.isUser && (
                                    <Avatar className="ml-2 flex-shrink-0 mt-1">
                                        <AvatarFallback className="bg-primary text-primary-foreground">
                                            {user?.name?.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                )}
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                        {isLoadingMessage && (
                            <div className="flex justify-center items-center py-4 gap-2">
                                <BotMessageSquare className="w-6 h-6 animate-pulse text-muted-foreground" />
                                <p className="text-muted-foreground">Thinking... Maybe a lot 😑</p>
                            </div>
                        )}
                    </div>
                </ScrollArea>
                {messages.length <= 1 && (
                    <div className="flex flex-col items-center justify-center p-4">
                        <div className="flex flex-wrap gap-2">
                            {recommendations.map((recommendation) => (
                                <Button
                                    key={recommendation}
                                    variant="outline"
                                    size="lg"
                                    onClick={() => sendMessage(recommendation)}
                                >
                                    {recommendation}
                                </Button>
                            ))}
                        </div>
                    </div>
                )}

                <InputForm
                    inputValue={inputValue}
                    setInputValue={setInputValue}
                    handleSubmit={handleSubmit}
                    disabled={isLoadingMessage || !isAuthenticated}
                    isAuthenticated={isAuthenticated}
                />
            </div>
        </div>
    );
};

export default ChatInterface;
