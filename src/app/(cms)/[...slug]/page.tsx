import { notFound } from "next/navigation";
import { cmsComponents } from "../_components";

type PageProps = {
	params: Promise<{ slug: string[] }>;
};

export default async function CmsPage({ params }: PageProps) {
	const { slug } = await params;
	const pathSlug = slug?.[0] ?? "";

	const Component = cmsComponents[pathSlug];

	if (!Component) {
		notFound();
	}

	return <Component />;
}
