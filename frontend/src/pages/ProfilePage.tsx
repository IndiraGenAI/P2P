import { useEffect, useRef, useState } from 'react';
import {
  Camera,
  Check,
  ChevronRight,
  Eye,
  Loader2,
  Pencil,
  Upload,
  X,
} from 'lucide-react';
import { message } from 'antd';
import { Modal } from '@/components/ui/Modal';
import { FormField } from '@/components/ui/FormField';
import type { Profile } from '@/common/models';
import { useAppDispatch, useAppSelector } from '@/state/app.hooks';
import { authSelector } from '@/state/auth/auth.reducer';
import { fetchProfile } from '@/state/auth/auth.action';
import { editUserById } from '@/state/user/user.action';
import type { IAuthUser } from '@/services/auth/auth.model';
import commonService from '@/services/common/common.service';
import { StoragePath } from '@/utils/constants/constant';

const PROFILE_IMAGE_MAX_BYTES = 2 * 1024 * 1024; // 2 MB
const PROFILE_IMAGE_ACCEPT = 'image/png,image/jpeg,image/jpg,image/gif,image/webp';

const PLACEHOLDER_PROFILE: Profile = {
  id: undefined,
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  role: 'Team Member',
  location: '',
  image: null,
};

const buildProfileFromUser = (user: IAuthUser | null): Profile => {
  if (!user) return PLACEHOLDER_PROFILE;
  return {
    ...PLACEHOLDER_PROFILE,
    id: user.id,
    firstName: user.first_name ?? '',
    lastName: user.last_name ?? '',
    email: user.email ?? '',
    phone: user.phone ?? '',
    image: user.image ?? null,
  };
};

