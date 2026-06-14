/**
 * ActiveTimeTracker
 * 
 * Monitors user interaction events to track active engagement.
 * Emits a "streakEarned" custom event when the user reaches 600 seconds (10 minutes)
 * of active engagement in a single day.
 * 
 * Local persistence preserves progress across page refreshes and route switches.
 */
export class ActiveTimeTracker {
  private uid: string;
  private activeSeconds: number = 0;
  private onStreakEarned: () => void;
  private intervalId: any = null;
  private isCompleted: boolean = false;
  private lastActivityTime: number = Date.now();
  private idleThresholdMs: number = 60000; // 60 seconds of inactivity = idle
  private goalSeconds: number = 600; // Default to 10 minutes

  constructor(uid: string, onStreakEarned: () => void, isAlreadyEarned: boolean, dailyGoalMinutes: number = 10) {
    this.uid = uid;
    this.onStreakEarned = onStreakEarned;
    this.isCompleted = isAlreadyEarned;
    
    // Fallback if NaN or invalid
    const minutes = typeof dailyGoalMinutes === 'number' && dailyGoalMinutes > 0 ? dailyGoalMinutes : 10;
    this.goalSeconds = minutes * 60;

    // Load previously accumulated active seconds for today from localStorage
    const todayStr = this.getTodayString();
    const saved = localStorage.getItem(`active_seconds_${this.uid}_${todayStr}`);
    
    if (saved) {
      this.activeSeconds = parseInt(saved, 10);
      if (this.activeSeconds >= this.goalSeconds) {
        this.isCompleted = true;
      }
    }

    if (!this.isCompleted) {
      this.startTracking();
    } else {
      // If already completed in storage/earlier, fire streakEarned safely in next thin execution tick
      setTimeout(() => {
        this.onStreakEarned();
      }, 500);
    }
  }

  private getTodayString(): string {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Resets last activity time when user interacts.
   */
  private handleUserInteraction = () => {
    this.lastActivityTime = Date.now();
  };

  /**
   * Begins listening to DOM interaction events and sets up the second tracker interval.
   */
  private startTracking() {
    const events = ['mousemove', 'click', 'scroll', 'keypress', 'touchstart'];
    events.forEach(event => {
      window.addEventListener(event, this.handleUserInteraction, { passive: true });
    });

    // Run active tracking ticker every 1 second
    this.intervalId = setInterval(() => {
      this.tick();
    }, 1000);
  }

  /**
   * Stops listening to DOM events and clears timers.
   */
  private stopTracking() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    const events = ['mousemove', 'click', 'scroll', 'keypress', 'touchstart'];
    events.forEach(event => {
      window.removeEventListener(event, this.handleUserInteraction);
    });
  }

  /**
   * Every second, verify if user satisfies active engagement conditions.
   */
  private tick() {
    if (this.isCompleted) {
      this.stopTracking();
      return;
    }

    // Determine duration since user's last interaction
    const now = Date.now();
    const isWithinEngagementWindow = (now - this.lastActivityTime) < this.idleThresholdMs;

    if (isWithinEngagementWindow) {
      this.activeSeconds++;
      
      const todayStr = this.getTodayString();
      // Periodically update cached state to survive browser reloads
      localStorage.setItem(`active_seconds_${this.uid}_${todayStr}`, this.activeSeconds.toString());

      // If progress hits the custom dynamic threshold
      if (this.activeSeconds >= this.goalSeconds) {
        this.isCompleted = true;
        this.stopTracking();
        this.onStreakEarned();
        
        // Dispatch global JavaScript custom event for secondary listeners
        const event = new CustomEvent('streakEarned', { 
          detail: { 
            activeSeconds: this.activeSeconds,
            uid: this.uid
          } 
        });
        window.dispatchEvent(event);
      }
    }
  }

  public getActiveSeconds(): number {
    return this.activeSeconds;
  }

  /**
   * Disables and tears down the tracker safely.
   */
  public destroy() {
    this.stopTracking();
  }
}
