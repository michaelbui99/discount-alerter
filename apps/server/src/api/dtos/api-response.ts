type ApiResponseDto = {
    title: string;
    status: number;
    data?: any;
    error?: any;
};

export class ApiResponse implements ApiResponseDto {
    title: string;
    status: number;
    data?: any;
    error?: any;

    public static Ok(props: {
        title?: string;
        data?: any;
        error?: any;
    }): ApiResponseDto {
        return {
            title: props.title ?? 'OK',
            status: 200,
            ...props,
        };
    }

    public static InternalServerError(props?: {
        title?: string;
        data?: any;
        error?: any;
    }): ApiResponseDto {
        if (!props) {
            props = {};
        }
        return {
            title: props.title ?? 'Internal Server Error',
            error: props.error ?? 'Something unexpected went wrong',
            status: 500,
            ...props,
        };
    }
}
