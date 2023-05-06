import { Flex, Spinner } from "@chakra-ui/react";
import {
	createContext,
	Dispatch,
	useContext,
	useReducer,
	useState,
} from "react";

type Actions = {
	type: "loader";
	payload: boolean;
};

type TUiContext = [TUiContextState, Dispatch<Actions>];

type TUiContextState = {
	showLoader: boolean;
};

const UiContext = createContext<TUiContext | undefined>(undefined);

export const useUi = () => {
	const context = useContext(UiContext);
	if (!context) {
		throw new Error("useUi must be used within a UiProvider");
	}
	return context;
};

const LoadingOverlay = () => {
	return (
		<Flex
			position="fixed"
			top={0}
			left={0}
			right={0}
			bottom={0}
			alignItems="center"
			justifyContent="center"
			bg="rgba(0,0,0,0.6)"
		>
			<Spinner size="lg" />
		</Flex>
	);
};

const reducer = (state: TUiContextState, action: Actions) => {
	switch (action.type) {
		case "loader":
			return { ...state, showLoader: action.payload };
		default:
			return state;
	}
};

export const UiProvider = ({ children }) => {
	const [state, dispatch] = useReducer(reducer, { showLoader: false });

	return (
		<UiContext.Provider value={[state, dispatch]}>
			{children}
			{state.showLoader && <LoadingOverlay />}
		</UiContext.Provider>
	);
};
