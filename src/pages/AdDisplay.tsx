import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import { Advertisement, AdvertisementPlacement, fetchAdvertisements } from "@/lib/api";
import { Button } from "@/components/ui/button";

type Props = {
  placement: AdvertisementPlacement;
  modal?: boolean;
  onContinue?: () => void;
};

const dismissedKey = (id: number) => `mycloud-ad-dismissed-${id}`;

export default function AdDisplay({ placement, modal = false, onContinue }: Props) {
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    fetchAdvertisements(placement).then(setAds).catch(console.error);
  }, [placement]);

  const ad = useMemo(
    () => ads.find((item) => {
      const raw = localStorage.getItem(dismissedKey(item.id));
      if (!raw) return true;
      const until = Number(raw);
      return !Number.isFinite(until) || Date.now() > until;
    }),
    [ads],
  );

  if (!ad || closed) return null;

  const close = () => {
    if (ad.closeable) {
      const hours = Math.max(1, ad.dismiss_for_hours || 12);
      localStorage.setItem(dismissedKey(ad.id), String(Date.now() + hours * 3600_000));
    }
    setClosed(true);
    onContinue?.();
  };

  const media = ad.media_type === "video" ? (
    <video
      src={ad.media_url || undefined}
      autoPlay
      muted
      playsInline
      loop
      className="max-h-72 w-full rounded-2xl object-cover"
    />
  ) : (
    <img
      src={ad.media_url || undefined}
      alt={ad.title}
      className="max-h-72 w-full rounded-2xl object-cover"
    />
  );

  const content = (
    <div className="relative overflow-hidden rounded-[1.5rem] border bg-card p-3 shadow-lg">
      {ad.closeable && (
        <Button
          type="button"
          size="icon"
          variant="secondary"
          className="absolute left-3 top-3 z-10 h-9 w-9 rounded-full"
          onClick={close}
          aria-label="بستن تبلیغ"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
      <a
        href={ad.link_url || "#"}
        target={ad.link_url ? "_blank" : undefined}
        rel="noopener noreferrer"
        onClick={(event) => !ad.link_url && event.preventDefault()}
      >
        {media}
        <div className="px-2 pb-1 pt-3">
          <p className="text-xs font-black text-blue-600">اسپانسر</p>
          <p className="mt-1 font-black">{ad.title}</p>
        </div>
      </a>
      {modal && (
        <Button className="mt-3 w-full rounded-xl" onClick={close}>
          ادامه و مشاهده محتوا
        </Button>
      )}
    </div>
  );

  if (!modal) return content;

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg">{content}</div>
    </div>
  );
}
