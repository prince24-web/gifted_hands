import Link from 'next/link';

export default function SubjectCard({ subject }) {
    return (
        <Link
            href={`/${subject.id}`}
            className="group relative flex flex-col items-center justify-center p-8 bg-white border border-slate-200 rounded-2xl shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:border-primary/20"
        >
            <div
                className="w-16 h-16 flex items-center justify-center text-3xl rounded-2xl mb-4 transition-transform group-hover:scale-110"
                style={{ backgroundColor: `${subject.color}15` }}
            >
                {subject.icon}
            </div>
            <h3 className="text-lg font-semibold text-slate-800 group-hover:text-primary transition-colors">
                {subject.name}
            </h3>
            <p className="text-sm text-slate-500 mt-2">
                JAMB & WAEC Past Questions
            </p>

            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
            </div>
        </Link>
    );
}
