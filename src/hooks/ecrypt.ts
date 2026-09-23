
export interface UserInfoType {
    userId: string
    name: string
    email: string
    image: string
    exp: number
    iat: number
}

export const JWTDecrypt = async (req: any): Promise<UserInfoType> => {
    return req.user as UserInfoType;
}