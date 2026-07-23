"use client";

import Button from "@/components/ui/Button";
import { wedding } from "@/lib/constants";

function formatDate(date: Date) {
  return date
    .toISOString()
    .replace(/[-:]/g, "")
    .split(".")[0] + "Z";
}

export default function Calendar() {
  const start = formatDate(wedding.date);

  const end = formatDate(
    new Date(wedding.date.getTime() + 5 * 60 * 60 * 1000)
  );

  const url =
    `https://calendar.google.com/calendar/render?action=TEMPLATE` +
    `&text=${encodeURIComponent(
      `${wedding.bride} & ${wedding.groom} Wedding`
    )}` +
    `&dates=${start}/${end}` +
    `&location=${encodeURIComponent(wedding.address)}` +
    `&details=${encodeURIComponent(wedding.heroTitle)}`;

  return (
    <div className="mt-12 flex flex-wrap justify-center gap-4">
      <Button href={url} external>
        Add to Google Calendar
      </Button>

      <Button variant="outline" href="/invite.ics">
        Download Calendar Invite
      </Button>
    </div>
  );
}
