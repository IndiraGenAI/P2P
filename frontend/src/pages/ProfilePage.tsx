import { useEffect, useState } from 'react';
import { Camera, Check, ChevronRight, Pencil, Upload } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { FormField } from '@/components/ui/FormField';
import type { Profile } from '@/common/models';
import { useAppSelector } from '@/state/app.hooks';
import { authSelector } from '@/state/auth/auth.reducer';
import type { IAuthUser } from '@/services/auth/auth.model';

const PLACEHOLDER_PROFILE: Profile = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  role: 'Team Member',
  location: '',
};

const buildProfileFromUser = (user: IAuthUser | null): Profile => {
  if (!user) return PLACEHOLDER_PROFILE;
  return {
    ...PLACEHOLDER_PROFILE,
    firstName: user.first_name ?? '',
    lastName: user.last_name ?? '',
    email: user.email ?? '',
    phone: user.phone ?? '',
  };
};

export function ProfilePage() {
  const { profile: authProfile } = useAppSelector(authSelector);
  const authUser = authProfile.data;

  const [profile, setProfile] = useState<Profile>(() =>
    buildProfileFromUser(authUser),
  );
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [personalModalOpen, setPersonalModalOpen] = useState(false);
  const [draft, setDraft] = useState<Profile>(profile);
  const [toast, setToast] = useState('');



  useEffect(() => {
    if (!authUser) return;
    setProfile((prev) => ({
      ...prev,
      firstName: authUser.first_name ?? '',
      lastName: authUser.last_name ?? '',
      email: authUser.email ?? '',
      phone: authUser.phone ?? '',
    }));
  }, [authUser?.id, authUser?.first_name, authUser?.last_name, authUser?.email, authUser?.phone]);

  const openProfileModal = () => {
    setDraft(profile);
    setProfileModalOpen(true);
  };

  const openPersonalModal = () => {
    setDraft(profile);
    setPersonalModalOpen(true);
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const saveProfile = () => {
    setProfile(draft);
    setProfileModalOpen(false);
    showToast('Profile updated successfully');
  };

  const savePersonal = () => {
    setProfile(draft);
    setPersonalModalOpen(false);
    showToast('Personal information updated');
  };

  const fullName = `${profile.firstName} ${profile.lastName}`;
  const initial = profile.firstName?.[0]?.toUpperCase() || 'M';

  return (
    <div className="p-6 relative">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">Profile</h1>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-500">Home</span>
          <ChevronRight size={14} className="text-gray-400" />
          <span className="text-gray-900">Profile</span>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
        <h3 className="font-semibold text-gray-900 mb-6">Profile</h3>
        <div
          className="rounded-2xl p-5 flex items-center justify-between flex-wrap gap-4"
          style={{ background: '#F8FAFC' }}
        >
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-2xl font-bold">
              {initial}
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 text-lg">{fullName}</h4>
              <p className="text-sm text-gray-500 mt-1">
                {profile.role} <span className="text-gray-300 mx-2">|</span> {profile.location}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={openProfileModal}
              className="flex items-center gap-2 ml-2 px-4 py-2 rounded-full text-sm font-medium text-gray-700 hover:text-emerald-600 soft-btn transition"
            >
              <Pencil size={14} /> Edit
            </button>
          </div>
        </div>
      </div>

      <div className="soft-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-gray-900">Personal Information</h3>
          <button
            onClick={openPersonalModal}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-gray-700 hover:text-emerald-600 soft-btn transition"
          >
            <Pencil size={14} /> Edit
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <p className="text-xs text-gray-500 mb-1.5">First Name</p>
            <p className="font-semibold text-gray-900">{profile.firstName}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1.5">Last Name</p>
            <p className="font-semibold text-gray-900">{profile.lastName}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1.5">Email address</p>
            <p className="font-semibold text-gray-900">{profile.email}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1.5">Phone</p>
            <p className="font-semibold text-gray-900">{profile.phone}</p>
          </div>
        </div>
      </div>

      <Modal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        onSave={saveProfile}
        title="Edit Personal Information"
        subtitle="Update your details to keep your profile up-to-date."
        wide
      >
        <div className="flex items-center gap-5 mb-6 pb-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-2xl font-bold">
              {draft.firstName?.[0]?.toUpperCase() || 'M'}
            </div>
            <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-600 soft-btn">
              <Camera size={14} />
            </button>
          </div>
          <div>
            <p className="font-semibold text-gray-900">Profile Picture</p>
            <p className="text-xs text-gray-500 mt-0.5">JPG, PNG or GIF. Max 2MB.</p>
            <button className="mt-2 flex items-center gap-1.5 text-xs font-medium text-emerald-600 hover:text-emerald-700">
              <Upload size={12} /> Upload new photo
            </button>
          </div>
        </div>

        <h4 className="text-sm font-semibold text-gray-700 mb-4">Profile Details</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            label="First Name"
            value={draft.firstName}
            onChange={(v) => setDraft({ ...draft, firstName: v })}
          />
          <FormField
            label="Last Name"
            value={draft.lastName}
            onChange={(v) => setDraft({ ...draft, lastName: v })}
          />
          <FormField
            label="Role"
            value={draft.role}
            onChange={(v) => setDraft({ ...draft, role: v })}
          />
          <FormField
            label="Location"
            value={draft.location}
            onChange={(v) => setDraft({ ...draft, location: v })}
          />
        </div>
      </Modal>

      <Modal
        isOpen={personalModalOpen}
        onClose={() => setPersonalModalOpen(false)}
        onSave={savePersonal}
        title="Edit Personal Information"
        subtitle="Update your contact details."
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            label="First Name"
            value={draft.firstName}
            onChange={(v) => setDraft({ ...draft, firstName: v })}
          />
          <FormField
            label="Last Name"
            value={draft.lastName}
            onChange={(v) => setDraft({ ...draft, lastName: v })}
          />
          <FormField
            label="Email address"
            type="email"
            value={draft.email}
            onChange={(v) => setDraft({ ...draft, email: v })}
            colSpan={2}
          />
          <FormField
            label="Phone"
            value={draft.phone}
            onChange={(v) => setDraft({ ...draft, phone: v })}
            colSpan={2}
          />
        </div>
      </Modal>

      {toast && (
        <div className="fixed bottom-6 right-6 bg-gray-900 text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-slideUp z-50">
          <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
            <Check size={12} />
          </div>
          <span className="text-sm font-medium">{toast}</span>
        </div>
      )}
    </div>
  );
}
