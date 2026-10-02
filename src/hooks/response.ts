export interface SetResponseProps {
    status: number;
    message: string;
    body?: any;
}

export interface SetErrResponseProps {
    status: number;
    message: string;
    err?: any;
}

export const SetResponse = (props: SetResponseProps): SetResponseProps => props

export const SetErrResponse = (props: SetErrResponseProps): SetErrResponseProps => props
