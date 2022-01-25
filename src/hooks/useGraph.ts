import { msalInstance } from '@/authConfig'
import { AuthenticationResult, AccountInfo } from '@azure/msal-browser';
import { ref, Ref } from 'vue'
// import { AuthenticationResult } from '@azure/msal-browser'

const account = msalInstance.getAllAccounts()[0]
const request = {
    scopes: ['offline_access People.Read User.Read User.ReadWrite'],
}
const loginPop = async (request: { scopes: string[] }) => {

    try {
        const loginResponse = await msalInstance.loginPopup(request);
        console.log(loginResponse);

    } catch (err) {
        throw new Error("loginError");

    }
}
export const getAuthGraph = () => {



    const token = ref<AuthenticationResult>();



    const getToken = async () => {


        if (!account) {
            await loginPop(request)
            console.log('try to auth popup');
        } else {
            try {
                token.value = await msalInstance.acquireTokenSilent({ ...request, account })
            } catch (error) {
                console.log(error, 'error get token in silent mode')
                try {
                    token.value = await msalInstance.acquireTokenPopup(request)
                } catch (error) {
                    console.log(error, 'error in get token');
                }
            }
        }
    }

    return { getToken, token }
}