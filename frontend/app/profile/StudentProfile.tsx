// app/student/[id]/StudentProfile.tsx
import StudentProfileCard from './StudentProfileCard';
import WorkArea from './StudentWorkArea';
import { nodes } from './_tree/data'; // ваши тестовые данные

export default function StudentProfile() {
    return (
        <div className="mx-4 sm:mx-8 lg:mx-16 flex flex-col lg:flex-row min-h-screen">
        <div className="w-full lg:w-1/5 mb-4 lg:mb-0 md:mr-8">
            <StudentProfileCard />
        </div>
        <div className="flex-1">
            <WorkArea nodes={nodes} skillPoints={3} />
        </div>
        </div>
    );
}