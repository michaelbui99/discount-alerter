"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSallingGroupAPIClient = void 0;
function createSallingGroupAPIClient(authToken) {
    const baseUrl = 'https://api.sallinggroup.com/v1';
    const endpoint = (endpoint) => `${baseUrl}/${endpoint}`;
    const getJson = async (url) => {
        const response = await fetch(url, {
            headers: {
                Authorization: `bearer ${authToken}`,
                Accept: 'application/json',
            },
        });
        return response.json();
    };
    const foodWaste = {
        async byStoreId(storeId) {
            return (await getJson(endpoint(`food-waste/${storeId}`)));
        },
    };
    return {
        foodWaste,
    };
}
exports.createSallingGroupAPIClient = createSallingGroupAPIClient;
//# sourceMappingURL=api-client.js.map