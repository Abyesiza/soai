import { Smartphone, Zap, Infinity } from 'lucide-react';

export function FeaturesStory() {
    return (
        <section id="features" className="py-32 bg-indigo-50 text-slate-900 flex justify-center">
            <div className="max-w-6xl w-full px-6">
                <div className="text-center max-w-2xl mx-auto mb-20">
                    <h2 className="text-4xl font-serif font-bold text-indigo-950 mb-6">
                        Crafted for Intuition
                    </h2>
                    <p className="text-lg text-slate-600 leading-relaxed">
                        Every interaction is a brushstroke. We designed SOAI to remove friction so you can focus entirely on your creative process.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="flex flex-col items-center text-center">
                        <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-indigo-600 mb-6">
                            <Zap className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Fluid Motion</h3>
                        <p className="text-slate-600">The interface glides from one state to another, matching the pace of your thoughts effortlessly.</p>
                    </div>
                    <div className="flex flex-col items-center text-center">
                        <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-indigo-600 mb-6">
                            <Infinity className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Endless Context</h3>
                        <p className="text-slate-600">Returning tomorrow? The system remembers exactly how you prefer to work, picking up where you left off.</p>
                    </div>
                    <div className="flex flex-col items-center text-center">
                        <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-indigo-600 mb-6">
                            <Smartphone className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Holistic Presence</h3>
                        <p className="text-slate-600">Seamless integration across your entire digital environment, preserving your flow state everywhere.</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
