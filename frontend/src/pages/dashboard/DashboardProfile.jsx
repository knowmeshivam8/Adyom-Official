import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { User, Mail, Phone, MapPin, Shield, Building2, Heart, FileText } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

export default function DashboardProfile() {
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    
    // Local state for editable fields
    const [localData, setLocalData] = useState({
        organization: user?.organization || '',
        bio: user?.bio || '',
        interests: user?.interests ? user.interests.join(', ') : '',
    });

    // Load from local storage on mount
    useEffect(() => {
        if (user?._id) {
            const savedData = localStorage.getItem(`adyom_profile_${user._id}`);
            if (savedData) {
                try {
                    setLocalData(JSON.parse(savedData));
                } catch (e) {
                    console.error("Failed to parse local profile data", e);
                }
            }
        }
    }, [user?._id]);

    const handleSave = () => {
        if (user?._id) {
            localStorage.setItem(`adyom_profile_${user._id}`, JSON.stringify(localData));
        }
        setIsEditing(false);
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <h1 className="text-3xl font-heading font-bold text-heritage-terracottaDark">
                My Profile
            </h1>
            
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                        <User className="w-5 h-5 text-heritage-gold" />
                        Personal Information
                    </CardTitle>
                    <p className="text-sm text-red-500 font-medium mt-2">
                        * Note: Core personal information is not editable.
                    </p>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-20 h-20 rounded-full bg-heritage-terracotta flex items-center justify-center text-white text-3xl font-heading font-bold">
                            {user?.name?.charAt(0) || 'U'}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">{user?.name}</h2>
                            <p className="text-gray-500 capitalize flex items-center gap-1">
                                <Shield className="w-4 h-4" /> {user?.role === 'member' ? 'User' : (user?.role || 'User')}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                <Input 
                                    className="pl-9 bg-gray-50" 
                                    value={user?.name || ''} 
                                    readOnly={true}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                <Input 
                                    className="pl-9 bg-gray-50" 
                                    value={user?.email || ''} 
                                    readOnly={true}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Phone Number</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                <Input 
                                    className="pl-9 bg-gray-50" 
                                    placeholder="Not provided"
                                    value={user?.phone || ''} 
                                    readOnly={true}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Location</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                <Input 
                                    className="pl-9 bg-gray-50" 
                                    placeholder="Not provided"
                                    value={user?.location || 'Not provided'} 
                                    readOnly={true}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Organization / School</label>
                            <div className="relative">
                                <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                <Input 
                                    className={`pl-9 ${!isEditing ? 'bg-gray-50' : ''}`}
                                    placeholder="Not provided"
                                    value={localData.organization} 
                                    onChange={(e) => setLocalData({...localData, organization: e.target.value})}
                                    readOnly={!isEditing}
                                />
                            </div>
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-medium text-gray-700">Bio / About Me</label>
                            <div className="relative">
                                <Textarea 
                                    className={`${!isEditing ? 'bg-gray-50' : ''} min-h-[100px] resize-none`}
                                    placeholder="No bio provided"
                                    value={localData.bio} 
                                    onChange={(e) => setLocalData({...localData, bio: e.target.value})}
                                    readOnly={!isEditing}
                                />
                            </div>
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-medium text-gray-700">Interests</label>
                            {isEditing ? (
                                <div className="relative">
                                    <Input 
                                        placeholder="E.g. folk-art, painting, mindfulness (comma separated)"
                                        value={localData.interests} 
                                        onChange={(e) => setLocalData({...localData, interests: e.target.value})}
                                    />
                                </div>
                            ) : (
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {localData.interests ? (
                                        localData.interests.split(',').map((interest, idx) => {
                                            const trimmed = interest.trim();
                                            if (!trimmed) return null;
                                            return (
                                                <div key={idx} className="px-3 py-1 bg-heritage-cream rounded-full text-xs font-medium text-heritage-brown border border-heritage-creamDark capitalize">
                                                    {trimmed.replace('-', ' ')}
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <p className="text-sm text-gray-500 bg-gray-50 w-full px-3 py-2 rounded-md border border-gray-200">No interests provided</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        {isEditing ? (
                            <div className="space-x-3">
                                <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                                <Button variant="gold" onClick={handleSave}>Save Locally</Button>
                            </div>
                        ) : (
                            <Button variant="outlineGold" onClick={() => setIsEditing(true)}>Edit Preferences</Button>
                        )}
                    </div>


                </CardContent>
            </Card>
        </div>
    );
}
