export function createNotificationPolling({ getUpdates, onNotifications, onMessages, onError, intervalMs = 10000 }) {
  let timer = null;
  let inFlight = false;
  let stopped = false;

  const refresh = async () => {
    if (stopped || inFlight) return false;
    inFlight = true;
    try {
      const result = await getUpdates();
      if (result.notifications) onNotifications(result.notifications);
      if (result.messages) onMessages(result.messages);
      return true;
    } catch (error) {
      onError?.(error);
      return false;
    } finally {
      inFlight = false;
    }
  };

  return {
    refresh,
    start() {
      stopped = false;
      void refresh();
      timer = window.setInterval(() => void refresh(), intervalMs);
    },
    stop() {
      stopped = true;
      if (timer !== null) window.clearInterval(timer);
      timer = null;
    },
  };
}
