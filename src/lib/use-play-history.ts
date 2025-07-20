import { useUser } from "@clerk/nextjs";

export const usePlayHistory = () => {
  const { user } = useUser();

  const trackPlay = async (songId: string, completedPercentage: number = 0) => {
    if (!user?.id || !songId) return;

    try {
      await fetch("/api/play-history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          songId,
          completedPercentage,
        }),
      });

      // Trigger a custom event to notify other components of the play
      window.dispatchEvent(
        new CustomEvent("songPlayed", {
          detail: { songId, userId: user.id },
        })
      );
    } catch (error) {
      console.error("Error tracking play:", error);
    }
  };

  return { trackPlay };
};
