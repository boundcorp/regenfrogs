import {createContext, FC, PropsWithChildren, useCallback, useContext, useEffect, useState} from "react";
import {
    UserProfileFragment,
    useMyProfileQuery,
    useMyProfileLazyQuery
} from "../../generated/graphql";
import {
    clearAuthAndLogout,
    getRefreshToken,
    setAuthToken,
    TokenStatus,
    tokenStatus
} from "../../lib/auth";

export type ProfileContextValues = {
    profile?: UserProfileFragment | null | undefined;
    labStaff?: boolean;
    loading: boolean;
    impersonating?: boolean;
}

export const ProfileContext = createContext<ProfileContextValues>({loading: true})

export const ProfileProvider: FC<PropsWithChildren> = ({children}) => {
    const query = useMyProfileQuery();
    const profile = query.data?.myProfile?.id ? query.data.myProfile : null
    const [status, setStatus] = useState<TokenStatus>(tokenStatus())

    const checkTokenRefresh = useCallback(() => {
        console.debug("Checking token...")
        async function doTokenRefresh() {
            console.info("Refreshing token...")
            try {
                //const result = await refresh({variables: {refreshToken: getRefreshToken()}})
                //const newToken = result.data?.refreshToken
                //if (newToken?.token)
                //setAuthToken(newToken.token, newToken.refreshToken || "")
                await query.refetch()
                setStatus(tokenStatus())
            } catch (e) {
                clearAuthAndLogout()
            }
        }

        if (status === TokenStatus.REFRESH)
            doTokenRefresh()

        if (status === TokenStatus.EXPIRED) {
            clearAuthAndLogout()
        }

        if (status === TokenStatus.NONE) {
            console.debug("No login token")
        }
        if(status === TokenStatus.VALID) {
            console.debug("Token valid")
        }

    }, [fetch, status])

    useEffect(checkTokenRefresh, [checkTokenRefresh])
    useEffect(() => {
        const interval = setInterval(() => {
            setStatus(tokenStatus())
        }, 5_000)
        return () => clearInterval(interval)
    }, [])
    useEffect(() => {
        if(process.browser) {
            query.refetch()
        }
    }, [process.browser])


    return <ProfileContext.Provider value={{
        profile,
        loading: query.loading
    }}>
        {children}
    </ProfileContext.Provider>
}

export const useProfile = () => useContext(ProfileContext)
