/**
 * Mobile Audio Utilities
 * Handles mobile browser autoplay restrictions and provides better UX
 */

export interface MobileAudioState {
  isUnlocked: boolean;
  hasInteracted: boolean;
  showPlayPrompt: boolean;
}

export class MobileAudioManager {
  private static instance: MobileAudioManager;
  private audioContext: AudioContext | null = null;
  private isUnlocked = false;
  private hasUserInteracted = false;
  private callbacks: Array<() => void> = [];

  static getInstance(): MobileAudioManager {
    if (!MobileAudioManager.instance) {
      MobileAudioManager.instance = new MobileAudioManager();
    }
    return MobileAudioManager.instance;
  }

  isMobileDevice(): boolean {
    if (typeof window === "undefined") return false;
    return /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  }

  isAudioUnlocked(): boolean {
    return this.isUnlocked || !this.isMobileDevice();
  }

  hasUserInteraction(): boolean {
    return this.hasUserInteracted || !this.isMobileDevice();
  }

  async unlockAudio(): Promise<boolean> {
    if (this.isUnlocked || !this.isMobileDevice()) return true;

    try {
      // Method 1: Try Web Audio API
      if (!this.audioContext) {
        const AudioContextClass =
          window.AudioContext ||
          (
            window as typeof window & {
              webkitAudioContext: typeof AudioContext;
            }
          ).webkitAudioContext;
        this.audioContext = new AudioContextClass();
      }

      if (this.audioContext.state === "suspended") {
        await this.audioContext.resume();
      }

      // Method 2: Play silent audio
      const silentAudio = new Audio(
        "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBDuBzvLZiDYIF2m98OWhTgwNVKfo6KlUFApGnt/yvmwjBDqPz/LZhzUGG2i47+OeSwsNV6Tn6KlSFAlFnt/yv2skBDuGz/LYhzQIGGi49+OSUQoOVKXl8KtRGAhCnN/xv2wkBjaOzvLZhzUGG2i59uOeSwsOV6Tl8KxQFwlFnt/yv2wkBTuEz/LZhzUGG2i49+OeSwsNVqXl8KtQFQhFnt7yv2oj"
      );
      silentAudio.volume = 0;
      await silentAudio.play();
      silentAudio.pause();
      silentAudio.remove();

      this.isUnlocked = true;
      this.hasUserInteracted = true;

      // Notify all callbacks
      this.callbacks.forEach((callback) => callback());

      console.log("✅ Mobile audio context unlocked");
      return true;
    } catch (error) {
      console.warn("❌ Failed to unlock audio context:", error);
      return false;
    }
  }

  onAudioUnlock(callback: () => void): () => void {
    this.callbacks.push(callback);

    // Return cleanup function
    return () => {
      const index = this.callbacks.indexOf(callback);
      if (index > -1) {
        this.callbacks.splice(index, 1);
      }
    };
  }

  setupGlobalUnlock(): () => void {
    if (!this.isMobileDevice() || this.isUnlocked) {
      return () => {}; // No-op cleanup
    }

    const handleInteraction = () => {
      this.unlockAudio();
      cleanup();
    };

    const events = ["click", "touchend", "keydown"];
    events.forEach((event) => {
      document.addEventListener(event, handleInteraction, {
        once: true,
        passive: true,
      });
    });

    const cleanup = () => {
      events.forEach((event) => {
        document.removeEventListener(event, handleInteraction);
      });
    };

    return cleanup;
  }

  async prepareAudioForPlayback(
    audioElement: HTMLAudioElement
  ): Promise<boolean> {
    if (!this.isMobileDevice()) return true;

    try {
      // Ensure audio context is unlocked
      await this.unlockAudio();

      // Pre-load metadata
      audioElement.preload = "metadata";
      audioElement.load();

      return true;
    } catch (error) {
      console.warn("Failed to prepare audio for playback:", error);
      return false;
    }
  }

  showMobilePlayToast(): void {
    if (!this.isMobileDevice()) return;

    // Create toast notification
    const toast = document.createElement("div");
    toast.innerHTML = `
      <div style="
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        font-size: 14px;
        z-index: 9999;
        pointer-events: none;
        animation: fadeInOut 2s ease-in-out;
      ">
        📱 Tap the play button to start music
      </div>
    `;

    // Add fade animation
    const style = document.createElement("style");
    style.textContent = `
      @keyframes fadeInOut {
        0%, 100% { opacity: 0; }
        20%, 80% { opacity: 1; }
      }
    `;
    document.head.appendChild(style);
    document.body.appendChild(toast);

    // Remove after animation
    setTimeout(() => {
      document.body.removeChild(toast);
      document.head.removeChild(style);
    }, 2000);
  }
}

export const mobileAudio = MobileAudioManager.getInstance();
