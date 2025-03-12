const url = "https://backend-ticket-hack-seven.vercel.app";

async function getTrips() {
  try {
    const fetchData = await fetch(`${url}/users/session`);
    const data = await fetchData.json();
    console.log(data);
    if (data && data.sessionId) {
      return data.sessionId;
    } else {
      console.error("No session ID found.");
      return null;
    }
  } catch (error) {}
}

getTrips();
