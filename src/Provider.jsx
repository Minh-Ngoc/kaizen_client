/* eslint-disable react/no-children-prop */
import { Provider as ReduxProvider } from "react-redux";
import { NextUIProvider } from "@nextui-org/react";
import { store } from "./_redux/store";
import Modal from "app/components/Modal";
import { lazy } from 'react';
import { ToastContainer } from "react-toastify";
const Page = lazy(() => import('./Page'));

function Provider({ children }) {
    return (  
        <ReduxProvider store={store}>
            <NextUIProvider>
                <ToastContainer
                    theme="colored"
                    autoClose={3000}
                    pauseOnHover={false}
                    style={{ minWidth: "max-content" }}
                />
               <Page children={children} />
               <Modal />
            </NextUIProvider>
        </ReduxProvider>
    );
}

export default Provider;