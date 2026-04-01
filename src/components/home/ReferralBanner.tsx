import { useEffect, useState, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export const ReferralBanner = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const refCode = searchParams.get("ref");
  const [referrer, setReferrer] = useState<{ name: string | null; avatar_url: string | null } | null>(null);

  useEffect(() => {
    if (!refCode) return;
    supabase
      .rpc("get_referrer_profile", { _ref_code: refCode })
      .then(({ data }) => {
        if (data && data.length > 0) {
          setReferrer({ name: data[0].first_name, avatar_url: data[0].avatar_url });
        }
      });
  }, [refCode]);

  const firstName = referrer?.name || null;

  if (!refCode || !referrer) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full bg-primary/5 border-b border-primary/20"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 border-2 border-primary/30">
            {referrer.avatar_url ? (
              <AvatarImage src={referrer.avatar_url} alt={firstName || "Referrer"} />
            ) : null}
            <AvatarFallback className="bg-primary/10 text-primary text-sm font-bold">
              {firstName?.[0]?.toUpperCase() || "?"}
            </AvatarFallback>
          </Avatar>
          <p className="text-sm font-medium text-foreground">
            <span className="font-semibold">{firstName}</span> invited you to ErasMatch! 🎉
          </p>
        </div>
        <Button
          size="sm"
          className="shrink-0 rounded-full"
          onClick={() => navigate(`/auth?mode=signup&ref=${refCode}`)}
        >
          Sign up free
        </Button>
      </div>
    </motion.div>
  );
};
