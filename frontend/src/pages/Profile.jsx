import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { uploadDriverDocsApi, requestDriverVerificationApi } from "../services/api";

export default function Profile() {
  const { user, refreshUser } = useContext(AuthContext);
  const { show: showToast } = useToast();
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    refreshUser();
  }, []);

  if (!user) return <div className="min-h-screen flex items-center justify-center">Please login to view profile.</div>;

  const calculateCompletion = () => {
    if (user.role !== 'driver') return 100;
    const docs = ['profilePicture', 'idProof', 'licenseProof', 'vehicleProof'];
    const uploadedCount = docs.filter(doc => user[doc]).length;
    // Initial 30% for registration details + 70% for documents (17.5% each)
    return 30 + (uploadedCount * 17.5);
  };

  const handleFileUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append(field, file);

    setUploading(true);
    try {
      const res = await uploadDriverDocsApi(formData);
      if (res.success) {
        showToast(`${field.replace(/([A-Z])/g, ' $1')} uploaded!`);
        refreshUser();
      }
    } catch (error) {
      showToast(error.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleVerifyNow = async () => {
    try {
      const res = await requestDriverVerificationApi();
      if (res.success) {
        showToast("Verification request submitted!");
        refreshUser();
      }
    } catch (error) {
      showToast(error.response?.data?.message || "Request failed");
    }
  };

  const completion = calculateCompletion();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-xl mx-auto">
        <div className="bg-white rounded-[2rem] overflow-hidden shadow-2xl shadow-indigo-100/50 border border-gray-100">
          <div className="h-32 bg-gradient-to-r from-indigo-600 to-purple-600"></div>
          <div className="px-8 pb-10">
            <div className="relative flex justify-center">
              <div className="absolute -top-16 w-32 h-32 bg-white rounded-3xl shadow-xl flex items-center justify-center text-5xl border-4 border-white overflow-hidden">
                {user.profilePicture ? (
                  <img src={user.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  "👤"
                )}
              </div>
            </div>
            
            <div className="mt-20 text-center">
              <div className="flex items-center justify-center gap-2">
                <h2 className="text-3xl font-black text-gray-900">{user.name}</h2>
                {user.role === 'driver' && user.isVerified && (
                  <span className="text-blue-500 text-xl" title="Verified Driver">✅</span>
                )}
              </div>
              <p className="text-gray-500 font-medium">{user.email}</p>
              <div className="mt-2 inline-block px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold uppercase tracking-widest">
                {user.role}
              </div>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-4">
              <div className="bg-amber-50 rounded-2xl p-6 text-center border border-amber-100 shadow-sm transition hover:shadow-md">
                <div className="text-3xl mb-1">⭐</div>
                <div className="text-2xl font-black text-amber-900">{user.rating?.toFixed(1) || '5.0'}</div>
                <div className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">User Rating</div>
              </div>
              {user.role === 'driver' ? (
                <div className="bg-green-50 rounded-2xl p-6 text-center border border-green-100 shadow-sm transition hover:shadow-md">
                  <div className="text-3xl mb-1">🚕</div>
                  <div className="text-2xl font-black text-green-900">{user.driverRating?.toFixed(1) || '4.7'}</div>
                  <div className="text-[10px] font-bold text-green-600 uppercase tracking-widest">Driver Rating</div>
                </div>
              ) : (
                <div className="bg-indigo-50 rounded-2xl p-6 text-center border border-indigo-100 shadow-sm transition hover:shadow-md">
                  <div className="text-3xl mb-1">📱</div>
                  <div className="text-sm font-black text-indigo-900">{user.mobile || 'Not set'}</div>
                  <div className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">Phone Number</div>
                </div>
              )}
            </div>

            {user.role === 'driver' && (
              <>
                <div className="mt-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 text-center">
                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Vehicle Details</p>
                   <p className="font-bold text-gray-800">{user.vehicle} • {user.vehicleNumber}</p>
                </div>

                <div className="mt-8 p-6 bg-indigo-50 rounded-[2rem] border border-indigo-100">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-black text-indigo-900 uppercase tracking-widest text-xs">Verification Status</h3>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      user.status === 'verified' ? 'bg-green-100 text-green-600' : 
                      user.status === 'pending' ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {user.status || 'unverified'}
                    </span>
                  </div>

                  <div className="mb-6">
                     <div className="flex justify-between text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-2">
                       <span>Profile Completion</span>
                       <span>{Math.round(completion)}%</span>
                     </div>
                     <div className="w-full bg-indigo-200 rounded-full h-2 overflow-hidden">
                       <div className="bg-indigo-600 h-full transition-all duration-500" style={{ width: `${completion}%` }}></div>
                     </div>
                  </div>

                  {user.status !== 'verified' && (
                    <div className="space-y-4">
                      {completion < 100 && (
                        <p className="text-xs text-indigo-700 font-medium">Complete your profile to 100% and get verified to receive rides.</p>
                      )}
                      
                      <div className="grid grid-cols-2 gap-3">
                        <DocUpload 
                          label="Photo" 
                          field="profilePicture" 
                          current={user.profilePicture} 
                          onUpload={handleFileUpload}
                          disabled={uploading || user.status === 'verified'}
                        />
                        <DocUpload 
                          label="ID Proof" 
                          field="idProof" 
                          current={user.idProof} 
                          onUpload={handleFileUpload}
                          disabled={uploading || user.status === 'verified'}
                        />
                        <DocUpload 
                          label="License" 
                          field="licenseProof" 
                          current={user.licenseProof} 
                          onUpload={handleFileUpload}
                          disabled={uploading || user.status === 'verified'}
                        />
                        <DocUpload 
                          label="Vehicle RC" 
                          field="vehicleProof" 
                          current={user.vehicleProof} 
                          onUpload={handleFileUpload}
                          disabled={uploading || user.status === 'verified'}
                        />
                      </div>
                      
                      {completion === 100 && user.status !== 'pending' && (
                         <button 
                          onClick={handleVerifyNow}
                          className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200"
                         >
                           Verify Now
                         </button>
                      )}

                      {user.status === 'pending' && (
                        <div className="p-4 bg-amber-50 text-amber-700 rounded-2xl text-xs font-bold text-center border border-amber-100">
                          Verification is pending. Please wait for admin approval.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </>
            )}

            <div className="mt-8 space-y-3">
              <button className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black transition shadow-lg shadow-gray-200">
                Edit Basic Info
              </button>
              <p className="text-center text-[10px] text-gray-400 font-medium uppercase tracking-tighter">
                Joined {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DocUpload({ label, field, current, onUpload, disabled }) {
  return (
    <div className={`relative p-4 rounded-2xl border-2 border-dashed transition-all ${
      current ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200 hover:border-indigo-300'
    }`}>
      <label className="cursor-pointer block text-center">
        <span className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{label}</span>
        {current ? (
          <span className="text-green-600 font-bold text-xs flex items-center justify-center gap-1">
            <span className="text-lg">✓</span> Uploaded
          </span>
        ) : (
          <span className="text-indigo-600 font-bold text-xs">Click to Upload</span>
        )}
        <input 
          type="file" 
          className="hidden" 
          onChange={(e) => onUpload(e, field)} 
          disabled={disabled}
          accept={field === 'profilePicture' ? "image/*" : "image/*,application/pdf"}
        />
      </label>
    </div>
  );
}
