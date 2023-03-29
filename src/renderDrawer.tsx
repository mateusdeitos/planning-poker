import { Drawer, DrawerOverlay, DrawerProps, useDisclosure } from "@chakra-ui/react";
import React, { cloneElement, createContext, PropsWithChildren, useContext } from "react";
import { createRoot } from "react-dom/client";
import { AppContext } from "./context/AppContext";

type TContext<T> = {
	close: (values?: T) => void;
	reject: (error?: any) => void;
}

const DrawerContext = createContext<TContext<any> | undefined>(undefined);
export const useDrawerContext = <T extends unknown = never>() => {
	const context = useContext<TContext<T>>(DrawerContext);
	if (!context) {
		throw new Error('useDrawerContext must be used within a DrawerProvider');
	}
	return context
}

export const DrawerContainer = ({ children, ...props }: PropsWithChildren<TDrawerComponent<unknown>>) => {
	return <Drawer {...props}>
		<DrawerOverlay />
		{children}
	</Drawer>
}

export type TDrawerComponent<T> = Omit<DrawerProps, "children"> & T;

// Render a drawer in a portal and return a promise that resolves when the drawer is closed
export const renderDrawer = <T extends unknown = any>(Component: React.FC<TDrawerComponent<any>>) => {
	const drawer = document.querySelector('.chakra-portal');

	return new Promise<T>((resolve, _reject) => {
		const Provider = () => {
			const { isOpen, onClose } = useDisclosure({ defaultIsOpen: true });
			const close = (values?: T) => {
				resolve(values ?? null);
				onClose();
			};

			const reject = (...args) => {
				_reject(...args);
				onClose();
			}

			return <DrawerContext.Provider value={{ close, reject }}>
				<Component isOpen={isOpen} onClose={onClose} />
			</DrawerContext.Provider>;
		};

		const root = createRoot(drawer);
		root.render(<AppContext>
			<Provider />
		</AppContext>);
	});
};
