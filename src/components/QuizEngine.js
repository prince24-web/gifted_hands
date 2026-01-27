'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function QuizEngine({ questions, subjectName, topicName }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [score, setScore] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    const [userAnswers, setUserAnswers] = useState([]);

    const currentQuestion = questions[currentIndex];

    const handleOptionSelect = (index) => {
        if (isAnswered) return;
        setSelectedOption(index);
        // setIsAnswered(true); // Moved to onClick for clarity or kept here?
        // Actually, let's keep it clean: update state here
    };

    const handleNext = () => {
        const isCorrect = selectedOption === currentQuestion.correctAnswer;
        if (isCorrect) setScore(score + 1);

        const newAnswers = [...userAnswers, {
            question: currentQuestion.question,
            selected: selectedOption,
            correct: currentQuestion.correctAnswer,
            isCorrect
        }];
        setUserAnswers(newAnswers);

        if (currentIndex + 1 < questions.length) {
            setCurrentIndex(currentIndex + 1);
            setSelectedOption(null);
            setIsAnswered(false);
        } else {
            setIsFinished(true);
        }
    };

    if (isFinished) {
        return (
            <div className="max-w-2xl mx-auto py-12 px-6">
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 text-center">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
                        🎉
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-2">Quiz Completed!</h2>
                    <p className="text-slate-500 mb-8">You've finished the {topicName} quiz.</p>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="p-4 bg-slate-50 rounded-2xl">
                            <span className="block text-sm text-slate-500 uppercase font-bold tracking-wider mb-1">Score</span>
                            <span className="text-2xl font-bold text-primary">{score} / {questions.length}</span>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-2xl">
                            <span className="block text-sm text-slate-500 uppercase font-bold tracking-wider mb-1">Percentage</span>
                            <span className="text-2xl font-bold text-primary">{Math.round((score / questions.length) * 100)}%</span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Link
                            href={`/`}
                            className="block w-full py-4 bg-primary text-white font-semibold rounded-2xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                        >
                            Back to Subjects
                        </Link>
                        <button
                            onClick={() => window.location.reload()}
                            className="block w-full py-4 bg-white text-primary border border-primary/20 font-semibold rounded-2xl hover:bg-primary/5 transition-all"
                        >
                            Retake Quiz
                        </button>
                    </div>
                </div>

                <div className="mt-12">
                    <h3 className="text-xl font-bold text-slate-800 mb-6">Review Answers</h3>
                    <div className="space-y-4">
                        {userAnswers.map((answer, i) => (
                            <div key={i} className={`p-6 rounded-2xl border ${answer.isCorrect ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
                                <p className="font-medium text-slate-900 mb-4" dangerouslySetInnerHTML={{ __html: `${i + 1}. ${answer.question}` }}></p>
                                <div className="space-y-2">
                                    <p className="text-sm">
                                        <span className="font-bold">Your answer:</span> <span dangerouslySetInnerHTML={{ __html: questions[i].options[answer.selected] || 'No answer' }}></span>
                                    </p>
                                    {!answer.isCorrect && (
                                        <p className="text-sm">
                                            <span className="font-bold">Correct answer:</span> <span dangerouslySetInnerHTML={{ __html: questions[i].options[answer.correct] }}></span>
                                        </p>
                                    )}
                                    {questions[i].explanation && (
                                        <p className="mt-3 text-sm italic text-slate-600 border-t border-slate-200 pt-3">
                                            {questions[i].explanation}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    const progress = ((currentIndex) / questions.length) * 100;

    return (
        <div className="max-w-2xl mx-auto py-8 px-6">
            {/* Quiz Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-lg font-bold text-slate-900">{topicName}</h2>
                    <p className="text-sm text-slate-500">{subjectName}</p>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-3 bg-slate-100 rounded-full mb-10 overflow-hidden">
                <div
                    className="h-full bg-primary transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                ></div>
            </div>

            {/* Question Card */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 mb-8">
                <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-lg mb-4 uppercase tracking-wider">
                    Question {currentIndex + 1} of {questions.length}
                </span>

                {currentQuestion.image && (
                    <div className="mb-6 rounded-xl overflow-hidden border border-slate-100">
                        <img
                            src={currentQuestion.image}
                            alt="Question Illustration"
                            className="w-full h-auto max-h-64 object-contain bg-slate-50"
                        />
                    </div>
                )}

                <h3
                    className="text-xl font-semibold text-slate-900 mb-8 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: currentQuestion.question }}
                ></h3>

                <div className="space-y-4">
                    {currentQuestion.options.map((option, index) => {
                        const isSelected = selectedOption === index;
                        const isCorrect = index === currentQuestion.correctAnswer;
                        const showCorrectness = isAnswered;

                        let borderClass = 'border-slate-100 hover:border-primary/30 hover:bg-slate-50';
                        let bgClass = 'bg-white';
                        let textClass = 'text-slate-700';
                        let iconClass = 'bg-white border-slate-200 text-slate-400';

                        if (isSelected && !showCorrectness) {
                            borderClass = 'border-primary ring-2 ring-primary/20';
                            bgClass = 'bg-primary/5';
                            textClass = 'text-primary';
                            iconClass = 'bg-primary border-primary text-white';
                        } else if (showCorrectness) {
                            if (isCorrect) {
                                borderClass = 'border-green-500 bg-green-50';
                                textClass = 'text-green-700 font-medium';
                                iconClass = 'bg-green-500 border-green-500 text-white';
                            } else if (isSelected) {
                                borderClass = 'border-red-500 bg-red-50';
                                textClass = 'text-red-700';
                                iconClass = 'bg-red-500 border-red-500 text-white';
                            } else {
                                borderClass = 'border-slate-100 opacity-50';
                            }
                        }

                        return (
                            <button
                                key={index}
                                onClick={() => {
                                    handleOptionSelect(index);
                                    setIsAnswered(true);
                                }}
                                disabled={isAnswered}
                                className={`w-full p-5 text-left rounded-2xl border transition-all duration-200 flex items-center gap-4 ${borderClass} ${bgClass}`}
                            >
                                <span className={`w-8 h-8 flex items-center justify-center rounded-lg border text-sm font-bold flex-shrink-0 ${iconClass}`}>
                                    {String.fromCharCode(65 + index)}
                                </span>
                                <span
                                    className={`flex-1 font-medium ${textClass}`}
                                    dangerouslySetInnerHTML={{ __html: option }}
                                ></span>
                                {showCorrectness && isCorrect && (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                                {showCorrectness && isSelected && !isCorrect && (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Footer Controls */}
            <div className="flex justify-end">
                <button
                    disabled={selectedOption === null}
                    onClick={handleNext}
                    className={`px-10 py-4 font-bold rounded-2xl transition-all ${selectedOption !== null
                        ? 'bg-primary text-white shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]'
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        }`}
                >
                    {currentIndex + 1 === questions.length ? 'Finish Quiz' : 'Next Question'}
                </button>
            </div>
        </div>
    );
}
