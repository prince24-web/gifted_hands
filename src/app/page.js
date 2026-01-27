import Link from 'next/link';
import { subjects } from '@/lib/data';
import SubjectCard from '@/components/SubjectCard';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 py-12 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
            Gifted <span className="text-primary">Hands</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Master your JAMB and WAEC exams with topically arranged past questions and interactive quizzes.
          </p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto py-16 px-6">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-2xl font-bold text-slate-800">Select a Subject</h2>
          <div className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
            Light Mode
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {subjects.map((subject) => (
            <SubjectCard key={subject.id} subject={subject} />
          ))}
        </div>

        <section className="mt-24 p-8 bg-primary rounded-3xl text-white text-center relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-4">Start Practicing Today</h2>
            <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
              Track your progress, identify weak areas, and boost your exam confidence with thousands of questions.
            </p>
          </div>
          <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -top-12 -left-12 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        </section>
      </main>

      <footer className="py-12 px-6 text-center text-slate-500 text-sm border-t border-slate-200 bg-white">
        &copy; {new Date().getFullYear()} Gifted Hands Exam Prep. Built for Excellence.
      </footer>
    </div>
  );
}

