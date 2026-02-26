import { DynamicButton } from '@/components/agentic/DynamicButton';

export function HeroStory() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[500px] p-12 bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 rounded-3xl shadow-xl text-slate-800">
            <h1 className="text-6xl font-serif font-black tracking-tighter mb-6 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600 text-center leading-tight">
                A Design That
                <br />Learns You.
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl text-center leading-relaxed mb-10">
                Imagine a digital experience that adapts to your thoughts before you even click.
                Our fluid interface morphs seamlessly to match your natural rhythm, creating a flow state like never before.
            </p>
            <DynamicButton
                storyText="Experience the Magic"
                dataText="Initialize System"
            />
        </div>
    );
}
