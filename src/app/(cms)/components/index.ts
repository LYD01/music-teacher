import type { ComponentType } from "react";
import BlogContent from "./BlogContent";
import CommunityContent from "./CommunityContent";
import DocsContent from "./DocsContent";
import SampleContent from "./SampleContent";

export const cmsComponents: Record<string, ComponentType> = {
	docs: DocsContent,
	community: CommunityContent,
	blog: BlogContent,
	sample: SampleContent,
};

export { BlogContent, CommunityContent, DocsContent, SampleContent };
