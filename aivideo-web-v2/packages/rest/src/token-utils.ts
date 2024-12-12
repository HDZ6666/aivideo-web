export function getAccessToken(): Promise<string | null> {
	return Promise.resolve(localStorage.getItem("wvp-token"));
}