export function ProfilePage() {
  const dispatch = useAppDispatch();
  const { profile: authProfile } = useAppSelector(authSelector);
  const authUser = authProfile.data;

  const [profile, setProfile] = useState<Profile>(() =>
    buildProfileFromUser(authUser),
  );
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [personalModalOpen, setPersonalModalOpen] = useState(false);
  const [draft, setDraft] = useState<Profile>(profile);
  const [toast, setToast] = useState('');
  const [imageUploading, setImageUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  // The image S3 key that was already saved on the user when the
  // modal opened. Lets us decide whether replacing/removing should
  // delete the old file from S3 immediately (session-only orphan) or
  // be deferred to "save" (still persisted in the DB).
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [pendingDeleteKey, setPendingDeleteKey] = useState<string | null>(null);
  const [avatarPreviewOpen, setAvatarPreviewOpen] = useState(false);
  const imageInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!authUser) return;
    setProfile((prev) => ({
      ...prev,
      id: authUser.id,
      firstName: authUser.first_name ?? '',
      lastName: authUser.last_name ?? '',
      email: authUser.email ?? '',
      phone: authUser.phone ?? '',
      image: authUser.image ?? prev.image ?? null,
    }));
  }, [
    authUser?.id,
    authUser?.first_name,
    authUser?.last_name,
    authUser?.email,
    authUser?.phone,
    authUser?.image,
  ]);

  useEffect(() => {
    if (!avatarPreviewOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setAvatarPreviewOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [avatarPreviewOpen]);

  const openProfileModal = () => {
    setDraft(profile);
    setOriginalImage(profile.image);
    setPendingDeleteKey(null);
    setProfileModalOpen(true);
  };

  const openPersonalModal = () => {
    setDraft(profile);
    setPersonalModalOpen(true);
  };

  const closeProfileModal = () => {
    // Discard any newly-uploaded file that the user is abandoning.
    if (draft.image && draft.image !== originalImage) {
      void commonService.deleteS3File(draft.image);
    }
    setPendingDeleteKey(null);
    setProfileModalOpen(false);
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const handleProfileImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (event.target) event.target.value = '';
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      message.error('Please select an image file.');
      return;
    }
    if (file.size > PROFILE_IMAGE_MAX_BYTES) {
      message.error('Image must be 2 MB or smaller.');
      return;
    }

    setImageUploading(true);
    try {
      const result = await commonService.s3FileUpload(
        file,
        StoragePath.PROFILE_IMAGES,
      );
      if (result.data?.fileUrl) {
        const newKey = result.data.fileUrl;
        const previousKey = draft.image;
        if (previousKey && previousKey !== newKey) {
          if (previousKey === originalImage) {
            setPendingDeleteKey(previousKey);
          } else {
            void commonService.deleteS3File(previousKey);
          }
        }
        setDraft((prev) => ({ ...prev, image: newKey }));
        message.success('Profile image uploaded.');
      } else {
        message.error('Failed to upload profile image.');
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to upload profile image.';
      message.error(errorMessage);
    } finally {
      setImageUploading(false);
    }
  };

  const handleRemoveProfileImage = () => {
    const currentKey = draft.image;
    if (currentKey) {
      if (currentKey === originalImage) {
        setPendingDeleteKey(currentKey);
      } else {
        void commonService.deleteS3File(currentKey);
      }
    }
    setDraft((prev) => ({ ...prev, image: null }));
  };

  const persistDraftToBackend = async (
    next: Profile,
  ): Promise<boolean> => {
    if (!next.id) {
      message.error('Cannot save profile: missing user id.');
      return false;
    }
    setSaving(true);
    try {
      const action = await dispatch(
        editUserById({
          id: next.id,
          first_name: next.firstName,
          last_name: next.lastName,
          email: next.email,
          phone: next.phone,
          image: next.image,
        }),
      );
      if (editUserById.fulfilled.match(action)) {
        if (pendingDeleteKey && pendingDeleteKey !== next.image) {
          void commonService.deleteS3File(pendingDeleteKey);
        }
        setPendingDeleteKey(null);
        setOriginalImage(next.image);
        setProfile(next);
        // Refresh the auth profile so the avatar in the topbar / other
        // pages reflects the new image right away.
        void dispatch(fetchProfile());
        return true;
      }
      message.error('Failed to update profile.');
      return false;
    } finally {
      setSaving(false);
    }
  };

  const saveProfile = async () => {
    const ok = await persistDraftToBackend(draft);
    if (ok) {
      setProfileModalOpen(false);
      showToast('Profile updated successfully');
    }
  };

  const savePersonal = async () => {
    const ok = await persistDraftToBackend(draft);
    if (ok) {
      setPersonalModalOpen(false);
      showToast('Personal information updated');
    }
  };

  const fullName = `${profile.firstName} ${profile.lastName}`.trim();
  const initial = profile.firstName?.[0]?.toUpperCase() || 'M';
  const avatarUrl = commonService.resolvePublicUrl(profile.image);
  const draftAvatarUrl = commonService.resolvePublicUrl(draft.image);

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
            <div className="relative w-20 h-20 shrink-0 group">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-2xl font-bold overflow-hidden ring-1 ring-black/5">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={fullName || 'Profile avatar'}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  initial
                )}
              </div>
              {avatarUrl ? (
                <button
                  type="button"
                  onClick={() => setAvatarPreviewOpen(true)}
                  aria-label="View profile photo"
                  className="absolute inset-0 rounded-full flex items-center justify-center bg-black/45 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
                >
                  <Eye
                    size={22}
                    className="text-white drop-shadow-md"
                    strokeWidth={2}
                    aria-hidden
                  />
                </button>
              ) : null}
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 text-lg">{fullName}</h4>
              <p className="text-sm text-gray-500 mt-1">
                {profile.role} <span className="text-gray-300 mx-2"></span>
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
        onClose={closeProfileModal}
        onSave={saveProfile}
        saveLabel={saving ? 'Saving…' : 'Save Changes'}
        saveDisabled={saving || imageUploading}
        title="Edit Personal Information"
        subtitle="Update your details to keep your profile up-to-date."
        wide
      >
        <div className="flex items-center gap-5 mb-6 pb-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-2xl font-bold overflow-hidden">
              {draftAvatarUrl ? (
                <img
                  src={draftAvatarUrl}
                  alt="Profile preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                draft.firstName?.[0]?.toUpperCase() || 'M'
              )}
              {imageUploading && (
                <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                  <Loader2 size={18} className="animate-spin text-emerald-600" />
                </div>
              )}
            </div>
            <button
              type="button"
              aria-label="Upload new profile photo"
              onClick={() => imageInputRef.current?.click()}
              disabled={imageUploading}
              className="absolute -bottom-1 -right-1 w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-600 soft-btn disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <Camera size={14} />
            </button>
            <input
              ref={imageInputRef}
              type="file"
              accept={PROFILE_IMAGE_ACCEPT}
              onChange={handleProfileImageChange}
              className="hidden"
            />
          </div>
          <div>
            <p className="font-semibold text-gray-900">Profile Picture</p>
            <p className="text-xs text-gray-500 mt-0.5">JPG, PNG or GIF. Max 2MB.</p>
            <div className="mt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={() => imageInputRef.current?.click()}
                disabled={imageUploading}
                className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 hover:text-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <Upload size={12} />
                {draft.image ? 'Replace photo' : 'Upload new photo'}
              </button>
              {draft.image && !imageUploading && (
                <button
                  type="button"
                  onClick={handleRemoveProfileImage}
                  className="flex items-center gap-1.5 text-xs font-medium text-red-600 hover:text-red-700"
                >
                  <X size={12} /> Remove
                </button>
              )}
            </div>
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
        saveLabel={saving ? 'Saving…' : 'Save Changes'}
        saveDisabled={saving}
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

      {avatarPreviewOpen && avatarUrl ? (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/75 p-4 sm:p-8 animate-fadeIn"
          role="dialog"
          aria-modal="true"
          aria-label="Profile photo preview"
          onClick={() => setAvatarPreviewOpen(false)}
        >
          <button
            type="button"
            onClick={() => setAvatarPreviewOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition z-10"
            aria-label="Close preview"
          >
            <X size={22} />
          </button>
          <img
            src={avatarUrl}
            alt={fullName ? `${fullName} — full size` : 'Profile photo'}
            className="max-h-[min(85vh,900px)] max-w-full w-auto rounded-2xl object-contain shadow-2xl ring-1 ring-white/10"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      ) : null}

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
