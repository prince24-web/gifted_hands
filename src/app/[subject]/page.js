import Link from 'next/link';
import { notFound } from 'next/navigation';
import { subjects, questionsBySubject } from '@/lib/data';

export default async function SubjectPage({ params }) {
    const { subject: subjectId } = await params;
    const subject = subjects.find(s => s.id === subjectId);

    if (!subject) {
        return notFound();
    }

    const topics = Object.keys(questionsBySubject[subjectId] || {});

    return (
        <div className="min-h-screen bg-slate-50">
            <header className="bg-white border-b border-slate-200 py-8 px-6">
                <div className="max-w-4xl mx-auto flex items-center gap-4">
                    <Link href="/" className="text-slate-400 hover:text-primary transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </Link>
                    <div className="w-10 h-10 flex items-center justify-center text-xl rounded-xl" style={{ backgroundColor: `${subject.color}15` }}>
                        {subject.icon}
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900">{subject.name}</h1>
                </div>
            </header>

            <main className="max-w-4xl mx-auto py-12 px-6">
                <div className="mb-8">
                    <h2 className="text-xl font-semibold text-slate-800 mb-2">Select Exam Type</h2>
                    <p className="text-slate-500">Pick an exam type (WAEC or UTME) to start practicing.</p>
                </div>

                <div className="grid gap-4">
                    {topics.length > 0 ? (
                        topics.map((topic) => (
                            <Link
                                key={topic}
                                href={`/${subjectId}/${encodeURIComponent(topic)}`}
                                className="group flex items-center justify-between p-6 bg-white border border-slate-200 rounded-2xl hover:border-primary/30 hover:shadow-sm transition-all"
                            >
                                <div>
                                    <h3 className="font-semibold text-slate-800 group-hover:text-primary transition-colors">{topic}</h3>
                                    <p className="text-sm text-slate-500 mt-1">{questionsBySubject[subjectId][topic].length} Questions Available</p>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400 group-hover:text-primary transition-colors" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
                            <p className="text-slate-400 italic">No topics available for this subject yet.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
