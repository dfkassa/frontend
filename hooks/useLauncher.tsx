import { WASMContext } from "context/WASM";
import React from "react";

interface LaunchResult<T, EB> {
    result: T,
    isError: EB
}


export default function useLauncher():
    LaunchResult<import('wasm').LaunchOutput, false>
    | LaunchResult<string, true>
    | null
{
    const wasm = React.useContext(WASMContext);
    const [launchOutput, setLaunchOutput] = React.useState<import('wasm').LaunchOutput | null>(null);
    const [launchErrorReason, setLaunchErrorReason] = React.useState<string | null>(null);

    React.useEffect(() => {
        console.log(window.location.search)
        if (!launchOutput && !launchErrorReason) {
            wasm.wasm?.launch_app(window.location.search)
            .then(res => setLaunchOutput(res))
            .catch(err => setLaunchErrorReason(err.message))
        }
    }, [wasm])

    if (launchOutput) {
        return {
            result: launchOutput,
            isError: false
        }
    } else if (launchErrorReason) {
        return {
            result: launchErrorReason,
            isError: true
        }
    } else {
        return null;
    }
}
