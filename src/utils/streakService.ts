import { supabase } from '../lib/supabase';
import { toast } from 'sonner'; // Using sonner for toasts as structured in standard Vite projects

export interface StreakData {
  currentStreak: number;
  lastActiveDate: string | null; // "YYYY-MM-DD" style
  longestStreak: number;
  weekActivity: Record<string, boolean>;
}

// Helper to get local "YYYY-MM-DD" string
export function getLocalDateString(d: Date = new Date()): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Get day difference between two "YYYY-MM-DD" strings
export function getDaysDifference(dateStr1: string, dateStr2: string): number {
  const d1 = new Date(dateStr1);
  const d2 = new Date(dateStr2);
  d1.setHours(0, 0, 0, 0);
  d2.setHours(0, 0, 0, 0);
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Calculates user's updated streak on app load, managing the grace period and reset conditions.
 * Returns the updated StreakData and whether a warning toast is necessary.
 */
export function processStreakOnLoad(
  profile: any,
  todayStr: string = getLocalDateString()
): { streakData: StreakData; atRisk: boolean } {
  // Graceful fallback values
  let currentStreak = profile?.streak_count ?? 0;
  let lastActiveDate = profile?.last_activity_date ? profile.last_activity_date.split('T')[0] : null;
  let longestStreak = profile?.longest_streak ?? 0;
  let weekActivity = profile?.week_activity ?? {};

  // Handle case where properties are in camelCase or a raw streak object is parsed
  if (!lastActiveDate && profile?.lastActiveDate) {
    lastActiveDate = profile.lastActiveDate;
  }
  if (!currentStreak && profile?.currentStreak) {
    currentStreak = profile.currentStreak;
  }
  if (!longestStreak && profile?.longestStreak) {
    longestStreak = profile.longestStreak;
  }
  if (Object.keys(weekActivity).length === 0 && profile?.weekActivity) {
    weekActivity = profile.weekActivity;
  }

  // Ensure type compliance
  if (typeof weekActivity !== 'object' || weekActivity === null) {
    weekActivity = {};
  }

  let atRisk = false;

  if (!lastActiveDate) {
    // Brand new user or first time tracking streak
    return {
      streakData: { currentStreak: 0, lastActiveDate: null, longestStreak, weekActivity },
      atRisk: false
    };
  }

  const diff = getDaysDifference(lastActiveDate, todayStr);

  if (lastActiveDate === todayStr) {
    // Already earned today, streak is perfectly fine, no warning
    atRisk = false;
  } else if (diff === 1) {
    // Last earned was yesterday. Streak is active, meaning if they study today, it continues.
    atRisk = false;
  } else if (diff === 2) {
    // Grace period condition: Missed exactly 1 day (last active was 2 days ago).
    // We do NOT break the streak immediately. We flag it as at risk.
    atRisk = true;
  } else {
    // Missed 2+ consecutive days. Reset streak to 0.
    currentStreak = 0;
    atRisk = false;
  }

  // Update longest streak if necessary
  longestStreak = Math.max(longestStreak, currentStreak);

  return {
    streakData: { currentStreak, lastActiveDate, longestStreak, weekActivity },
    atRisk
  };
}

/**
 * Completes a streak credit for today.
 * Returns the updated StreakData.
 */
export function earnStreakToday(
  currentData: StreakData,
  todayStr: string = getLocalDateString()
): StreakData {
  const { currentStreak, lastActiveDate, longestStreak, weekActivity } = currentData;

  // If already accomplished today, don't double count
  if (lastActiveDate === todayStr) {
    return currentData;
  }

  let newStreak = currentStreak;

  if (!lastActiveDate) {
    // First streak day
    newStreak = 1;
  } else {
    const diff = getDaysDifference(lastActiveDate, todayStr);
    if (diff === 1 || diff === 2) {
      // Grace period or consecutive day -> count up
      newStreak = currentStreak + 1;
    } else {
      // Re-initialize streak to 1 if we came from cold starts / resets
      newStreak = 1;
    }
  }

  const newLongest = Math.max(longestStreak, newStreak);
  const newWeekActivity = { ...weekActivity, [todayStr]: true };

  return {
    currentStreak: newStreak,
    lastActiveDate: todayStr,
    longestStreak: newLongest,
    weekActivity: newWeekActivity
  };
}

/**
 * Syncs the updated streak details with Supabase and stores a backup in localStorage.
 * Includes a robust retry layer (retries once on failure).
 */
export async function syncStreakWithDatabase(
  uid: string,
  isGuest: boolean,
  streakData: StreakData,
  retryCount = 0
): Promise<boolean> {
  // Store a local backup to prevent progress loss
  localStorage.setItem(`streak_backup_${uid}`, JSON.stringify(streakData));

  if (isGuest || !uid || !supabase) {
    return true;
  }

  // Prepare database updates matching exact schema definition
  const updates = {
    streak_count: streakData.currentStreak,
    last_activity_date: streakData.lastActiveDate ? `${streakData.lastActiveDate}T00:00:00.000Z` : null,
    longest_streak: streakData.longestStreak,
    week_activity: streakData.weekActivity,
  };

  try {
    const { error } = await supabase
      .from('users')
      .update(updates)
      .eq('uid', uid);

    if (error) {
      // Check for columns not created in table yet to degrade gracefully
      if (error.message && (error.message.includes('longest_streak') || error.message.includes('week_activity'))) {
        console.warn('Database table missing detailed streak columns, attempting fallback save of streak_count...');
        // Graceful fallback to only saving standard elements
        const fallbackUpdates = {
          streak_count: streakData.currentStreak,
          last_activity_date: streakData.lastActiveDate ? `${streakData.lastActiveDate}T00:00:00.000Z` : null
        };
        const { error: fallbackError } = await supabase
          .from('users')
          .update(fallbackUpdates)
          .eq('uid', uid);
        
        if (fallbackError) throw fallbackError;
        return true;
      }
      throw error;
    }
    return true;
  } catch (err: any) {
    console.error(`Error syncing streak to Supabase (attempt ${retryCount + 1}):`, err);
    if (retryCount < 1) {
      // Wait 1.5s and retry exactly once as requested
      await new Promise(res => setTimeout(res, 1500));
      return syncStreakWithDatabase(uid, isGuest, streakData, retryCount + 1);
    }
    return false;
  }
}
