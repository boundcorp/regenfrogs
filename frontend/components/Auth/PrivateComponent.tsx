import {FC, PropsWithChildren, ReactElement, ReactNode} from 'react'
import {useProfile} from "./ProfileProvider";

export const PrivateComponent: FC<PropsWithChildren> = ({children}) => {
    const {profile} = useProfile();
    if(!profile) {
        return <></>
    }
    return <>{children}</>
}

export const PublicComponent: FC<PropsWithChildren> = ({children}) => {
    const {profile} = useProfile();
    if(profile) {
        return <></>
    }
    return <>{children}</>
}
