
import React from 'react';
import { Profile } from '@/types';
import { CheckCheck, AlertTriangle } from 'lucide-react';

interface ProfileCompletionMeterProps {
  profile: Profile | null;
}

const ProfileCompletionMeter: React.FC<ProfileCompletionMeterProps> = ({ profile }) => {
  if (!profile) return null;
  
  // Calculate completion percentage based on filled profile fields
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
  
  // Determine color based on percentage
  const getColorClass = () => {
    if (completionPercentage < 30) return 'bg-red-500';
    if (completionPercentage < 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };
  
  // Determine next steps message
  const getNextStep = () => {
    if (!profile.avatar_url) return 'Upload a profile photo';
    if (!profile.bio) return 'Add your bio';
    if (!profile.university) return 'Set your exchange university';
    if (!profile.interests) return 'Add your interests';
    return 'Your profile looks great!';
  };
  
  const nextStep = getNextStep();

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-6 animate-fade-in">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-700">Profile Completion</h3>
        <span className="text-sm font-medium text-gray-900">{completionPercentage}%</span>
      </div>
      
      <div className="profile-completion-bar">
        <div 
          className={`profile-completion-progress ${getColorClass()}`} 
          style={{ width: `${completionPercentage}%` }}
        ></div>
      </div>
      
      <div className="mt-3 flex items-start">
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
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="badge badge-blue">🧳 City Explorer</span>
          {completionPercentage >= 90 && (
            <span className="badge badge-purple">🏆 Profile Champion</span>
          )}
          {profile.university && (
            <span className="badge badge-green">🎓 Erasmus Scholar</span>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfileCompletionMeter;
