// Parallel route: recent activity feed (default slot)
// Loads independently alongside @progress

import { HistoryFeed } from "@/components/dashboard/HistoryFeed";

export default function HistorySlot() {
	// TODO: Fetch recent activities from DB
	return <HistoryFeed activities={[]} />;
}
