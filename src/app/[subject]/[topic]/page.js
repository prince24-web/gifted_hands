import Link from 'next/link';
import { notFound } from 'next/navigation';
import { subjects, questionsBySubject } from '@/lib/data';
import QuizEngine from '@/components/QuizEngine';

export default async function QuizPage({ params }) {
    const { subject: subjectId, topic: topicEncoded } = await params;
    const topicName = decodeURIComponent(topicEncoded);

    const subject = subjects.find(s => s.id === subjectId);
    if (!subject) return notFound();

    const questions = questionsBySubject[subjectId]?.[topicName];
    if (!questions) return notFound();

    return (
        <div className="min-h-screen bg-slate-50">
            <header className="bg-white border-b border-slate-200 py-6 px-6">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href={`/${subjectId}`} className="text-slate-400 hover:text-primary transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                        </Link>
                        <div className="h-6 w-[1px] bg-slate-200 hidden sm:block"></div>
                        <nav className="hidden sm:flex text-sm font-medium">
                            <Link href="/" className="text-slate-500 hover:text-primary">Home</Link>
                            <span className="mx-2 text-slate-300">/</span>
                            <Link href={`/${subjectId}`} className="text-slate-500 hover:text-primary">{subject.name}</Link>
                            <span className="mx-2 text-slate-300">/</span>
                            <span className="text-slate-900">{topicName}</span>
                        </nav>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Session</span>
                    </div>
                </div>
            </header>

            <main>
                <QuizEngine
                    questions={questions}
                    subjectName={subject.name}
                    topicName={topicName}
                />
            </main>
        </div>
    );
}
