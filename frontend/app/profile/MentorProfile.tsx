import MentorProfileCard from './MentorProfileCard';
import WorkArea from './MentorWorkArea';

export default function MentorProfile() {
    return (
        <div className="mx-4 sm:mx-8 lg:mx-16 flex flex-col lg:flex-row min-h-screen">
            {/* Блок профиля */}
            <div className="w-full lg:w-1/5 mb-4 lg:mb-0 md:mr-8">
                <MentorProfileCard />
            </div>
            {/* Рабочая область */}
            <div className="flex-1">
                <WorkArea />
            </div>
        </div>
    );
}