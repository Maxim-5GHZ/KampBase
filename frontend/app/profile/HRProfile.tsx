import HRProfileCard from './HRProfileCard';
import HRWorkArea from './HRWorkArea';

export default function HRProfile() {
    return (
        <div className="mx-4 sm:mx-8 lg:mx-16 flex flex-col lg:flex-row min-h-screen">
            {/* Блок профиля */}
            <div className="w-full lg:w-1/5 mb-4 lg:mb-0 md:mr-8">
                <HRProfileCard />
            </div>
            {/* Рабочая область */}
            <div className="flex-1">
                <HRWorkArea />
            </div>
        </div>
    );
}