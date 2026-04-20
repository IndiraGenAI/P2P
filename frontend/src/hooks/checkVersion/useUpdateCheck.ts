import { useCallback, useEffect, useState } from 'react';
import { UpdateHookParams, UpdateHookReturnValue, UpdateStatus, VersionFileResponse } from './types';

const reloadPage = () => window.location.reload();

const currentVersion = window.__APP_VERSION__;

export const useUpdateCheck = ({ type }: UpdateHookParams): UpdateHookReturnValue => {
    const [status, setStatus] = useState<UpdateStatus>(UpdateStatus.checking);

    const checkUpdate = useCallback(() => {
        if (typeof currentVersion === 'undefined') {
            setStatus(UpdateStatus.current);
            return;
        }

        setStatus(UpdateStatus.checking);

        let requestStr = `/${window.__APP_VERSION_FILE__}`;

        fetch(requestStr, { cache: 'no-cache' })
            .then((res) => res.json() as Promise<VersionFileResponse>)
            .then((data) => {
                if (data.version === currentVersion) {
                    setStatus(UpdateStatus.current);
                } else {
                    setStatus(UpdateStatus.available);
                }
            })
            .catch(() => {
                setStatus(UpdateStatus.current);
            });
    }, []);

    useEffect(() => {
        if (type !== 'manual') {
            checkUpdate();
        }
    }, [checkUpdate, type]);

    useEffect(() => {
        if (status !== UpdateStatus.current) {
            return;
        }
    }, [type, status, checkUpdate]);

    return { status, reloadPage, checkUpdate };
};
