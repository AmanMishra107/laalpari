import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

/**
 * Live count of people currently on the site, via realtime presence.
 * No table needed — presence state lives in the realtime channel.
 */
export function useLiveViewers() {
  const [count, setCount] = useState(1);

  useEffect(() => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const channel = supabase.channel("buswtf-travellers", {
      config: { presence: { key: id } },
    });

    const sync = () => {
      const state = channel.presenceState();
      setCount(Math.max(1, Object.keys(state).length));
    };

    channel
      .on("presence", { event: "sync" }, sync)
      .on("presence", { event: "join" }, sync)
      .on("presence", { event: "leave" }, sync)
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          void channel.track({ boarded_at: new Date().toISOString() });
        }
      });

    return () => {
      void supabase.removeChannel(channel);
    };
  }, []);

  return count;
}
