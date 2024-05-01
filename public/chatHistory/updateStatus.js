import { env } from "../env";
export async function updateStatus(val) {
  // console.log("updateStatus function is called");
  let token = localStorage.getItem("token");
  let id = localStorage.getItem("userId");
  const url = `${env.protocol}://${env.server}:${env.port}/rest/v1/users/${id}`;
  const response = await fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify({
      availability: val,
    }),
  });
  const data = await response.json();
  // console.log("update status response", data);
}
