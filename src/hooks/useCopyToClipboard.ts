import { useToast } from "@chakra-ui/react";

export const useCopyToClipboard = (text: string, title: string) => {
	const toast = useToast();
	const copyToClipboard = () => {
		navigator.clipboard.writeText(text).then(() => {
			toast({
				variant: "subtle",
				status: "success",
				title,
			});
		});
	};

	return copyToClipboard;
};
