import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Users, 
  Search, 
  Filter, 
  ArrowUpDown, 
  MessageSquare, 
  Globe, 
  Award, 
  Calendar, 
  BookOpen, 
  Crown, 
  Loader2,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { format } from 'date-fns';

const COUNTRIES = [
  { name: 'Australia', flag: '🇦🇺', code: '+61' },
  { name: 'Belarus', flag: '🇧🇾', code: '+375' },
  { name: 'Brazil', flag: '🇧🇷', code: '+55' },
  { name: 'Canada', flag: '🇨🇦', code: '+1' },
  { name: 'China', flag: '🇨🇳', code: '+86' },
  { name: 'France', flag: '🇫🇷', code: '+33' },
  { name: 'Germany', flag: '🇩🇪', code: '+49' },
  { name: 'India', flag: '🇮🇳', code: '+91' },
  { name: 'Iran', flag: '🇮🇷', code: '+98' },
  { name: 'Kazakhstan', flag: '🇰🇿', code: '+7' },
  { name: 'Pakistan', flag: '🇵🇰', code: '+92' },
  { name: 'Russia', flag: '🇷🇺', code: '+7' },
  { name: 'Saudi Arabia', flag: '🇸🇦', code: '+966' },
  { name: 'South Africa', flag: '🇿🇦', code: '+27' },
  { name: 'Turkey', flag: '🇹🇷', code: '+90' },
  { name: 'United Kingdom', flag: '🇬🇧', code: '+44' },
  { name: 'United States', flag: '🇺🇸', code: '+1' },
  { name: 'Uzbekistan', flag: '🇺🇿', code: '+998' }
];

const MOCK_PROFILES = [
  {
    uid: "mock1",
    displayName: "Anara Ismoilova",
    country: "Uzbekistan",
    learning_reason: "🎓 Rossotrudnichestvo Scholarship",
    bio: "HSE International Relations freshman. Excited to move to Moscow!",
    streak_count: 24,
    lessons_completed: { day_1: true, day_2: true, day_3: true, day_4: true, day_5: true, day_6: true, day_7: true, day_8: true, day_9: true, day_10: true, day_11: true, day_12: true },
    createdAt: "2026-05-15T12:00:00Z",
    isPremium: true,
    avatar_url: ""
  },
  {
    uid: "mock2",
    displayName: "Julian Kaiser",
    country: "Germany",
    learning_reason: "❤️ Russian Culture & Literature",
    bio: "Reading Dostoyevsky in original Russian is my lifetime goal. Let's exchange languages!",
    streak_count: 5,
    lessons_completed: { day_1: true, day_2: true },
    createdAt: "2026-06-01T10:30:00Z",
    isPremium: false,
    avatar_url: ""
  },
  {
    uid: "mock3",
    displayName: "Darya Surova",
    country: "Russia",
    learning_reason: "💬 Learning for Fun",
    bio: "Helping scholarship winners practice speaking and feel welcome in HSE dormitory!",
    streak_count: 42,
    lessons_completed: { day_1: true, day_2: true, day_3: true, day_4: true, day_5: true, day_6: true, day_7: true, day_8: true, day_9: true, day_10: true, day_11: true, day_12: true, day_13: true, day_14: true, day_15: true, day_16: true },
    createdAt: "2026-04-10T14:45:00Z",
    isPremium: true,
    avatar_url: ""
  },
  {
    uid: "mock4",
    displayName: "Misbah Rehman",
    country: "Pakistan",
    learning_reason: "🎓 HSE University Scholarship",
    bio: "Applied Computer Science scholar. Let's study Cyrillic and Yandex together!",
    streak_count: 14,
    lessons_completed: { day_1: true, day_2: true, day_3: true, day_4: true, day_5: true },
    createdAt: "2026-05-20T08:15:00Z",
    isPremium: true,
    avatar_url: ""
  },
  {
    uid: "mock5",
    displayName: "Hannah Schmidt",
    country: "Germany",
    learning_reason: "🎓 Open Doors Scholarship",
    bio: "Biomaterials researcher. HSE Moscow-bound!",
    streak_count: 19,
    lessons_completed: { day_1: true, day_2: true, day_3: true, day_4: true, day_5: true, day_6: true },
    createdAt: "2026-05-28T16:00:00Z",
    isPremium: false,
    avatar_url: ""
  }
];

