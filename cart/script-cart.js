const url = "https://backend-ticket-hack-seven.vercel.app";

async function getSessionId() {
  const response = await fetch(`${url}/users/session`);
  const data = await response.json();

  if (data && data.sessionId) {
    return data.sessionId;
  } else {
    console.error("No session ID found.");
    return null;
  }
}

async function getTrips() {
  try {
    console.log("Fetching trips...");
    const fetchSession = await fetch(`${url}/users/session`);
    const sessionData = await fetchSession.json();

    if (!sessionData || !sessionData.sessionId) {
      console.error("No session ID found.");
      return null;
    }

    const sessionId = sessionData.sessionId;

    const fetchUser = await fetch(`${url}/users/${sessionId}`);
    const user = await fetchUser.json();
    console.log(user);

    return sessionId;
  } catch (error) {
    console.error("Error fetching trips:", error);
    return null;
  }
}

getTrips();
