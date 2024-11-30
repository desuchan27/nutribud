"use client";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import Link from "next/link";

// ----------------------------------------------------------------------

interface RecipePaginationProps {
	page: number;
	totalPages: number;
}

export default function RecipePagination({ page, totalPages }: RecipePaginationProps) {
	const searchParams = useSearchParams();
	const params = new URLSearchParams(searchParams);
	params.delete("page");
	const queryParams = !!params.toString() ? "&" + params.toString() : "";

	return (
		<div className="flex items-center justify-center py-8 gap-4">
			<Link
				className={cn("px-3 py-2 border rounded-md", page <= 1 && "pointer-events-none opacity-50")}
				href={`/home?${queryParams}`}
				aria-disabled={page === 1}>
				First
			</Link>
			<Link
				className={cn("px-3 py-2 border rounded-md", page <= 1 && "pointer-events-none opacity-50")}
				href={`/home?page=${page - 1}${queryParams}`}
				aria-disabled={page > 1}>
				Previous
			</Link>
			<Link
				href={`/home?page=${page + 1}${queryParams}`}
				className={cn("px-3 py-2 border rounded-md", page === totalPages && "pointer-events-none opacity-50")}
				aria-disabled={page === totalPages}>
				Next
			</Link>
			<Link
				href={`/home?page=${totalPages}${queryParams}`}
				className={cn("px-3 py-2 border rounded-md", page === totalPages && "pointer-events-none opacity-50")}
				aria-disabled={page === totalPages}>
				Last
			</Link>
		</div>
	);
}
