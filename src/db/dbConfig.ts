import mongoose from "mongoose"
import { edgeServerAppPaths } from "next/dist/build/webpack/plugins/pages-manifest-plugin"

const url = process.env.MONGO_URI as string
let connection: typeof mongoose

const startDb = async () => {
  if (!connection) connection = await mongoose.connect(url)
  return connection
}

export default startDb
