import { BotMessageSquare } from 'lucide-react';

const LoadingScreen = () => {
    return (
        <div className="fixed inset-0 z-50 flex flex-col justify-center items-center bg-black/70 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-4 p-8">
                <BotMessageSquare className="w-16 h-16 animate-pulse text-primary" />
                <span className="text-lg font-semibold text-primary text-center">
                    Loading, our API might be waking up...
                </span>
            </div>
        </div>
    );
};

export default LoadingScreen;
