const cookie = cookies().get("session")?.value

let session = null

if (cookie) {
  try {
    session = JSON.parse(cookie)
  } catch {
    session = null
  }
}
