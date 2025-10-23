import axios from "axios";

let accessToken: string | null = null;

type RefreshResponse = {
    data: {
        accessToken: string,
        login: string,
        role: string
    }
}

type RefreshResponseData = {
    accessToken: string,
    login: string,
    role: string
};

export const auth = {
    getAccessToken: () => accessToken,
    setAccessToken: (token: string | null) => { accessToken = token; },
    clearAccessToken: () => { accessToken = null; },
    refreshAccessToken: async (): Promise<RefreshResponseData | null> => {
        try {

            const response: RefreshResponse = await axios.post(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/refresh`,
                {},
                {
                    withCredentials: true
                }
            );

            const data: RefreshResponseData = response.data;

            auth.setAccessToken(data.accessToken);

            return data;
        } catch (error) {
            console.log(error);
            auth.clearAccessToken();
            return null;
        }
    }
};