export function CommunityView({ onTotalCountLoaded }: { onTotalCountLoaded?: (count: number) => void }) {
  // Initialize with mock profiles immediately to prevent empty/blank states and provide instant interactive design
  const [members, setMembers] = useState<any[]>(() => {
    const list = MOCK_PROFILES.map(m => ({
      ...m,
      lessons_completed_count: Object.keys(m.lessons_completed || {}).length
    }));
    return list;
  });
  const [loading, setLoading] = useState(true);
  
  // Searching, Filtering, Sorting states
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'scholarship' | 'country'>('all');
  const [filterCountryName, setFilterCountryName] = useState('All');
  const [sortRule, setSortRule] = useState<'newest' | 'streak' | 'lessons'>('newest');

  // Trigger default total count load immediately
  useEffect(() => {
    onTotalCountLoaded?.(members.length);
  }, []);

  // Load profiles from database with a fast networking fallback race
  useEffect(() => {
    async function fetchAllProfiles() {
      if (!supabase) {
        setLoading(false);
        return;
      }

      try {
        // Query users with a strict 2-second network timeout race to prevent infinite hanging
        const fetchPromise = supabase
          .from('users')
          .select('*');

        const timeoutPromise = new Promise<any>((_, reject) =>
          setTimeout(() => reject(new Error('Supabase request timed out after 2 seconds')), 2000)
        );

        const { data, error } = await Promise.race([fetchPromise, timeoutPromise]);

        if (error) throw error;

        if (data && data.length > 0) {
          // Map profiles to standard format safely
          const formattedDbData = data.map(dbUser => {
            let lessons: Record<string, any> = {};
            if (dbUser.lessons_completed) {
              if (typeof dbUser.lessons_completed === 'object') {
                lessons = dbUser.lessons_completed;
              } else if (typeof dbUser.lessons_completed === 'string') {
                try {
                  lessons = JSON.parse(dbUser.lessons_completed);
                } catch (e) {
                  console.warn('Failed parsing lessons_completed column JSON string:', e);
                }
              }
            }
            const lessonsCount = typeof lessons === 'object' && lessons ? Object.keys(lessons).length : 0;
            return {
              uid: dbUser.uid,
              displayName: dbUser.displayName || dbUser.email?.split('@')[0] || 'Scholar',
              country: dbUser.country || '',
              learning_reason: dbUser.learning_reason || '',
              bio: dbUser.bio || '',
              streak_count: dbUser.streak_count || 0,
              lessons_completed_count: lessonsCount,
              lessons_completed: lessons,
              createdAt: dbUser.createdAt || dbUser.trialStartDate || new Date().toISOString(),
              isPremium: dbUser.isPremium || dbUser.is_premium || false,
              avatar_url: dbUser.avatar_url || ''
            };
          });

          // Mix in original curated mock accounts to guarantee rich user density
          const activeMockList = MOCK_PROFILES.filter(
            mock => !formattedDbData.some(db => {
              const dbName = (db.displayName || '').trim().toLowerCase();
              const mockName = (mock.displayName || '').trim().toLowerCase();
              return dbName === mockName || db.uid === mock.uid;
            })
          );
          
          const fullList = [
            ...formattedDbData, 
            ...activeMockList.map(m => ({
              ...m,
              lessons_completed_count: Object.keys(m.lessons_completed || {}).length
            }))
          ];

          setMembers(fullList);
          onTotalCountLoaded?.(fullList.length);
        } else {
          // No live users in database, display baseline community entries
          const list = MOCK_PROFILES.map(m => ({
            ...m,
            lessons_completed_count: Object.keys(m.lessons_completed || {}).length
          }));
          setMembers(list);
          onTotalCountLoaded?.(list.length);
        }
      } catch (err) {
        console.warn('Supabase profile query failed, using baseline fallback community list:', err);
        const list = MOCK_PROFILES.map(m => ({
          ...m,
          lessons_completed_count: Object.keys(m.lessons_completed || {}).length
        }));
        setMembers(list);
        onTotalCountLoaded?.(list.length);
      } finally {
        setLoading(false);
      }
    }

    fetchAllProfiles();
  }, []);

  // Filter & Search Logic
  const filteredMembers = members.filter(member => {
    // 1. Search Query
    const nameMatch = member.displayName?.toLowerCase().includes(searchQuery.toLowerCase());
    const countryMatch = member.country?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchSearch = nameMatch || countryMatch;

    if (!matchSearch) return false;

    // 2. Filter Category Type
    if (filterType === 'scholarship') {
      const reasonStr = member.learning_reason || '';
      return reasonStr.includes('Scholarship') || reasonStr.includes('🎓');
    }

    if (filterType === 'country' && filterCountryName !== 'All') {
      return member.country === filterCountryName;
    }

    return true;
  });

  // Sorting Logic
  const sortedMembers = [...filteredMembers].sort((a, b) => {
    if (sortRule === 'newest') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    if (sortRule === 'streak') {
      return (b.streak_count || 0) - (a.streak_count || 0);
    }
    if (sortRule === 'lessons') {
      const countA = a.lessons_completed_count || 0;
      const countB = b.lessons_completed_count || 0;
      return countB - countA;
    }
    return 0;
  });

  // Get active countries that have members
  const activeCountries = Array.from(new Set(members.map(m => m.country).filter(Boolean)));

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Header bar */}
      <div className="p-4 md:p-6 border-b border-neutral-100 bg-white space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-light tracking-tight flex items-center gap-2">
              Scholar <span className="font-serif italic text-orange-600">Community</span>
              <Badge className="bg-orange-50 text-orange-600 hover:bg-orange-50 border border-orange-200 text-xs py-0 px-2 font-bold select-none rounded-full ml-1">
                {members.length} Members
              </Badge>
            </h2>
            <p className="text-neutral-500 text-xs mt-1">Connect with other global scholars pursuing Russian university entrance exams.</p>
          </div>
        </div>

        {/* Search & Filtration Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-2">
          {/* Search Input */}
          <div className="relative md:col-span-5">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
            <Input
              placeholder="Search members by name or country..."
              className="pl-10 rounded-xl bg-white border border-neutral-200 focus:ring-orange-500 text-sm h-11"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Filter Category Tabs */}
          <div className="flex bg-neutral-100 p-1 rounded-xl md:col-span-4 h-11">
            <button
              onClick={() => { setFilterType('all'); }}
              className={`flex-1 text-xs font-bold rounded-lg transition-all ${filterType === 'all' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-900'}`}
            >
              All
            </button>
            <button
              onClick={() => { setFilterType('scholarship'); }}
              className={`flex-1 text-xs font-bold rounded-lg transition-all ${filterType === 'scholarship' ? 'bg-white text-orange-700 shadow-sm' : 'text-neutral-500 hover:text-neutral-900'}`}
            >
              Scholarships 🎓
            </button>
            <button
              onClick={() => { setFilterType('country'); }}
              className={`flex-1 text-xs font-bold rounded-lg transition-all ${filterType === 'country' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-900'}`}
            >
              By Country 🌍
            </button>
          </div>

          {/* Sub Country Selection or Sorting */}
          <div className="relative md:col-span-3 flex gap-2">
            {filterType === 'country' ? (
              <select
                value={filterCountryName}
                onChange={(e) => setFilterCountryName(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 bg-white text-xs font-bold text-neutral-800 focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer appearance-none"
              >
                <option value="All">All Countries</option>
                {activeCountries.map(name => {
                  const countryObj = COUNTRIES.find(c => c.name === name);
                  const flag = countryObj ? countryObj.flag : '';
                  return (
                    <option key={name} value={name}>
                      {flag} {name}
                    </option>
                  );
                })}
              </select>
            ) : (
              <select
                value={sortRule}
                onChange={(e) => setSortRule(e.target.value as any)}
                className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 bg-white text-xs font-bold text-neutral-800 focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
              >
                <option value="newest">Sort: Newest Members</option>
                <option value="streak">Sort: Longest Streak</option>
                <option value="lessons">Sort: Most Lessons Completed</option>
              </select>
            )}
          </div>
        </div>
      </div>

      {/* Grid of cards area */}
      <div className="flex-1 overflow-y-auto bg-neutral-50/50 p-4 md:p-6 pb-28 md:pb-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-3">
            <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
            <p className="text-neutral-400 text-xs">Loading active scholar directory...</p>
          </div>
        ) : sortedMembers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-7xl mx-auto">
            {sortedMembers.map((member) => {
              const countryObj = COUNTRIES.find(c => c.name === member.country);
              const flag = countryObj ? countryObj.flag : '';
              
              // Lessons completing calculations
              const lessonsDone = member.lessons_completed_count || 0;
              
              // Joined formatted
              const joinedString = member.createdAt 
                ? format(new Date(member.createdAt), 'MMM yyyy') 
                : 'N/A';

              const isUserPremium = member.isPremium || false;

              return (
                <Card 
                  key={member.uid} 
                  className="bg-white border border-neutral-100 rounded-2xl md:rounded-[24px] shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col justify-between group h-full relative"
                >
                  <CardContent className="p-5 flex flex-col items-center text-center space-y-4 flex-1">
                    {/* Header elements: Premium badges */}
                    <div className="absolute top-4 right-4 flex gap-1 z-10">
                      {isUserPremium ? (
                        <Badge className="bg-orange-500 text-white font-bold text-[8px] tracking-wide rounded-full py-0.5 px-2 select-none uppercase flex items-center gap-0.5 shadow-sm">
                          <Crown className="w-2.5 h-2.5" /> Elite
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-neutral-50 text-neutral-400 border border-neutral-150 font-bold text-[8px] rounded-full py-0">
                          Basic
                        </Badge>
                      )}
                    </div>

                    {/* Circular Avatar with country overlay */}
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-neutral-100 bg-neutral-50 select-none flex items-center justify-center shadow-md">
                        {member.avatar_url ? (
                          <img 
                            src={member.avatar_url} 
                            alt={member.displayName} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-orange-100 flex items-center justify-center text-orange-600 font-serif font-bold text-xl uppercase">
                            {member.displayName?.slice(0, 1).toUpperCase() || 'S'}
                          </div>
                        )}
                      </div>
                      
                      {flag && (
                        <div className="absolute -bottom-1 -right-1 bg-white border border-neutral-100 rounded-full w-6 h-6 flex items-center justify-center text-xs shadow-md select-none">
                          {flag}
                        </div>
                      )}
                    </div>

                    <div className="space-y-1 w-full">
                      <h3 className="font-bold text-sm text-neutral-900 group-hover:text-orange-600 transition-colors truncate px-2">
                        {member.displayName}
                      </h3>
                      {member.country && (
                        <p className="text-[10px] text-neutral-400 font-bold flex items-center justify-center gap-1 uppercase tracking-wide">
                          <Globe className="w-3 h-3" />
                          {member.country}
                        </p>
                      )}
                    </div>

                    {/* Reason Tag */}
                    {member.learning_reason && (
                      <div className="px-3 py-1.5 bg-neutral-50 rounded-xl border border-neutral-100 w-full max-w-[280px]">
                        <p className="text-[10px] md:text-xs font-medium text-neutral-600 truncate flex items-center justify-center gap-1.5">
                          {member.learning_reason}
                        </p>
                      </div>
                    )}

                    {/* Bio */}
                    {member.bio ? (
                      <p className="text-neutral-500 text-xs leading-relaxed max-w-[240px] italic font-light line-clamp-2">
                        "{member.bio}"
                      </p>
                    ) : (
                      <p className="text-neutral-300 text-xs italic font-light">No bio added yet.</p>
                    )}

                    {/* Performance metrics row */}
                    <div className="grid grid-cols-2 gap-2 w-full pt-4 border-t border-neutral-100 text-left">
                      <div className="space-y-0.5 pl-2 leading-none">
                        <span className="text-[9px] uppercase font-bold tracking-wider text-neutral-400 block">Streak</span>
                        <span className="text-xs font-bold text-orange-600 flex items-center gap-1 mt-1">
                          🔥 {member.streak_count} Days
                        </span>
                      </div>
                      <div className="space-y-0.5 border-l border-neutral-100 pl-4 leading-none">
                        <span className="text-[9px] uppercase font-bold tracking-wider text-neutral-400 block">Practice</span>
                        <span className="text-xs font-bold text-neutral-700 flex items-center gap-1 mt-1">
                          <BookOpen className="w-3.5 h-3.5 text-neutral-400" /> 
                          {lessonsDone} Completed
                        </span>
                      </div>
                    </div>
                  </CardContent>

                  {/* Message button with Tooltip constraint */}
                  <div className="p-4 pt-0 border-t border-neutral-50 bg-neutral-50/20 group/btn relative">
                    <Button 
                      disabled
                      className="w-full bg-neutral-100 hover:bg-neutral-150 text-neutral-400 font-bold text-xs h-9 rounded-xl border border-neutral-200 mt-3 relative flex items-center justify-center gap-1.5 cursor-not-allowed group-hover:bg-neutral-100"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      Message 
                    </Button>
                    
                    {/* Tooltip Overlay */}
                    <div className="absolute left-1/2 -translate-x-1/2 bottom-12 bg-neutral-900 border border-neutral-800 text-white rounded-lg px-2.5 py-1 text-[10px] font-bold shadow-lg opacity-0 pointer-events-none group-hover/btn:opacity-100 transition-opacity duration-200 whitespace-nowrap z-20 flex items-center gap-1">
                      <span>Chat coming soon! 💬</span>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-white border border-dashed border-neutral-200 rounded-3xl max-w-md mx-auto">
            <Users className="w-12 h-12 text-neutral-200 mx-auto mb-3 animate-pulse" />
            <h3 className="text-lg font-bold">No active scholars found</h3>
            <p className="text-neutral-400 text-xs mt-1">Try modifying your search text or country dropdown filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
