import { Client } from "pg";

// export const dbConnect = () => {
//   const;
// };

export const getBoards = async () => {
  const client = new Client();
  await client.connect();

  client
    .query("SELECT * FROM boards")
    .then((res) => console.log(res))
    .catch((e) => console.log(e));
  await client.end();
};
