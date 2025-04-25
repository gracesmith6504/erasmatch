
import React from 'react';
import { Profile } from '@/types';
import { CheckCheck, AlertTriangle } from 'lucide-react';

interface ProfileCompletionMeterProps {
  profile: Profile | null;
}

const ProfileCompletionMeter: React.FC<ProfileCompletionMeterProps> = ({ profile }) => {
  if (!profile) return null;
  
  const calculateCompletion = () => {
    const fields = [
      profile.name,
      profile.email,
      profile.university,
      profile.avatar_url,
      profile.bio,
      profile.semester,
      profile.home_university,
      profile.city,
      profile.country,
      profile.interests
    ];
    
    const filledFields = fields.filter(Boolean).length;
    return Math.round((filledFields / fields.length) * 100);
  };
  
  const completionPercentage = calculateCompletion();
  
  const getColorClass = () => {
    if (completionPercentage < 30) return 'bg-red-500';
    if (completionPercentage < 70) return 'bg-yellow-500';
    return 'bg-gradient-to-r from-erasmatch-blue via-erasmatch-purple to-erasmatch-green';
  };
  
  const getNextStep = () => {
    if (!profile.avatar_url) return 'Upload a profile photo';
    if (!profile.bio) return 'Add your bio';
    if (!profile.university) return 'Set your exchange university';
    if (!profile.interests) return 'Add your interests';
    return 'Your profile looks great!';
  };
  
  const nextStep = getNextStep();

  return (
    <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 mb-8 animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-medium text-gray-700">Profile Completion</h3>
        <span className="text-base font-semibold bg-gradient-to-r from-erasmatch-blue to-erasmatch-purple bg-clip-text text-transparent">
          {completionPercentage}%
        </span>
      </div>
      
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all duration-700 ${getColorClass()}`} 
          style={{ width: `${completionPercentage}%` }}
        />
      </div>
      
      <div className="mt-4 flex items-start">
        {completionPercentage >= 80 ? (
          <CheckCheck className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
        ) : (
          <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0" />
        )}
        <p className="text-sm text-gray-600">
          {nextStep}
        </p>
      </div>
      
      {completionPercentage >= 70 && (
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            🧳 City Explorer
          </span>
          {completionPercentage >= 90 && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
              🏆 Profile Champion
            </span>
          )}
          {profile.university && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              🎓 Erasmus Scholar
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfileCompletionMeter;
